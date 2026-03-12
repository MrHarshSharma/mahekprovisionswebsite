import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

async function getUserRole(userId: string): Promise<string | null> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

    if (error || !data) return null
    return data.role || 'user'
}

export async function middleware(request: NextRequest) {
    const { nextUrl } = request
    const response = await updateSession(request)

    // Protect all /admin routes and sensitive admin APIs
    const isAdminRoute = nextUrl.pathname.startsWith('/admin')
    const isUserOrderRoute = nextUrl.pathname.startsWith('/my-orders')

    // Destructive APIs — admin only
    const isAdminOnlyApi = nextUrl.pathname.startsWith('/api/admin/users')

    // Editor-level APIs — admin or editor
    const isEditorApi = nextUrl.pathname.startsWith('/api/orders/list') ||
        (nextUrl.pathname.startsWith('/api/orders/') && request.method === 'PATCH') ||
        (nextUrl.pathname.startsWith('/api/products') && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) ||
        nextUrl.pathname.startsWith('/api/upload-images')

    if (isAdminRoute || isAdminOnlyApi || isEditorApi || isUserOrderRoute) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            request.cookies.set(name, value)
                        )
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()

        // 1. Basic Auth Check for User Routes
        if (!user && isUserOrderRoute) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // 2. Role-based access for Admin Routes/APIs
        if (isAdminRoute || isAdminOnlyApi || isEditorApi) {
            if (!user) {
                if (isAdminOnlyApi || isEditorApi) {
                    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
                }
                return NextResponse.redirect(new URL('/', request.url))
            }

            const role = await getUserRole(user.id)

            // Admin-only routes: /admin/users page and destructive APIs
            const isAdminOnlyRoute = nextUrl.pathname.startsWith('/admin/users')
            if (isAdminOnlyRoute || isAdminOnlyApi) {
                if (role !== 'admin') {
                    if (isAdminOnlyApi) {
                        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
                    }
                    return NextResponse.redirect(new URL('/admin', request.url))
                }
            }
            // Editor-level routes: all other /admin/* pages and editor APIs
            else if (isAdminRoute || isEditorApi) {
                if (role !== 'admin' && role !== 'editor') {
                    if (isEditorApi) {
                        return NextResponse.json({ error: 'Forbidden: Editor access required' }, { status: 403 })
                    }
                    return NextResponse.redirect(new URL('/', request.url))
                }
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
