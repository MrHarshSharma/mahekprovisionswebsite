'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/data/products'
import ProductCard from '@/components/product-card'
import { ChevronDown, ChevronLeft, ChevronRight, Loader2, Search, X } from 'lucide-react'

interface PaginationData {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

interface ProductsClientProps {
    products: Product[]
    initialPagination: PaginationData | null
}

export default function ProductsClient({ products: initialProducts, initialPagination }: ProductsClientProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [pagination, setPagination] = useState<PaginationData | null>(initialPagination)
    const [currentPage, setCurrentPage] = useState(1)
    const [activeCategory, setActiveCategory] = useState('All')
    const [categories, setCategories] = useState<{ key: string; label: string }[]>([{ key: 'All', label: 'All' }])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const isFirstRender = useRef(true)

    // Fetch categories from database
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories')
                const data = await response.json()
                if (data.success && data.categories) {
                    const dbCategories = data.categories.map((cat: { category: string }) => ({
                        key: cat.category,
                        label: cat.category
                    }))
                    setCategories([{ key: 'All', label: 'All' }, ...dbCategories])
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
        fetchCategories()
    }, [])

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
            if (searchQuery !== debouncedSearch) {
                setCurrentPage(1)
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Fetch products when page, category, or search changes
    useEffect(() => {
        // Skip the initial fetch since we have server-side data (only if no search)
        if (isFirstRender.current && !debouncedSearch) {
            isFirstRender.current = false
            return
        }
        isFirstRender.current = false

        const fetchProducts = async () => {
            setIsLoading(true)
            try {
                const categoryParam = activeCategory !== 'All' ? `&category=${encodeURIComponent(activeCategory.toLowerCase())}` : ''
                const searchParam = debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''
                const response = await fetch(`/api/products?paginated=true&page=${currentPage}&limit=20${categoryParam}${searchParam}`)
                const data = await response.json()

                if (data.success) {
                    setProducts(data.products)
                    setPagination(data.pagination)
                }
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [currentPage, activeCategory, debouncedSearch])

    // Handle category change - reset to page 1
    const handleCategoryChange = (category: string) => {
        if (category === activeCategory) {
            setIsDropdownOpen(false)
            return
        }
        setCurrentPage(1)
        setActiveCategory(category)
        setIsDropdownOpen(false)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const activeCategoryLabel = categories.find(c => c.key === activeCategory)?.label || activeCategory

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Generate page numbers to display
    const getPageNumbers = () => {
        if (!pagination) return []

        const { totalPages } = pagination
        const pages: (number | string)[] = []

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1)

            if (currentPage > 3) {
                pages.push('...')
            }

            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (currentPage < totalPages - 2) {
                pages.push('...')
            }

            pages.push(totalPages)
        }

        return pages
    }

    return (
        <div className="min-h-screen pt-35 pb-20" style={{ background: 'var(--background)' }}>
            <div className="container">
                {/* Header with Search and Category Dropdown */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-10">
                    <h4
                        className="text-4xl md:text-5xl font-bold"
                        style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)' }}
                    >
                        Our Products
                    </h4>
                    <div className="flex items-center gap-3">
                        {/* Search Box */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="pl-10 pr-10 py-3 bg-white rounded-full border border-amber-200 shadow-sm hover:border-amber-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all w-[200px] md:w-[250px] text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-100 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-stone-400" />
                                </button>
                            )}
                        </div>

                        {/* Category Dropdown */}
                        <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 px-5 py-3 bg-white rounded-full border border-amber-200 shadow-sm hover:border-amber-300 transition-all min-w-[180px] justify-between"
                        >
                            <span className="font-semibold capitalize" style={{ color: 'var(--secondary)' }}>{activeCategoryLabel}</span>
                            <ChevronDown
                                className={`w-5 h-5 text-amber-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full right-0 mt-2 bg-white rounded-2xl border border-amber-100 shadow-lg overflow-hidden z-50 min-w-[180px]"
                                >
                                    {categories.map((category) => (
                                        <button
                                            key={category.key}
                                            onClick={() => handleCategoryChange(category.key)}
                                            className={`w-full px-5 py-3 text-left font-medium transition-colors capitalize ${activeCategory === category.key
                                                ? 'bg-amber-50 text-amber-700'
                                                : 'text-stone-600 hover:bg-amber-50/50 hover:text-amber-700'
                                                }`}
                                        >
                                            {category.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Product Grid */}
                        <AnimatePresence mode="wait">
                            {products.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center py-20 bg-white rounded-2xl border border-stone-100 max-w-xl mx-auto"
                                >
                                    <p className="text-xl font-semibold text-stone-800 mb-2">No products found</p>
                                    <p className="text-stone-500">We don&apos;t have products in this category yet. Please check back soon!</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={`${activeCategory}-${currentPage}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
                                >
                                    {products.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="mt-12 flex flex-col items-center gap-4">
                                {/* Page info */}
                                <p className="text-sm text-stone-500">
                                    Showing {((currentPage - 1) * pagination.limit) + 1} - {Math.min(currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} products
                                </p>

                                {/* Pagination controls */}
                                <div className="flex items-center gap-2">
                                    {/* Previous button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={!pagination.hasPrevPage}
                                        className="p-2 rounded-lg border border-amber-200 bg-white hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-amber-600" />
                                    </button>

                                    {/* Page numbers */}
                                    <div className="flex items-center gap-1">
                                        {getPageNumbers().map((page, index) => (
                                            page === '...' ? (
                                                <span key={`ellipsis-${index}`} className="px-3 py-2 text-stone-400">...</span>
                                            ) : (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page as number)}
                                                    className={`min-w-[40px] h-10 rounded-lg font-semibold transition-colors ${currentPage === page
                                                        ? 'bg-amber-500 text-white border border-amber-500'
                                                        : 'bg-white border border-amber-200 text-stone-600 hover:bg-amber-50 hover:text-amber-700'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        ))}
                                    </div>

                                    {/* Next button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className="p-2 rounded-lg border border-amber-200 bg-white hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-amber-600" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
