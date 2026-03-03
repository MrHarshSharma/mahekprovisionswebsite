'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/data/products'
import ProductCard from '@/components/product-card'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/context/language-context'

interface ProductsClientProps {
    products: Product[]
}

export default function ProductsClient({ products }: ProductsClientProps) {
    const { t } = useLanguage()
    const [activeCategory, setActiveCategory] = useState('All')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const categories = [
        { key: 'All', label: t('products.all') },
        { key: 'Hampers', label: t('products.hampers') },
        { key: 'Gourmet', label: t('products.gourmet') },
        { key: 'Dry Fruits', label: t('products.dryFruits') }
    ]

    const activeCategoryLabel = categories.find(c => c.key === activeCategory)?.label || activeCategory

    const filteredProducts = useMemo(() => {
        if (activeCategory === 'All') {
            return products
        }
        return products.filter(product =>
            product.categories && product.categories.some(cat => cat.toLowerCase() === activeCategory.toLowerCase())
        )
    }, [activeCategory, products])

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

    const handleSelectCategory = (category: string) => {
        setActiveCategory(category)
        setIsDropdownOpen(false)
    }

    return (
        <div className="min-h-screen pt-32 pb-20" style={{ background: 'var(--background)' }}>
            <div className="container">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)' }}
                    >
                        {t('products.title')}
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                        {t('products.description')}
                    </p>
                </div>

                {/* Category Dropdown */}
                <div className="mb-8 flex justify-center">
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 px-5 py-3 bg-white rounded-full border border-amber-200 shadow-sm hover:border-amber-300 transition-all min-w-[180px] justify-between"
                        >
                            <span className="font-semibold" style={{ color: 'var(--secondary)' }}>{activeCategoryLabel}</span>
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
                                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-amber-100 shadow-lg overflow-hidden z-50"
                                >
                                    {categories.map((category) => (
                                        <button
                                            key={category.key}
                                            onClick={() => handleSelectCategory(category.key)}
                                            className={`w-full px-5 py-3 text-left font-medium transition-colors ${
                                                activeCategory === category.key
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

                {/* Product Grid */}
                <AnimatePresence mode="wait">
                    {filteredProducts.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20 bg-white rounded-2xl border border-stone-100 max-w-xl mx-auto"
                        >
                            <p className="text-xl font-semibold text-stone-800 mb-2">{t('products.noProducts')}</p>
                            <p className="text-stone-500">{t('products.noProductsDesc')}</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                        >
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
