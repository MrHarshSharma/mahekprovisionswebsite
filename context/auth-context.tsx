'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldX, X } from 'lucide-react'

type UserRole = 'admin' | 'editor' | 'user'

type AuthContextType = {
    user: User | null
    session: Session | null
    loading: boolean
    role: UserRole
    isAdmin: boolean
    isEditor: boolean
    isBlocked: boolean
    loginWithGoogle: (nextPath?: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState<UserRole>('user')
    const [isBlocked, setIsBlocked] = useState(false)
    const [showBlockedPopup, setShowBlockedPopup] = useState(false)
    const supabase = createClient()

    const fetchUserRole = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('role, isblocked')
                .eq('id', userId)
                .single()

            if (!error && data) {
                // Check if user is blocked
                if (data.isblocked) {
                    setIsBlocked(true)
                    setShowBlockedPopup(true)
                    // Log out blocked user
                    await supabase.auth.signOut()
                    setUser(null)
                    setSession(null)
                    setRole('user')
                    return
                }

                setIsBlocked(false)
                setRole((data.role as UserRole) || 'user')
            } else {
                setRole('user')
                setIsBlocked(false)
            }
        } catch {
            setRole('user')
            setIsBlocked(false)
        }
    }

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
            if (session?.user) {
                fetchUserRole(session.user.id)
            }
        }

        getSession()

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
            if (session?.user) {
                fetchUserRole(session.user.id)
            } else {
                setRole('user')
                setIsBlocked(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    const loginWithGoogle = async (nextPath?: string) => {
        const origin = window.location.origin
        const redirectTo = nextPath
            ? `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
            : `${origin}/auth/callback`

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
            },
        })
        if (error) console.error('Error logging in with Google:', error.message)
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) console.error('Error logging out:', error.message)
        setRole('user')
        setIsBlocked(false)

        // Redirect to homepage if on admin route
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
            window.location.href = '/'
        }
    }

    const isAdmin = role === 'admin'
    const isEditor = role === 'admin' || role === 'editor'

    return (
        <AuthContext.Provider value={{ user, session, loading, role, isAdmin, isEditor, isBlocked, loginWithGoogle, logout }}>
            {children}

            {/* Blocked User Popup */}
            <AnimatePresence>
                {showBlockedPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setShowBlockedPopup(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowBlockedPopup(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-400" />
                            </button>

                            {/* Icon */}
                            <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                                <ShieldX className="h-10 w-10 text-red-500" />
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                                Account Blocked
                            </h2>

                            {/* Message */}
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                We found some malicious activities from this account. It has been blocked by the auditor.
                            </p>

                            {/* Contact Info */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <p className="text-sm text-gray-500">
                                    If you believe this is a mistake, please contact us at:
                                </p>
                                <a
                                    href="tel:+917666513264"
                                    className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                                >
                                    +91 76665 13264
                                </a>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setShowBlockedPopup(false)}
                                className="w-full py-3 px-6 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                I Understand
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
