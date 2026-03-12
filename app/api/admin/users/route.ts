import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - List all users
export async function GET() {
    try {
        const supabase = createServiceRoleClient()

        const { data, error } = await supabase
            .from('users')
            .select('id, email, full_name, avatar_url, role, last_login')
            .order('last_login', { ascending: false })

        if (error) {
            console.error('Error fetching users:', error)
            return NextResponse.json(
                { error: 'Failed to fetch users', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, users: data })
    } catch (error) {
        console.error('Users fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PATCH - Update user role
export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { userId, role } = body

        if (!userId || !role) {
            return NextResponse.json(
                { error: 'Missing userId or role' },
                { status: 400 }
            )
        }

        if (!['admin', 'editor', 'user'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role. Must be admin, editor, or user' },
                { status: 400 }
            )
        }

        const supabase = createServiceRoleClient()

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
    } catch (error) {
        console.error('Role update error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
