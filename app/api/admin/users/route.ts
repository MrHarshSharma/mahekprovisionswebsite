import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - List users with pagination and search
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '50')
        const search = searchParams.get('search') || ''
        const role = searchParams.get('role') || ''
        const blocked = searchParams.get('blocked')
        const grouped = searchParams.get('grouped') === 'true'

        const supabase = createServiceRoleClient()

        // GROUPED MODE: Parallel queries for each role (faster than single query + filter)
        if (grouped) {
            const perGroup = parseInt(searchParams.get('perGroup') || '30')

            // Build base query conditions
            const searchFilter = search.trim() ? `email.ilike.%${search}%,full_name.ilike.%${search}%` : null

            // Run 4 parallel queries - one for each group + counts
            const [adminResult, editorResult, userResult, blockedResult, countsResult] = await Promise.all([
                // Admin users (not blocked)
                supabase
                    .from('users')
                    .select('id, email, full_name, avatar_url, role, last_login, isblocked')
                    .eq('role', 'admin')
                    .eq('isblocked', false)
                    .or(searchFilter || 'id.neq.00000000-0000-0000-0000-000000000000')
                    .order('last_login', { ascending: false, nullsFirst: false })
                    .limit(perGroup),

                // Editor users (not blocked)
                supabase
                    .from('users')
                    .select('id, email, full_name, avatar_url, role, last_login, isblocked')
                    .eq('role', 'editor')
                    .eq('isblocked', false)
                    .or(searchFilter || 'id.neq.00000000-0000-0000-0000-000000000000')
                    .order('last_login', { ascending: false, nullsFirst: false })
                    .limit(perGroup),

                // Regular users (not blocked)
                supabase
                    .from('users')
                    .select('id, email, full_name, avatar_url, role, last_login, isblocked')
                    .eq('role', 'user')
                    .eq('isblocked', false)
                    .or(searchFilter || 'id.neq.00000000-0000-0000-0000-000000000000')
                    .order('last_login', { ascending: false, nullsFirst: false })
                    .limit(perGroup),

                // Blocked users (any role)
                supabase
                    .from('users')
                    .select('id, email, full_name, avatar_url, role, last_login, isblocked')
                    .eq('isblocked', true)
                    .or(searchFilter || 'id.neq.00000000-0000-0000-0000-000000000000')
                    .order('last_login', { ascending: false, nullsFirst: false })
                    .limit(perGroup),

                // Get total counts for each group (parallel count queries) - with search filter if applicable
                Promise.all([
                    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'admin').eq('isblocked', false).or(searchFilter || 'id.neq.00000000-0000-0000-0000-000000000000'),
                    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'editor').eq('isblocked', false).or(searchFilter || 'id.neq.00000000-0000-0000-0000-000000000000'),
                    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user').eq('isblocked', false).or(searchFilter || 'id.neq.00000000-0000-0000-0000-000000000000'),
                    supabase.from('users').select('*', { count: 'exact', head: true }).eq('isblocked', true).or(searchFilter || 'id.neq.00000000-0000-0000-0000-000000000000'),
                ])
            ])

            if (adminResult.error || editorResult.error || userResult.error || blockedResult.error) {
                const error = adminResult.error || editorResult.error || userResult.error || blockedResult.error
                console.error('Error fetching users:', error)
                return NextResponse.json(
                    { error: 'Failed to fetch users', details: error?.message },
                    { status: 500 }
                )
            }

            const [adminCount, editorCount, userCount, blockedCount] = countsResult

            return NextResponse.json({
                success: true,
                grouped: {
                    admin: adminResult.data || [],
                    editor: editorResult.data || [],
                    user: userResult.data || [],
                    blocked: blockedResult.data || []
                },
                counts: {
                    admin: adminCount.count || 0,
                    editor: editorCount.count || 0,
                    user: userCount.count || 0,
                    blocked: blockedCount.count || 0,
                    total: (adminCount.count || 0) + (editorCount.count || 0) + (userCount.count || 0) + (blockedCount.count || 0)
                }
            })
        }

        // PAGINATED MODE: Original behavior for individual columns
        const from = (page - 1) * limit
        const to = from + limit - 1

        let query = supabase
            .from('users')
            .select('id, email, full_name, avatar_url, role, last_login, isblocked', { count: 'exact' })

        // Apply search filter (server-side)
        if (search.trim()) {
            query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
        }

        // Apply role filter
        if (role) {
            query = query.eq('role', role)
        }

        // Apply blocked filter
        if (blocked === 'true') {
            query = query.eq('isblocked', true)
        } else if (blocked === 'false') {
            query = query.eq('isblocked', false)
        }

        // Apply pagination and ordering
        const { data, error, count } = await query
            .order('last_login', { ascending: false, nullsFirst: false })
            .range(from, to)

        if (error) {
            console.error('Error fetching users:', error)
            return NextResponse.json(
                { error: 'Failed to fetch users', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            users: data,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            }
        })
    } catch (error) {
        console.error('Users fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PATCH - Update user role or blocked status
export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { userId, role, isblocked } = body

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing userId' },
                { status: 400 }
            )
        }

        const supabase = createServiceRoleClient()

        // Handle blocking/unblocking
        if (typeof isblocked === 'boolean') {
            const { data, error } = await supabase
                .from('users')
                .update({ isblocked })
                .eq('id', userId)
                .select()
                .single()

            if (error) {
                console.error('Error updating blocked status:', error)
                return NextResponse.json(
                    { error: 'Failed to update blocked status', details: error.message },
                    { status: 500 }
                )
            }

            return NextResponse.json({ success: true, user: data })
        }

        // Handle role update
        if (role) {
            if (!['admin', 'editor', 'user'].includes(role)) {
                return NextResponse.json(
                    { error: 'Invalid role. Must be admin, editor, or user' },
                    { status: 400 }
                )
            }

            const { data, error } = await supabase
                .from('users')
                .update({ role })
                .eq('id', userId)
                .select()
                .single()

            if (error) {
                console.error('Error updating user role:', error)
                return NextResponse.json(
                    { error: 'Failed to update role', details: error.message },
                    { status: 500 }
                )
            }

            return NextResponse.json({ success: true, user: data })
        }

        return NextResponse.json(
            { error: 'Missing role or isblocked field' },
            { status: 400 }
        )
    } catch (error) {
        console.error('User update error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
