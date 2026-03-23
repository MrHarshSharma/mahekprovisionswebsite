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

        const supabase = createServiceRoleClient()
        const from = (page - 1) * limit
        const to = from + limit - 1

        // Build query
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
