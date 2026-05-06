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

    // Maintenance mode check
    if (process.env.LIVE_STATUS === 'false') {
        const maintenanceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Under Maintenance | Mahek Provisions</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #fef9e7 0%, #fff8e1 50%, #fff3cd 100%);
            color: #333;
            text-align: center;
            padding: 20px;
        }
        .container { max-width: 500px; }
        .icon { font-size: 64px; margin-bottom: 24px; display: inline-block; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.15); opacity: 0.7; }
        }
        h1 { font-size: 28px; font-weight: 700; color: #b8860b; margin-bottom: 12px; }
        p { font-size: 16px; color: #666; line-height: 1.6; margin-bottom: 8px; }
        .brand { margin-top: 32px; font-size: 14px; color: #b8860b; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📋</div>
        <h1>Subscription Expired</h1>
        <p>Your subscription has expired. Please contact support to renew.</p>
        <div class="brand">Mahek Provisions</div>
    </div>
</body>
</html>`
        return new NextResponse(maintenanceHtml, {
            status: 503,
            headers: { 'Content-Type': 'text/html', 'Retry-After': '3600' },
        })
    }

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
