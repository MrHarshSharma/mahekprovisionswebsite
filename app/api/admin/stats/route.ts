import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = createServiceRoleClient()

        // Run all queries in parallel - using COUNT and RPC for instant results
        const [
            productsCountResult,
            totalOrdersResult,
            pendingOrdersResult,
            revenueResult
        ] = await Promise.all([
            // Count products (instant with index)
            supabase
                .from('product')
                .select('*', { count: 'exact', head: true }),

            // Count total orders (instant with index)
            supabase
                .from('orders')
                .select('*', { count: 'exact', head: true }),

            // Count pending orders (uses index on status column)
            supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending'),

            // Get total revenue using database function (instant)
            supabase.rpc('get_total_revenue')
        ])

        if (productsCountResult.error) {
            throw new Error(`Products error: ${productsCountResult.error.message}`)
        }
        if (totalOrdersResult.error) {
            throw new Error(`Total orders error: ${totalOrdersResult.error.message}`)
        }
        if (pendingOrdersResult.error) {
            throw new Error(`Pending orders error: ${pendingOrdersResult.error.message}`)
        }
        if (revenueResult.error) {
            throw new Error(`Revenue error: ${revenueResult.error.message}`)
        }

        const totalRevenue = revenueResult.data || 0

        return NextResponse.json({
            success: true,
            stats: {
                totalOrders: totalOrdersResult.count || 0,
                pendingOrders: pendingOrdersResult.count || 0,
                totalRevenue,
                totalProducts: productsCountResult.count || 0
            }
        })

    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch admin stats',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
