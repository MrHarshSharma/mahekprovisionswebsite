'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, X, Phone, Home, ShoppingBag, Info, Mail, LayoutDashboard, Package, Menu } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

const GoogleIcon = () => (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
)

export default function Navbar() {
    const { toggleCart, cartCount } = useCart()
    const { user, loginWithGoogle, logout, isEditor, loading } = useAuth()
    const [showProfilePopup, setShowProfilePopup] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    const closeMenu = () => setIsMenuOpen(false)

    return (
        <>
            {/* Desktop / Tablet Header */}
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
                            href="tel:+917666513264"
                            className="flex items-center justify-center gap-2 h-10 w-10 md:w-auto md:px-4 bg-white border border-gray-100 text-gray-800 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                        >
                            <Phone className="h-5 w-5 text-gray-800" />
                            <span className="hidden md:inline">+91 76665 13264</span>
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
                                className="flex items-center justify-center gap-2 h-10 w-10 sm:w-auto sm:px-4 bg-white border border-gray-100 text-gray-800 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                            >
                                <GoogleIcon />
                                <span className="hidden sm:inline">Sign In</span>
                            </button>
                        )}

                        {/* Cart Icon */}
                        <button
                            onClick={toggleCart}
                            className="relative flex items-center justify-center h-10 w-10 bg-white rounded-full shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
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

            {/* ─── Mobile Bottom Bar ─── */}
            <div className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden">
                <div
                    className="flex items-center justify-around px-4"
                    style={{
                        height: '60px',
                        background: 'rgba(255,253,245,0.97)',
                        boxShadow: '0 -2px 16px rgba(0,0,0,0.06)',
                    }}
                >
                    {/* Call */}
                    <a href="tel:+917666513264" className="flex flex-col items-center gap-1">
                        <Phone className="h-[21px] w-[21px]" style={{ color: 'var(--secondary)', opacity: 0.6 }} />
                        <span className="text-[10px] font-medium" style={{ color: 'var(--secondary)', opacity: 0.5 }}>Call</span>
                    </a>

                    {/* Products */}
                    <Link href="/products" className="flex flex-col items-center gap-1">
                        <ShoppingBag
                            className="h-[21px] w-[21px]"
                            style={{ color: pathname === '/products' ? 'var(--primary)' : 'var(--secondary)', opacity: pathname === '/products' ? 1 : 0.6 }}
                        />
                        <span
                            className="text-[10px] font-medium"
                            style={{ color: pathname === '/products' ? 'var(--primary)' : 'var(--secondary)', opacity: pathname === '/products' ? 1 : 0.5 }}
                        >
                            Products
                        </span>
                    </Link>

                    {/* Login / Profile */}
                    {loading ? (
                        <div className="flex flex-col items-center gap-1">
                            <div className="h-[21px] w-[21px] rounded-full bg-gray-100 animate-pulse" />
                            <span className="text-[10px] font-medium" style={{ opacity: 0.5 }}>Login</span>
                        </div>
                    ) : user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowProfilePopup(!showProfilePopup)}
                                className="flex flex-col items-center gap-1"
                            >
                                {user.user_metadata.avatar_url ? (
                                    <div className="relative h-[21px] w-[21px] rounded-full overflow-hidden border border-gray-200">
                                        <Image src={user.user_metadata.avatar_url} alt="Profile" fill className="object-cover" />
                                    </div>
                                ) : (
                                    <User className="h-[21px] w-[21px]" style={{ color: 'var(--secondary)', opacity: 0.6 }} />
                                )}
                                <span className="text-[10px] font-medium" style={{ color: 'var(--secondary)', opacity: 0.5 }}>Profile</span>
                            </button>

                            {/* Profile Popup — opens upward */}
                            <AnimatePresence>
                                {showProfilePopup && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowProfilePopup(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute bottom-14 right-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-50"
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
                        <button onClick={() => loginWithGoogle()} className="flex flex-col items-center gap-1">
                            <GoogleIcon />
                            <span className="text-[10px] font-medium" style={{ color: 'var(--secondary)', opacity: 0.5 }}>Login</span>
                        </button>
                    )}

                    {/* Cart */}
                    <button onClick={toggleCart} className="relative flex flex-col items-center gap-1">
                        <ShoppingCart className="h-[21px] w-[21px]" style={{ color: 'var(--secondary)', opacity: 0.6 }} />
                        {cartCount > 0 && (
                            <span
                                className="absolute -top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                                style={{ background: '#e44' }}
                            >
                                {cartCount}
                            </span>
                        )}
                        <span className="text-[10px] font-medium" style={{ color: 'var(--secondary)', opacity: 0.5 }}>Cart</span>
                    </button>
                </div>

                {/* Safe-area fill for notched iPhones */}
                <div style={{ background: 'rgba(255,253,245,0.97)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
            </div>

        </>
    )
}
