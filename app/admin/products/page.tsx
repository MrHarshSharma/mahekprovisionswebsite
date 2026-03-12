'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit, Trash2, Search, Package, Download, Upload, X } from 'lucide-react'
import { Product } from '@/data/products'

interface AdminProduct extends Product {
    created_at: string
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<AdminProduct[]>([])
    const [filteredProducts, setFilteredProducts] = useState<AdminProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showImportModal, setShowImportModal] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [importResult, setImportResult] = useState<{ message: string; errors?: string[] } | null>(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        filterProducts()
    }, [searchTerm, products])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products', { cache: 'no-store' })
            const data = await response.json()

            if (data.success) {
                setProducts(data.products || [])
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filterProducts = () => {
        if (searchTerm) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            setFilteredProducts(filtered)
        } else {
            setFilteredProducts(products)
        }
    }

    const toggleStock = async (productId: string | number, currentStatus: boolean) => {
        const newStatus = !currentStatus
        // Optimistic update
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, instock: newStatus } as AdminProduct : p))
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instock: newStatus }),
            })
            if (!response.ok) {
                // Revert on failure
                setProducts(prev => prev.map(p => p.id === productId ? { ...p, instock: currentStatus } as AdminProduct : p))
            }
        } catch (error) {
            console.error('Error toggling stock:', error)
            setProducts(prev => prev.map(p => p.id === productId ? { ...p, instock: currentStatus } as AdminProduct : p))
        }
    }

    const deleteProduct = async (productId: string | number) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                fetchProducts()
            }
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const response = await fetch('/api/products/export')
            if (!response.ok) throw new Error('Export failed')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `products_${new Date().toISOString().split('T')[0]}.xlsx`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Export error:', error)
            alert('Failed to export products')
        } finally {
            setIsExporting(false)
        }
    }

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsImporting(true)
        setImportResult(null)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/products/import', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (data.success) {
                setImportResult({
                    message: data.message,
                    errors: data.results?.errors
                })
                fetchProducts()
            } else {
                setImportResult({
                    message: data.error || 'Import failed',
                    errors: []
                })
            }
        } catch (error) {
            console.error('Import error:', error)
            setImportResult({
                message: 'Failed to import products',
                errors: []
            })
        } finally {
            setIsImporting(false)
            e.target.value = ''
        }
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] relative overflow-hidden pt-32 pb-16">
            {/* Background Patterns */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/20 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-magenta/10 rounded-full blur-[100px] -ml-64 -mb-64 animate-pulse animation-delay-2000" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-orange-100 text-saffron hover:text-orange-600 text-xs font-bold uppercase tracking-wider mb-6 transition-all group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="font-cinzel text-4xl text-[#2D1B1B] mb-1 font-bold tracking-tight">Products <span className="text-saffron">Catalog</span></h1>
                            <p className="text-[#4A3737]/70 font-playfair text-base">Curate your artisanal collection.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="px-5 py-3 bg-white border border-orange-200 text-[#2D1B1B] rounded-full hover:bg-orange-50 transition-all font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-sm disabled:opacity-50"
                            >
                                <Download className="h-4 w-4" />
                                {isExporting ? 'Exporting...' : 'Export'}
                            </button>
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="px-5 py-3 bg-white border border-orange-200 text-[#2D1B1B] rounded-full hover:bg-orange-50 transition-all font-bold uppercase tracking-widest text-xs flex items-center gap-2 shadow-sm"
                            >
                                <Upload className="h-4 w-4" />
                                Import
                            </button>
                            <Link href="/admin/add-product">
                                <button className="px-6 py-3 bg-[#2D1B1B] text-white rounded-full hover:bg-saffron transition-all font-bold uppercase tracking-widest text-xs flex items-center gap-3 shadow-lg hover:shadow-saffron/40 group">
                                    <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                                    Add Product
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search - More Compact */}
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 p-6 shadow-sm mb-8">

                    <div className="relative justify-center align-middle mx-auto flex flex-row gap-4">
                        <div className="w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-saffron/40" />
                            <input
                                type="text"
                                placeholder="Search by name or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-6 py-3 border border-orange-100 rounded-xl font-playfair text-base focus:outline-none focus:ring-4 focus:ring-saffron/5 bg-white/80 transition-all placeholder:text-[#4A3737]/30 shadow-inner"
                            />
                        </div>

                        {filteredProducts.length > 0 && (
                            <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-orange-100 p-5">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                                    <div>
                                        <p className="text-[#4A3737]/50 text-[10px] uppercase font-bold tracking-widest mb-1">Stock Count</p>
                                        <p className="text-xl font-bold text-[#2D1B1B] font-cinzel">{filteredProducts.length}</p>
                                    </div>
                                    <div className="border-y sm:border-y-0 sm:border-x border-orange-50 py-3 sm:py-0 sm:px-6">
                                        <p className="text-[#4A3737]/50 text-[10px] uppercase font-bold tracking-widest mb-1">Avg Price</p>
                                        <p className="text-xl font-bold text-[#2D1B1B] font-cinzel">
                                            ₹{Math.round(filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length)}
                                        </p>
                                    </div>
                                    <div className="sm:pl-6">
                                        <p className="text-[#4A3737]/50 text-[10px] uppercase font-bold tracking-widest mb-1">Total Value</p>
                                        <p className="text-xl font-bold text-saffron font-cinzel">
                                            ₹{filteredProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="text-center py-24">
                        <div className="inline-block h-10 w-10 animate-spin rounded-full border-[3px] border-solid border-saffron border-r-transparent"></div>
                        <p className="mt-4 text-[#4A3737]/60 font-playfair italic text-sm">Dusting off the shelves...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/40 p-20 text-center">
                        <Package className="h-16 w-16 text-[#4A3737]/10 mx-auto mb-4" />
                        <p className="text-[#4A3737]/60 font-playfair text-xl mb-6">The showroom is currently vacant.</p>
                        <Link href="/admin/add-product">
                            <button className="px-8 py-3 bg-saffron text-white rounded-full hover:bg-orange-600 transition-all font-bold uppercase tracking-widest text-xs shadow-md">
                                Unveil Your First Creation
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mb-12">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/60 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 flex flex-row items-stretch"
                            >
                                {/* Image - Left side */}
                                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-orange-50 text-[#4A3737]/20 uppercase tracking-widest font-bold text-[10px]">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Product Info - Middle */}
                                <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h3 className="font-playfair text-base sm:text-lg text-[#2D1B1B] font-bold truncate group-hover:text-saffron transition-colors">
                                            {product.name}
                                        </h3>
                                        {/* Product Type Badge */}
                                        {(product as any).product_type && (
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border flex-shrink-0 ${(product as any).product_type === 'variable'
                                                ? 'bg-purple-500/90 text-white border-purple-600/50'
                                                : 'bg-orange-50 text-[#2D1B1B] border-orange-100'
                                                }`}>
                                                {(product as any).product_type === 'variable' ? 'Variable' : 'Simple'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 flex-wrap">
                                        {/* Categories */}
                                        <div className="flex flex-wrap gap-1">
                                            {product.categories && product.categories.map((category) => (
                                                <span
                                                    key={category}
                                                    className="px-2 py-0.5 bg-orange-50/50 border border-orange-100/50 text-saffron text-[9px] font-bold uppercase tracking-wider rounded-md"
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Price */}
                                        <span className="text-sm font-bold text-[#2D1B1B]">
                                            {(product as any).product_type === 'variable' && (product as any).variations ? (
                                                (() => {
                                                    const prices = (product as any).variations.map((v: any) => v.price)
                                                    const minPrice = Math.min(...prices)
                                                    const maxPrice = Math.max(...prices)
                                                    return minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`
                                                })()
                                            ) : (
                                                `₹${product.price}`
                                            )}
                                        </span>
                                    </div>

                                    {/* Description - hidden on very small screens */}
                                    <p className="text-[#4A3737]/60 text-xs line-clamp-1 font-playfair italic mt-1 hidden sm:block">
                                        {(() => {
                                            try {
                                                const jsonDesc = JSON.parse(product.description);
                                                return jsonDesc.productDescription || product.description;
                                            } catch {
                                                return product.description;
                                            }
                                        })()}
                                    </p>
                                </div>

                                {/* Actions - Right side */}
                                <div className="flex items-center gap-3 pr-4 flex-shrink-0">
                                    {/* In-Stock Toggle */}
                                    <button
                                        onClick={(e) => { e.preventDefault(); toggleStock(product.id, (product as any).instock ?? true) }}
                                        className="flex items-center gap-2 group/toggle"
                                        title={(product as any).instock !== false ? 'In Stock — click to mark out of stock' : 'Out of Stock — click to mark in stock'}
                                    >
                                        <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${(product as any).instock !== false ? 'text-emerald-600' : 'text-stone-400'}`}>
                                            {(product as any).instock !== false ? 'In Stock' : 'Out'}
                                        </span>
                                        <div className={`relative w-10 h-[22px] rounded-full transition-colors duration-300 ${(product as any).instock !== false ? 'bg-emerald-500' : 'bg-stone-300'}`}>
                                            <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${(product as any).instock !== false ? 'left-[22px]' : 'left-[3px]'}`} />
                                        </div>
                                    </button>

                                    <div className="w-px h-6 bg-orange-100 hidden sm:block" />

                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <button className="px-4 py-2 bg-[#2D1B1B] text-white rounded-xl hover:bg-saffron transition-all font-bold text-[9px] uppercase tracking-widest flex items-center gap-2 shadow-sm">
                                            <Edit className="h-3.5 w-3.5" />
                                            Edit
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => deleteProduct(product.id)}
                                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm"
                                        title="Delete Product"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Summary Section - Scaled Down */}

            </div>

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B] font-bold">Import Products</h2>
                            <button
                                onClick={() => {
                                    setShowImportModal(false)
                                    setImportResult(null)
                                }}
                                className="p-2 hover:bg-orange-50 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-[#4A3737]" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[#4A3737]/70 font-playfair text-sm">
                                Upload an Excel file (.xlsx) to import products. The file should have columns:
                                Name, Description, Price, Categories, Images, Product Type, Variations.
                            </p>

                            <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                                <p className="text-xs text-[#4A3737]/60 font-bold uppercase tracking-wider mb-2">Format Tips:</p>
                                <ul className="text-xs text-[#4A3737]/70 space-y-1 font-playfair">
                                    <li>• Categories: comma-separated (e.g., "Hampers, Gourmet")</li>
                                    <li>• Images: comma-separated URLs</li>
                                    <li>• Product Type: "simple" or "variable"</li>
                                    <li>• Variations: JSON array for variable products</li>
                                    <li>• If ID exists, product will be updated</li>
                                </ul>
                            </div>

                            <label className="block">
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleImport}
                                    disabled={isImporting}
                                    className="hidden"
                                />
                                <div className="border-2 border-dashed border-orange-200 rounded-xl p-8 text-center cursor-pointer hover:border-saffron hover:bg-orange-50/30 transition-all">
                                    {isImporting ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-saffron border-r-transparent" />
                                            <span className="text-sm text-[#4A3737]/60 font-playfair">Importing...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="h-10 w-10 text-saffron/40 mx-auto mb-3" />
                                            <p className="text-sm text-[#4A3737] font-bold">Click to upload Excel file</p>
                                            <p className="text-xs text-[#4A3737]/50 mt-1">.xlsx or .xls files</p>
                                        </>
                                    )}
                                </div>
                            </label>

                            {importResult && (
                                <div className={`rounded-xl p-4 ${importResult.errors && importResult.errors.length > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                                    <p className={`text-sm font-bold ${importResult.errors && importResult.errors.length > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                                        {importResult.message}
                                    </p>
                                    {importResult.errors && importResult.errors.length > 0 && (
                                        <ul className="mt-2 text-xs text-amber-600 space-y-1 max-h-32 overflow-y-auto">
                                            {importResult.errors.slice(0, 10).map((err, i) => (
                                                <li key={i}>• {err}</li>
                                            ))}
                                            {importResult.errors.length > 10 && (
                                                <li className="italic">...and {importResult.errors.length - 10} more errors</li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="w-full py-3 bg-[#2D1B1B] text-white rounded-xl hover:bg-saffron transition-all font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                {isExporting ? 'Downloading...' : 'Download Template'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}