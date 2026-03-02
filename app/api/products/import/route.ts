import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import * as XLSX from 'xlsx'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Read file buffer
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })

        // Get first sheet
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

        if (!jsonData || jsonData.length === 0) {
            return NextResponse.json(
                { error: 'No data found in Excel file' },
                { status: 400 }
            )
        }

        const supabase = createServiceRoleClient()

        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[],
            updated: 0
        }

        for (const row of jsonData) {
            try {
                // Parse categories (comma-separated string to array)
                let categories: string[] = []
                if (row['Categories']) {
                    categories = String(row['Categories']).split(',').map(c => c.trim()).filter(Boolean)
                }

                // Parse images (comma-separated URLs to array)
                let images: string[] = []
                if (row['Image URLs']) {
                    images = String(row['Image URLs']).split(',').map(i => i.trim()).filter(Boolean)
                }

                // Support simplified variation format (comma-separated names and prices)
                let variations: any[] = []
                if (row['Variation Names'] && row['Variation Prices']) {
                    const names = String(row['Variation Names']).split(',').map(n => n.trim()).filter(Boolean)
                    const prices = String(row['Variation Prices']).split(',').map(p => Number(p.trim())).filter(p => !isNaN(p))

                    if (names.length > 0 && names.length === prices.length) {
                        variations = names.map((name, idx) => ({
                            id: String(idx + 1),
                            name,
                            price: prices[idx],
                            is_default: idx === 0
                        }))
                    }
                }

                // Build description JSON from separate columns
                const descriptionObject = {
                    productDescription: row['Description'] || '',
                    productDetails: row['Details'] || '',
                    careInstructions: row['Care Instructions'] || ''
                }

                // Determine product type
                const productType = row['Type'] || 'simple'

                // For variable products, use 0 as price if not provided
                // For simple products, use the provided price or 0
                let price = 0
                if (row['Price'] && !isNaN(Number(row['Price']))) {
                    price = Number(row['Price'])
                } else if (productType === 'variable' && variations.length > 0) {
                    // Use first variation price as base price for variable products
                    price = variations[0]?.price || 0
                }

                const productData: any = {
                    name: row['Product Name'] || '',
                    description: JSON.stringify(descriptionObject),
                    price,
                    categories,
                    images,
                    product_type: productType,
                    variations: variations.length > 0 ? variations : null
                }

                // Validate required fields
                if (!productData.name) {
                    results.failed++
                    results.errors.push(`Row missing required field: Product Name`)
                    continue
                }

                // Check if product with ID exists (for update)
                // Only update if ID is provided and not empty
                const rowId = row['ID']
                const hasValidId = rowId !== undefined && rowId !== null && rowId !== '' && String(rowId).trim() !== ''

                if (hasValidId) {
                    const { data: existingProduct } = await supabase
                        .from('product')
                        .select('id')
                        .eq('id', rowId)
                        .single()

                    if (existingProduct) {
                        // Update existing product
                        const { error: updateError } = await supabase
                            .from('product')
                            .update(productData)
                            .eq('id', rowId)

                        if (updateError) {
                            results.failed++
                            results.errors.push(`Failed to update product ${row['Product Name']}: ${updateError.message}`)
                        } else {
                            results.updated++
                        }
                        continue
                    }
                }

                // Insert new product
                const { error: insertError } = await supabase
                    .from('product')
                    .insert(productData)

                if (insertError) {
                    results.failed++
                    results.errors.push(`Failed to insert product ${row['Product Name']}: ${insertError.message}`)
                } else {
                    results.success++
                }

            } catch (rowError) {
                results.failed++
                results.errors.push(`Error processing row: ${rowError instanceof Error ? rowError.message : 'Unknown error'}`)
            }
        }

        // Revalidate cached pages
        revalidatePath('/api/products')
        revalidatePath('/products')
        revalidatePath('/admin/products')

        return NextResponse.json({
            success: true,
            message: `Import completed: ${results.success} created, ${results.updated} updated, ${results.failed} failed`,
            results
        })

    } catch (error) {
        console.error('Import error:', error)
        return NextResponse.json(
            { error: 'Failed to import products', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
