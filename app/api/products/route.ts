import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Disable static caching - always fetch fresh data
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, description, price, categories, images, product_type, variations } = body

        // Validate required fields
        if (!name || !description || !images || images.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate product type specific requirements
        if (product_type === 'simple' && !price) {
            return NextResponse.json(
                { error: 'Price is required for simple products' },
                { status: 400 }
            )
        }

        if (product_type === 'variable' && (!variations || variations.length === 0)) {
            return NextResponse.json(
                { error: 'At least one variation is required for variable products' },
                { status: 400 }
            )
        }

        // Create Supabase client with service role (bypasses RLS)
        const supabase = createServiceRoleClient()

        // Prepare product data
        const productData: any = {
            name,
            description,
            categories: categories || [],
            images: images,
            product_type: product_type || 'simple',
        }

        // Add price for simple products
        if (product_type === 'simple') {
            productData.price = parseInt(price)
        } else {
            productData.price = null
        }

        // Add variations for variable products
        if (product_type === 'variable') {
            productData.variations = variations
        }

        // Insert product into database
        const { data, error } = await supabase
            .from('product')
            .insert(productData)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to create product', details: error.message },
                { status: 500 }
            )
        }

        // Revalidate cached pages after create
        revalidatePath('/api/products')
        revalidatePath('/products')
        revalidatePath('/admin/products')

        return NextResponse.json(
            {
                success: true,
                productId: data.id,
                message: 'Product created successfully'
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Product creation error:', error)
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    try {
        const supabase = createServiceRoleClient()
        const { searchParams } = new URL(request.url)

        // Pagination parameters
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const category = searchParams.get('category') || ''
        const paginated = searchParams.get('paginated') === 'true'

        // If not paginated, return all products (for backward compatibility)
        if (!paginated) {
            const { data, error } = await supabase
                .from('product')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Supabase error:', error)
                return NextResponse.json(
                    { error: 'Failed to fetch products', details: error.message },
                    { status: 500 }
                )
            }

            return NextResponse.json({
                success: true,
                products: data
            })
        }

        // Calculate offset
        const offset = (page - 1) * limit

        // Build query for count
        let countQuery = supabase
            .from('product')
            .select('*', { count: 'exact', head: true })

        // Build query for data
        let dataQuery = supabase
            .from('product')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        // Apply category filter if provided
        if (category && category !== 'All') {
            countQuery = countQuery.contains('categories', [category])
            dataQuery = dataQuery.contains('categories', [category])
        }

        // Execute both queries
        const [countResult, dataResult] = await Promise.all([
            countQuery,
            dataQuery
        ])

        if (countResult.error) {
            console.error('Supabase count error:', countResult.error)
            return NextResponse.json(
                { error: 'Failed to count products', details: countResult.error.message },
                { status: 500 }
            )
        }

        if (dataResult.error) {
            console.error('Supabase error:', dataResult.error)
            return NextResponse.json(
                { error: 'Failed to fetch products', details: dataResult.error.message },
                { status: 500 }
            )
        }

        const totalCount = countResult.count || 0
        const totalPages = Math.ceil(totalCount / limit)

        return NextResponse.json({
            success: true,
            products: dataResult.data,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })

    } catch (error) {
        console.error('Product fetch error:', error)
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
