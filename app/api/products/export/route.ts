import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const supabase = createServiceRoleClient()

        const { data: products, error } = await supabase
            .from('product')
            .select('*')
            .order('id', { ascending: true })

        if (error) {
            return NextResponse.json(
                { error: 'Failed to fetch products', details: error.message },
                { status: 500 }
            )
        }

        // Transform products for Excel export
        const exportData = products.map((product: any) => {
            // Extract variation names and prices for simplified format
            let variationNames = ''
            let variationPrices = ''
            if (product.variations && Array.isArray(product.variations)) {
                variationNames = product.variations.map((v: any) => v.name).join(', ')
                variationPrices = product.variations.map((v: any) => v.price).join(', ')
            }

            // Parse description JSON if it exists
            let description = ''
            let details = ''
            let careInstructions = ''
            try {
                const descObj = JSON.parse(product.description)
                description = descObj.productDescription || ''
                details = descObj.productDetails || ''
                careInstructions = descObj.careInstructions || ''
            } catch {
                description = product.description || ''
            }

            const baseData: any = {
                'ID': product.id,
                'Product Name': product.name,
                'Description': description,
                'Details': details,
                'Care Instructions': careInstructions,
                'Price': product.price || '',
                'Categories': Array.isArray(product.categories) ? product.categories.join(', ') : '',
                'Type': product.product_type || 'simple',
                'Variation Names': variationNames,
                'Variation Prices': variationPrices,
                'Image URLs': Array.isArray(product.images) ? product.images.join(', ') : '',
            }
            return baseData
        })

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(exportData)

        // Set column widths
        const columnWidths = [
            { wch: 10 },  // ID
            { wch: 40 },  // Product Name
            { wch: 50 },  // Description
            { wch: 40 },  // Details
            { wch: 30 },  // Care Instructions
            { wch: 12 },  // Price
            { wch: 25 },  // Categories
            { wch: 12 },  // Type
            { wch: 25 },  // Variation Names
            { wch: 20 },  // Variation Prices
            { wch: 80 },  // Image URLs
        ]
        worksheet['!cols'] = columnWidths

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

        // Return Excel file
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="products_${new Date().toISOString().split('T')[0]}.xlsx"`,
            },
        })

    } catch (error) {
        console.error('Export error:', error)
        return NextResponse.json(
            { error: 'Failed to export products', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
