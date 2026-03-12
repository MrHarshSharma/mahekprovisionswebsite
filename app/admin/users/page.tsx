'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Users, Shield, ShieldCheck, User, ChevronDown, ArrowLeft, Crown } from 'lucide-react'
import Link from 'next/link'

interface UserData {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: string
    last_login: string | null
}

const roleConfig = {
    admin: { label: 'Admin', icon: ShieldCheck, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    editor: { label: 'Editor', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    user: { label: 'User', icon: User, color: 'text-stone-600', bg: 'bg-stone-50', border: 'border-stone-200' },
}

const primaryAdminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').split(',').map(e => e.trim()).filter(Boolean)

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        const handleClick = () => setOpenDropdown(null)
        if (openDropdown) document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [openDropdown])

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users')
            const data = await res.json()
            if (data.success) setUsers(data.users)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const updateRole = async (userId: string, newRole: string) => {
        setUpdatingUserId(userId)
        setOpenDropdown(null)
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole }),
            })
            const data = await res.json()
            if (data.success) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
            }
        } catch (error) {
            console.error('Error updating role:', error)
        } finally {
            setUpdatingUserId(null)
        }
    }

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Never'
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
    }

    const isPrimaryAdmin = (email: string) => primaryAdminEmails.includes(email)

    const ownerUsers = users.filter(u => isPrimaryAdmin(u.email))
    const otherUsers = users.filter(u => !isPrimaryAdmin(u.email))

    const renderUserCard = (userData: UserData, index: number, showDropdown: boolean) => {
        const config = roleConfig[userData.role as keyof typeof roleConfig] || roleConfig.user
        const RoleIcon = config.icon
        const isUpdating = updatingUserId === userData.id
        const isOwner = isPrimaryAdmin(userData.email)

        return (
            <motion.div
                key={userData.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`backdrop-blur-xl rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all overflow-visible ${isOwner ? 'bg-amber-50/60 border-amber-200/60' : 'bg-white/60 border-white/40'} ${openDropdown === userData.id ? 'z-50 relative' : 'relative'}`}
            >
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className={`relative h-12 w-12 rounded-full overflow-hidden border-2 bg-stone-100 flex-shrink-0 ${isOwner ? 'border-amber-300' : 'border-stone-100'}`}>
                        {userData.avatar_url ? (
                            <Image src={userData.avatar_url} alt={userData.full_name || ''} fill className="object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center">
                                <User className="h-6 w-6 text-stone-400" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#2D1B1B] truncate">
                                {userData.full_name || 'Unnamed User'}
                            </h3>
                            {isOwner && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-wider rounded-full border border-amber-200">
                                    <Crown className="h-2.5 w-2.5" /> Owner
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-[#4A3737]/60 truncate">{userData.email}</p>
                        <p className="text-[10px] text-[#4A3737]/40 mt-0.5">
                            Last login: {formatDate(userData.last_login)}
                        </p>
                    </div>

                    {/* Role Badge (no dropdown) or Role Dropdown */}
                    {showDropdown ? (
                        <div className="relative flex-shrink-0">
                            <button
                                onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === userData.id ? null : userData.id) }}
                                disabled={isUpdating}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${config.bg} ${config.color} ${config.border} ${isUpdating ? 'opacity-50' : 'hover:shadow-md'}`}
                            >
                                <RoleIcon className="h-3.5 w-3.5" />
                                {isUpdating ? 'Updating...' : config.label}
                                <ChevronDown className="h-3 w-3" />
                            </button>

                            {openDropdown === userData.id && (
                                <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-50">
                                    {Object.entries(roleConfig).map(([roleKey, roleConf]) => {
                                        const RIcon = roleConf.icon
                                        return (
                                            <button
                                                key={roleKey}
                                                onClick={(e) => { e.stopPropagation(); updateRole(userData.id, roleKey) }}
                                                className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all ${userData.role === roleKey ? `${roleConf.bg} ${roleConf.color} font-bold` : 'text-stone-600 hover:bg-stone-50'}`}
                                            >
                                                <RIcon className="h-3.5 w-3.5" />
                                                {roleConf.label}
                                                {userData.role === roleKey && (
                                                    <span className="ml-auto text-[10px] opacity-50">Current</span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border ${config.bg} ${config.color} ${config.border}`}>
                            <RoleIcon className="h-3.5 w-3.5" />
                            {config.label}
                        </div>
                    )}
                </div>
            </motion.div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] relative overflow-hidden pt-32 pb-16">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/20 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-magenta/10 rounded-full blur-[100px] -ml-64 -mb-64 animate-pulse" />
            </div>

            <div className="container mx-auto px-4 max-w-5xl relative z-10">
                {/* Header */}
                <Link
                    href="/admin"
                    className="inline-flex items-center text-[#4A3737]/60 hover:text-saffron transition-colors mb-8 uppercase tracking-widest text-sm font-bold"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Link>

                <div className="mb-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur-md rounded-full border border-orange-100 mb-4"
                    >
                        <Users className="h-4 w-4 text-saffron" />
                        <span className="text-[#4A3737] text-[10px] font-bold uppercase tracking-[0.2em]">Role Management</span>
                    </motion.div>
                    <h1 className="text-[#2D1B1B] mb-2 font-bold tracking-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontFamily: 'var(--font-heading)' }}>
                        Manage <span className="text-saffron">Users</span>
                    </h1>
                    <p className="text-[#4A3737]/70 text-lg">Assign roles to control access levels across your store.</p>
                </div>



                {/* Users List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 p-6 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-stone-200" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-stone-200 rounded w-40 mb-2" />
                                        <div className="h-3 bg-stone-100 rounded w-56" />
                                    </div>
                                    <div className="h-9 bg-stone-200 rounded-xl w-28" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Primary Admins / Owners */}
                        {ownerUsers.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-[#2D1B1B]/60 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Crown className="h-3.5 w-3.5 text-amber-500" /> Store Owners
                                </h3>
                                <div className="space-y-3">
                                    {ownerUsers.map((u, i) => renderUserCard(u, i, false))}
                                </div>
                            </div>
                        )}

                        {/* Other Users */}
                        {otherUsers.length > 0 && (
                            <div>
                                <h3 className="text-[#2D1B1B]/60 font-bold uppercase tracking-widest mb-3 flex items-center gap-2 mt-10">
                                    <Users className="h-3.5 w-3.5 text-stone-400" /> Team Members
                                </h3>
                                {/* Role Legend */}
                                <div className="flex flex-wrap gap-3 mb-8">
                                    {Object.entries(roleConfig).map(([key, config]) => {
                                        const Icon = config.icon
                                        return (
                                            <div key={key} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.color} border ${config.border}`}>
                                                <Icon className="h-3.5 w-3.5" />
                                                <span>{config.label}</span>
                                                <span className="opacity-50">
                                                    ({key === 'admin' ? 'Full access' : key === 'editor' ? 'Can edit' : 'View only'})
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="space-y-3">
                                    {otherUsers.map((u, i) => renderUserCard(u, i, true))}
                                </div>
                            </div>
                        )}

                        {users.length === 0 && (
                            <div className="text-center py-20 text-[#4A3737]/50">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium">No users found</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
