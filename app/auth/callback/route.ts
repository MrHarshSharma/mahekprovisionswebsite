import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirection URL after successful sign in
    const next = searchParams.get('next') ?? '/'

    const forwardedHost = request.headers.get('x-forwarded-host')
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
    const isLocalEnv = process.env.NODE_ENV === 'development'

    // Resolve the correct public base URL (handles Hostinger internal proxy)
    const baseUrl = isLocalEnv
        ? origin
        : forwardedHost
            ? `${forwardedProto}://${forwardedHost}`
            : appUrl || origin

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error && data.user) {
            const user = data.user
            // Sync user data to 'users' table
            try {
                const { createServiceRoleClient } = await import('@/utils/supabase/service-role')
                const serviceRole = createServiceRoleClient()
                await serviceRole
                    .from('users')
                    .upsert({
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata.full_name,
                        avatar_url: user.user_metadata.avatar_url,
                        last_login: new Date().toISOString()
                    }, { onConflict: 'id' })
            } catch (syncError) {
                console.error('Error syncing user data:', syncError)
                // Don't block login if sync fails
            }

            return NextResponse.redirect(`${baseUrl}${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`)
}
