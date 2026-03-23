'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, X, Phone } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const { toggleCart, cartCount } = useCart()
    const { user, loginWithGoogle, logout, isEditor, loading } = useAuth()
    const [showProfilePopup, setShowProfilePopup] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    const closeMenu = () => setIsMenuOpen(false)

    return (
        <>
            <header className="header-glass">
                <nav>
                    <Link href="/" className="logo-container" style={{ position: 'relative', width: '100px', height: '45px' }}>
                        <Image src="/logo.png" alt="Mahek Provisions Logo" fill priority style={{ objectFit: 'contain' }} />
                    </Link>

                    <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                        <Link href="/" onClick={closeMenu}>Home</Link>
                        <Link href="/products" onClick={closeMenu}>Products</Link>
                        <Link href="/about" onClick={closeMenu}>About</Link>
                        <Link href="/contact" onClick={closeMenu}>Contact</Link>
                        {isEditor && (
                            <Link href="/admin" onClick={closeMenu}>Dashboard</Link>
                        )}
                        {user && !isEditor && (
                            <Link href="/my-orders" onClick={closeMenu}>My Orders</Link>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Phone Number */}
                        <a
                            href="tel:+919359587859"
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                        >
                            <Phone className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                            <span>+91 93595 87859</span>
                        </a>

                        {/* User Profile */}
                        {loading ? (
                            <div className="h-9 w-9 rounded-full bg-white/50 animate-pulse border border-white/20" />
                        ) : user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfilePopup(!showProfilePopup)}
                                    className="relative flex items-center gap-2 bg-white rounded-full shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
                                >
                                    {user.user_metadata.avatar_url ? (
                                        <div className="relative h-9 w-9 rounded-full overflow-hidden border border-gray-100">
                                            <Image
                                                src={user.user_metadata.avatar_url}
                                                alt={user.user_metadata.full_name || 'User'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="p-2.5 text-gray-700">
                                            <User className="h-5 w-5" />
                                        </div>
                                    )}
                                </button>

                                {/* Profile Popup */}
                                <AnimatePresence>
                                    {showProfilePopup && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowProfilePopup(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                className="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-50"
                                            >
                                                <div className="flex items-center gap-4 mb-5 border-b border-gray-100 pb-5">
                                                    {user.user_metadata.avatar_url && (
                                                        <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-yellow-200 shadow-sm">
                                                            <Image src={user.user_metadata.avatar_url} alt="Profile" fill className="object-cover" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <h3 className="text-sm font-bold text-gray-900 truncate">{user.user_metadata.full_name || 'Member'}</h3>
                                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => { logout(); setShowProfilePopup(false); }} className="w-full py-2.5 text-sm font-semibold text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-100">Sign Out</button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={() => loginWithGoogle()}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                            >
                                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="hidden sm:inline">Sign In</span>
                            </button>
                        )}

                        {/* Cart Icon */}
                        <button
                            onClick={toggleCart}
                            className="relative bg-white p-2.5 rounded-full shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
                            style={{ color: 'var(--secondary)' }}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ring-2 ring-white"
                                    style={{ background: 'var(--primary)' }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Hamburger */}
                        <button
                            className={`hamburger ${isMenuOpen ? 'open' : ''}`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Fullscreen Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] md:hidden flex flex-col"
                        style={{ background: 'var(--background)' }}
                    >
                        {/* Top Accent */}
                        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'var(--primary)' }} />

                        {/* Menu Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col">
                            {/* Top Header & Close Button */}
                            <div className="flex items-center justify-between mb-12">
                                <p className="text-xs uppercase tracking-widest" style={{ opacity: 0.4 }}>
                                    Mahek Provisions
                                </p>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-3 bg-white rounded-full shadow-lg border text-gray-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="w-full max-w-sm">
                                <div className="flex flex-col gap-10 w-full mb-16 pl-2">
                                    {[
                                        { name: 'Home', href: '/' },
                                        { name: 'Products', href: '/products' },
                                        { name: 'About', href: '/about' },
                                        { name: 'Contact', href: '/contact' },
                                    ].map((link, idx) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * (idx + 1) }}
                                        >
                                            <Link
                                                onClick={() => setIsMenuOpen(false)}
                                                href={link.href}
                                                className="group flex items-end gap-4 text-3xl font-bold transition-all"
                                                style={{
                                                    color: pathname === link.href ? 'var(--primary)' : 'var(--secondary)',
                                                    fontFamily: 'var(--font-heading)'
                                                }}
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    ))}

                                    {isEditor && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <Link
                                                onClick={() => setIsMenuOpen(false)}
                                                href="/admin"
                                                className="group flex items-end gap-4 text-3xl font-bold transition-all"
                                                style={{
                                                    color: pathname === '/admin' ? 'var(--primary)' : 'var(--secondary)',
                                                    fontFamily: 'var(--font-heading)'
                                                }}
                                            >
                                                Dashboard
                                            </Link>
                                        </motion.div>
                                    )}

                                    {user && !isEditor && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <Link
                                                onClick={() => setIsMenuOpen(false)}
                                                href="/my-orders"
                                                className="group flex items-end gap-4 text-3xl font-bold transition-all"
                                                style={{
                                                    color: pathname === '/my-orders' ? 'var(--primary)' : 'var(--secondary)',
                                                    fontFamily: 'var(--font-heading)'
                                                }}
                                            >
                                                My Orders
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-auto pb-8 pt-12 flex justify-center">
                                <p className="text-xs uppercase tracking-widest" style={{ opacity: 0.3 }}>
                                    Est. Mahek Provisions - Quality Since Decades
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
