'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Users, Shield, ShieldCheck, User, ChevronDown, ArrowLeft, Crown, Ban, Search, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface UserData {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: string
    last_login: string | null
    isblocked: boolean
}

interface PaginationData {
    page: number
    limit: number
    total: number
    totalPages: number
}

interface ColumnData {
    users: UserData[]
    pagination: PaginationData
    isLoading: boolean
}

const roleConfig = {
    admin: { label: 'Admin', icon: ShieldCheck, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', headerBg: 'bg-red-100', headerBorder: 'border-red-300' },
    editor: { label: 'Editor', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', headerBg: 'bg-blue-100', headerBorder: 'border-blue-300' },
    user: { label: 'User', icon: User, color: 'text-stone-600', bg: 'bg-stone-50', border: 'border-stone-200', headerBg: 'bg-stone-100', headerBorder: 'border-stone-300' },
    blocked: { label: 'Blocked', icon: Ban, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', headerBg: 'bg-gray-100', headerBorder: 'border-gray-300' },
}

const primaryAdminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').split(',').map(e => e.trim()).filter(Boolean)

const USERS_PER_PAGE = 20

export default function AdminUsersPage() {
    const [ownerUsers, setOwnerUsers] = useState<UserData[]>([])
    const [adminData, setAdminData] = useState<ColumnData>({ users: [], pagination: { page: 1, limit: USERS_PER_PAGE, total: 0, totalPages: 0 }, isLoading: true })
    const [editorData, setEditorData] = useState<ColumnData>({ users: [], pagination: { page: 1, limit: USERS_PER_PAGE, total: 0, totalPages: 0 }, isLoading: true })
    const [userData, setUserData] = useState<ColumnData>({ users: [], pagination: { page: 1, limit: USERS_PER_PAGE, total: 0, totalPages: 0 }, isLoading: true })
    const [blockedData, setBlockedData] = useState<ColumnData>({ users: [], pagination: { page: 1, limit: USERS_PER_PAGE, total: 0, totalPages: 0 }, isLoading: true })

    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Fetch users for a specific column
    const fetchColumnUsers = useCallback(async (
        role: string | null,
        blocked: boolean | null,
        page: number,
        search: string
    ) => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: USERS_PER_PAGE.toString(),
        })
        if (search) params.set('search', search)
        if (role) params.set('role', role)
        if (blocked !== null) params.set('blocked', blocked.toString())

        const res = await fetch(`/api/admin/users?${params}`)
        const data = await res.json()
        return data
    }, [])

    // Fetch all columns
    const fetchAllColumns = useCallback(async (search: string) => {
        setIsSearching(true)

        try {
            const [adminRes, editorRes, userRes, blockedRes] = await Promise.all([
                fetchColumnUsers('admin', false, 1, search),
                fetchColumnUsers('editor', false, 1, search),
                fetchColumnUsers('user', false, 1, search),
                fetchColumnUsers(null, true, 1, search),
            ])

            // Filter out owner users from admin column and set them separately
            const owners = (adminRes.users || []).filter((u: UserData) => primaryAdminEmails.includes(u.email))
            const nonOwnerAdmins = (adminRes.users || []).filter((u: UserData) => !primaryAdminEmails.includes(u.email))

            setOwnerUsers(owners)
            setAdminData({
                users: nonOwnerAdmins,
                pagination: { ...adminRes.pagination, total: adminRes.pagination.total - owners.length },
                isLoading: false
            })
            setEditorData({ users: editorRes.users || [], pagination: editorRes.pagination, isLoading: false })
            setUserData({ users: userRes.users || [], pagination: userRes.pagination, isLoading: false })
            setBlockedData({ users: blockedRes.users || [], pagination: blockedRes.pagination, isLoading: false })
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setIsSearching(false)
        }
    }, [fetchColumnUsers])

    // Initial fetch and search updates
    useEffect(() => {
        fetchAllColumns(debouncedSearch)
    }, [debouncedSearch, fetchAllColumns])

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = () => setOpenDropdown(null)
        if (openDropdown) document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [openDropdown])

    // Load more for a specific column
    const loadMore = async (columnType: 'admin' | 'editor' | 'user' | 'blocked') => {
        const dataMap = { admin: adminData, editor: editorData, user: userData, blocked: blockedData }
        const setterMap = { admin: setAdminData, editor: setEditorData, user: setUserData, blocked: setBlockedData }

        const currentData = dataMap[columnType]
        const setter = setterMap[columnType]

        if (currentData.pagination.page >= currentData.pagination.totalPages) return

        setter(prev => ({ ...prev, isLoading: true }))

        const nextPage = currentData.pagination.page + 1
        const res = await fetchColumnUsers(
            columnType === 'blocked' ? null : columnType,
            columnType === 'blocked' ? true : false,
            nextPage,
            debouncedSearch
        )

        setter(prev => ({
            users: [...prev.users, ...(res.users || []).filter((u: UserData) => !primaryAdminEmails.includes(u.email))],
            pagination: res.pagination,
            isLoading: false
        }))
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
                // Refresh all columns to reflect the change
                fetchAllColumns(debouncedSearch)
            }
        } catch (error) {
            console.error('Error updating role:', error)
        } finally {
            setUpdatingUserId(null)
        }
    }

    const toggleBlock = async (userId: string, currentBlocked: boolean) => {
        setUpdatingUserId(userId)
        setOpenDropdown(null)
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, isblocked: !currentBlocked }),
            })
            const data = await res.json()
            if (data.success) {
                // Refresh all columns to reflect the change
                fetchAllColumns(debouncedSearch)
            }
        } catch (error) {
            console.error('Error toggling block status:', error)
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

    const renderCompactUserCard = (userData: UserData, index: number) => {
        const config = roleConfig[userData.role as keyof typeof roleConfig] || roleConfig.user
        const isUpdating = updatingUserId === userData.id

        return (
            <motion.div
                key={userData.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
                className={`relative bg-white rounded-xl border border-stone-100 p-3 hover:shadow-md transition-all ${openDropdown === userData.id ? 'z-50' : ''}`}
            >
                <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 rounded-full overflow-hidden border border-stone-100 bg-stone-100 flex-shrink-0">
                        {userData.avatar_url ? (
                            <Image src={userData.avatar_url} alt={userData.full_name || ''} fill className="object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center">
                                <User className="h-4 w-4 text-stone-400" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#2D1B1B] truncate">
                            {userData.full_name || 'Unnamed'}
                        </h4>
                        <p className="text-[10px] text-[#4A3737]/50 truncate">{userData.email}</p>
                    </div>

                    <div className="relative flex-shrink-0">
                        <button
                            onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === userData.id ? null : userData.id) }}
                            disabled={isUpdating}
                            className={`p-1.5 rounded-lg transition-all ${isUpdating ? 'opacity-50' : 'hover:bg-stone-100'}`}
                        >
                            {isUpdating ? (
                                <div className="h-4 w-4 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-stone-400" />
                            )}
                        </button>

                        {openDropdown === userData.id && (
                            <div className="absolute top-full right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-50">
                                {!userData.isblocked && Object.entries(roleConfig).filter(([key]) => key !== 'blocked').map(([roleKey, roleConf]) => {
                                    const RIcon = roleConf.icon
                                    return (
                                        <button
                                            key={roleKey}
                                            onClick={(e) => { e.stopPropagation(); updateRole(userData.id, roleKey) }}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all ${userData.role === roleKey ? `${roleConf.bg} ${roleConf.color} font-bold` : 'text-stone-600 hover:bg-stone-50'}`}
                                        >
                                            <RIcon className="h-3.5 w-3.5" />
                                            {roleConf.label}
                                        </button>
                                    )
                                })}
                                {!userData.isblocked && <div className="border-t border-stone-100 my-1" />}
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleBlock(userData.id, userData.isblocked) }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all ${userData.isblocked ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                                >
                                    <Ban className="h-3.5 w-3.5" />
                                    {userData.isblocked ? 'Unblock User' : 'Block User'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        )
    }

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
                    <div className={`relative h-12 w-12 rounded-full overflow-hidden border-2 bg-stone-100 flex-shrink-0 ${isOwner ? 'border-amber-300' : 'border-stone-100'}`}>
                        {userData.avatar_url ? (
                            <Image src={userData.avatar_url} alt={userData.full_name || ''} fill className="object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center">
                                <User className="h-6 w-6 text-stone-400" />
                            </div>
                        )}
                    </div>

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

                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border ${config.bg} ${config.color} ${config.border}`}>
                        <RoleIcon className="h-3.5 w-3.5" />
                        {config.label}
                    </div>
                </div>
            </motion.div>
        )
    }

    const renderColumn = (
        title: string,
        data: ColumnData,
        roleKey: 'admin' | 'editor' | 'user' | 'blocked',
        description: string
    ) => {
        const config = roleConfig[roleKey]
        const Icon = config.icon

        return (
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 overflow-hidden flex flex-col">
                <div className={`px-4 py-3 ${config.headerBg} border-b ${config.headerBorder}`}>
                    <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${config.color}`} />
                        <h3 className={`font-bold text-sm ${config.color}`}>{title}</h3>
                        <span className={`ml-auto text-xs font-bold ${config.color} opacity-60`}>
                            {data.pagination.total}
                        </span>
                    </div>
                    <p className="text-[10px] text-stone-500 mt-0.5">{description}</p>
                </div>
                <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto flex-1">
                    {data.isLoading && data.users.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-stone-400" />
                        </div>
                    ) : data.users.length === 0 ? (
                        <p className="text-xs text-stone-400 text-center py-6">No {title.toLowerCase()}</p>
                    ) : (
                        <>
                            {data.users.map((u, i) => renderCompactUserCard(u, i))}
                            {data.pagination.page < data.pagination.totalPages && (
                                <button
                                    onClick={() => loadMore(roleKey)}
                                    disabled={data.isLoading}
                                    className="w-full py-2 text-xs font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    {data.isLoading ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <>Load more ({data.pagination.total - data.users.length} remaining)</>
                                    )}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        )
    }

    const totalUsers = adminData.pagination.total + editorData.pagination.total + userData.pagination.total + blockedData.pagination.total + ownerUsers.length

    return (
        <div className="min-h-screen bg-[#FEFBF5] relative overflow-hidden pt-32 pb-16">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/20 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-magenta/10 rounded-full blur-[100px] -ml-64 -mb-64 animate-pulse" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
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

                {/* Primary Admins / Owners */}
                {ownerUsers.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-[#2D1B1B]/60 font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-xs">
                            <Crown className="h-3.5 w-3.5 text-amber-500" /> Store Owners
                        </h3>
                        <div className="space-y-3">
                            {ownerUsers.map((u, i) => renderUserCard(u, i, false))}
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-10 py-3 bg-white/80 backdrop-blur-sm border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-stone-100 transition-colors"
                            >
                                <X className="h-4 w-4 text-stone-400" />
                            </button>
                        )}
                        {isSearching && (
                            <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                            </div>
                        )}
                    </div>
                    {debouncedSearch && (
                        <p className="text-xs text-stone-500 mt-2">
                            Found {totalUsers} user{totalUsers !== 1 ? 's' : ''} matching &quot;{debouncedSearch}&quot;
                        </p>
                    )}
                </div>

                {/* Users Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {renderColumn('Admins', adminData, 'admin', 'Full access')}
                    {renderColumn('Editors', editorData, 'editor', 'Can edit products')}
                    {renderColumn('Users', userData, 'user', 'View only')}
                    {renderColumn('Blocked', blockedData, 'blocked', 'No access')}
                </div>

                {totalUsers === 0 && !adminData.isLoading && !editorData.isLoading && !userData.isLoading && !blockedData.isLoading && (
                    <div className="text-center py-20 text-[#4A3737]/50">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">No users found</p>
                    </div>
                )}
            </div>
        </div>
    )
}
