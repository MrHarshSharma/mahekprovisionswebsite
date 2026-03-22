'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Plus, Save, Loader2, ChevronDown, ChevronUp, ArrowLeft, Download, FileSpreadsheet, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminAddProductPage() {
    const [availableCategories, setAvailableCategories] = useState<string[]>([])
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
    const [productType, setProductType] = useState<'simple' | 'variable'>('simple')
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        productDetails: '',
        careInstructions: '',
        price: '',
        categories: [] as string[],
        categoryInput: '',
    })
    const [variations, setVariations] = useState<Array<{
        id: string
        name: string
        price: string
        stock: string
        sku: string
        is_default: boolean
    }>>([{ id: '1', name: '', price: '', stock: '', sku: '', is_default: true }])
    const [images, setImages] = useState<string[]>([])
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [showDropdown, setShowDropdown] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const dropZoneRef = useRef<HTMLDivElement>(null)

    // Bulk Import State
    const [showBulkImport, setShowBulkImport] = useState(false)
    const [importFile, setImportFile] = useState<File | null>(null)
    const [isImporting, setIsImporting] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [importResult, setImportResult] = useState<{
        type: 'success' | 'error',
        message: string,
        errors?: string[],
        stats?: { total: number, created: number, updated: number, failed: number }
    } | null>(null)

    // Auto-resize textarea based on content
    const autoResizeTextarea = useCallback((element: HTMLTextAreaElement) => {
        element.style.height = 'auto'
        element.style.height = `${element.scrollHeight}px`
    }, [])

    const handleTextareaChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        field: 'description' | 'productDetails' | 'careInstructions'
    ) => {
        setFormData({ ...formData, [field]: e.target.value })
        autoResizeTextarea(e.target)
    }

    // Fetch categories from database
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories')
                const data = await response.json()
                if (data.success && data.categories) {
                    setAvailableCategories(data.categories.map((cat: { category: string }) => cat.category))
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setIsCategoriesLoading(false)
            }
        }
        fetchCategories()
    }, [])

    // Handle clicking outside of dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newFiles = Array.from(files)
        const newImageUrls = newFiles.map(file => URL.createObjectURL(file))

        setImageFiles(prev => [...prev, ...newFiles])
        setImages(prev => [...prev, ...newImageUrls])
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setImageFiles(prev => prev.filter((_, i) => i !== index))
    }

    // Drag and drop handlers
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // Only set dragging to false if we're leaving the drop zone entirely
        if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
            setIsDragging(false)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const fetchImageFromUrl = async (url: string): Promise<File | null> => {
        try {
            const response = await fetch(url)
            if (!response.ok) throw new Error('Failed to fetch image')

            const blob = await response.blob()

            // Check if it's a valid image type
            if (!blob.type.startsWith('image/')) {
                throw new Error('URL does not point to a valid image')
            }

            // Extract filename from URL or generate one
            const urlPath = new URL(url).pathname
            const fileName = urlPath.split('/').pop() || `image-${Date.now()}.${blob.type.split('/')[1] || 'png'}`

            return new File([blob], fileName, { type: blob.type })
        } catch (error) {
            console.error('Error fetching image from URL:', error)
            return null
        }
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        // Check for files first (local drag and drop)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
                file.type.startsWith('image/')
            )

            if (droppedFiles.length > 0) {
                const newImageUrls = droppedFiles.map(file => URL.createObjectURL(file))
                setImageFiles(prev => [...prev, ...droppedFiles])
                setImages(prev => [...prev, ...newImageUrls])
                return
            }
        }

        // Check for URLs (drag from browser/website)
        const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')

        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            // Check if URL looks like an image
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
            const lowerUrl = url.toLowerCase()
            const isImageUrl = imageExtensions.some(ext => lowerUrl.includes(ext)) ||
                lowerUrl.includes('image') ||
                lowerUrl.includes('img')

            if (isImageUrl || true) { // Try to fetch anyway, validation happens in fetchImageFromUrl
                const file = await fetchImageFromUrl(url)
                if (file) {
                    const imageUrl = URL.createObjectURL(file)
                    setImageFiles(prev => [...prev, file])
                    setImages(prev => [...prev, imageUrl])
                } else {
                    setSubmitMessage({ type: 'error', text: 'Failed to load image from URL. Make sure it\'s a valid image link.' })
                    setTimeout(() => setSubmitMessage(null), 3000)
                }
            }
        }
    }

    const addCategory = (categoryName?: string) => {
        const nameToAdd = (categoryName || formData.categoryInput).trim()
        if (nameToAdd && !formData.categories.includes(nameToAdd)) {
            setFormData(prev => ({
                ...prev,
                categories: [...prev.categories, nameToAdd],
                categoryInput: categoryName ? prev.categoryInput : ''
            }))
            if (categoryName) setShowDropdown(false)
        }
    }

    const removeCategory = (category: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c !== category)
        }))
    }

    // Bulk Import Functions
    const [isDownloadingProducts, setIsDownloadingProducts] = useState(false)

    const handleDownloadTemplate = async () => {
        setIsExporting(true)
        try {
            const response = await fetch('/api/products/template')
            if (!response.ok) throw new Error('Download failed')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'products_template.xlsx'
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Template download error:', error)
            alert('Failed to download template')
        } finally {
            setIsExporting(false)
        }
    }

    const handleDownloadProducts = async () => {
        setIsDownloadingProducts(true)
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
            alert('Failed to download products')
        } finally {
            setIsDownloadingProducts(false)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImportFile(file)
            setImportResult(null)
        }
    }

    const handleImportProducts = async () => {
        if (!importFile) return

        setIsImporting(true)
        setImportResult(null)

        try {
            const formData = new FormData()
            formData.append('file', importFile)

            const response = await fetch('/api/products/import', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (data.success) {
                const results = data.results
                setImportResult({
                    type: 'success',
                    message: data.message,
                    errors: results?.errors,
                    stats: {
                        total: (results?.success || 0) + (results?.updated || 0) + (results?.failed || 0),
                        created: results?.success || 0,
                        updated: results?.updated || 0,
                        failed: results?.failed || 0
                    }
                })
                setImportFile(null)
            } else {
                setImportResult({
                    type: 'error',
                    message: data.error || 'Import failed',
                    errors: []
                })
            }
        } catch (error) {
            console.error('Import error:', error)
            setImportResult({
                type: 'error',
                message: 'Failed to import products',
                errors: []
            })
        } finally {
            setIsImporting(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitMessage(null)

        try {
            // First, upload images to Supabase Storage
            const imageUploadFormData = new FormData()
            imageFiles.forEach(file => {
                imageUploadFormData.append('images', file)
            })

            const uploadResponse = await fetch('/api/upload-images', {
                method: 'POST',
                body: imageUploadFormData,
            })

            const uploadData = await uploadResponse.json()

            if (!uploadResponse.ok) {
                throw new Error(uploadData.error || 'Failed to upload images')
            }

            const imageUrls = uploadData.urls

            // Then create the product with the uploaded image URLs
            // Combine description parts into a JSON object
            const descriptionObject = {
                productDescription: formData.description,
                productDetails: formData.productDetails,
                careInstructions: formData.careInstructions
            }

            const productData = {
                name: formData.name,
                description: JSON.stringify(descriptionObject),
                price: productType === 'simple' ? parseInt(formData.price) : null,
                categories: formData.categories,
                images: imageUrls,
                product_type: productType,
                variations: productType === 'variable' ? variations.map(v => ({
                    id: v.id,
                    name: v.name,
                    price: parseInt(v.price),
                    stock: v.stock ? parseInt(v.stock) : null,
                    sku: v.sku || null,
                    is_default: v.is_default
                })) : null
            }

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add product')
            }

            setSubmitMessage({ type: 'success', text: 'Product added successfully!' })

            // Reset form
            setProductType('simple')
            setFormData({
                name: '',
                description: '',
                productDetails: '',
                careInstructions: '',
                price: '',
                categories: [],
                categoryInput: '',
            })
            setVariations([{ id: '1', name: '', price: '', stock: '', sku: '', is_default: true }])
            setImages([])
            setImageFiles([])

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' })

        } catch (error) {
            console.error('Error adding product:', error)
            setSubmitMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to add product'
            })
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-orange-100 text-saffron hover:text-orange-600 text-xs font-bold uppercase tracking-wider mb-6 transition-all group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </Link>
                    <h4 className="font-cinzel text-4xl text-[#2D1B1B] mb-2">Add New Product</h4>
                    <p className="text-[#4A3737]/70 font-playfair">Fill in the details to add a new product to the catalog</p>
                </div>

                {/* Bulk Import Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 mb-6 overflow-hidden">
                    {/* Accordion Header */}
                    <button
                        type="button"
                        onClick={() => setShowBulkImport(!showBulkImport)}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50/30 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100">
                                <FileSpreadsheet className="h-5 w-5 text-saffron" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-cinzel text-lg text-[#2D1B1B] font-bold">Bulk Import</h3>
                                <p className="text-sm text-[#4A3737]/60 font-playfair">Import multiple products via Excel file</p>
                            </div>
                        </div>
                        {showBulkImport ? (
                            <ChevronUp className="h-5 w-5 text-saffron" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-saffron" />
                        )}
                    </button>

                    {/* Accordion Content */}
                    {showBulkImport && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6 space-y-5"
                        >
                            {/* Step 1: Download Template */}
                            <div className="bg-[#FEFBF5] rounded-xl p-5 border border-orange-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-playfair font-bold text-[#2D1B1B]">Step 1: Download Template</h4>
                                        <p className="text-sm text-[#4A3737]/60 font-playfair">Get the Excel template with correct column headers</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleDownloadProducts}
                                        disabled={isDownloadingProducts}
                                        className="px-5 py-2.5 bg-[#D4A855] text-white rounded-lg hover:bg-orange-600 transition-all font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 shrink-0"
                                    >
                                        <Download className="h-4 w-4" />
                                        {isDownloadingProducts ? 'Downloading...' : 'Download'}
                                    </button>
                                </div>
                            </div>

                            {/* Step 2: Upload File */}
                            <div className="bg-[#FEFBF5] rounded-xl p-5 border border-orange-100">
                                <h4 className="font-playfair font-bold text-[#2D1B1B] mb-3">Step 2: Upload Filled Excel</h4>
                                <label className="block cursor-pointer">
                                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${importFile ? 'border-saffron bg-orange-50/50' : 'border-orange-200 hover:border-saffron'}`}>
                                        {importFile ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <FileSpreadsheet className="h-8 w-8 text-saffron" />
                                                <div className="text-left">
                                                    <p className="font-playfair font-bold text-[#2D1B1B]">{importFile.name}</p>
                                                    <p className="text-xs text-[#4A3737]/60">{(importFile.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        setImportFile(null)
                                                        setImportResult(null)
                                                    }}
                                                    className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors"
                                                >
                                                    <X className="h-4 w-4 text-red-500" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-10 w-10 text-saffron/40 mx-auto mb-2" />
                                                <p className="font-playfair text-[#2D1B1B]">Click to upload Excel file</p>
                                                <p className="text-xs text-[#4A3737]/50 mt-1">.xlsx, .xls, or .csv</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Import Button */}
                            <button
                                type="button"
                                onClick={handleImportProducts}
                                disabled={!importFile || isImporting}
                                className="w-full py-4 bg-[#4A3737] text-white font-bold uppercase tracking-widest rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#2D1B1B] transition-colors"
                            >
                                {isImporting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-5 w-5" />
                                        Import Products
                                    </>
                                )}
                            </button>

                            {/* Import Result */}
                            {importResult && (
                                <div className={`rounded-xl overflow-hidden border ${importResult.type === 'success' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                    {/* Header */}
                                    <div className="px-5 py-4 flex items-center gap-2">
                                        {importResult.type === 'success' ? (
                                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <X className="h-5 w-5 text-red-500" />
                                        )}
                                        <span className={`font-bold ${importResult.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {importResult.type === 'success' ? 'Import Completed' : 'Import Failed'}
                                        </span>
                                    </div>

                                    {/* Stats Grid */}
                                    {importResult.type === 'success' && importResult.stats && (
                                        <div className="grid grid-cols-4 border-t border-emerald-200">
                                            <div className="p-4 text-center border-r border-emerald-200">
                                                <p className="text-2xl font-bold text-[#2D1B1B]">{importResult.stats.total}</p>
                                                <p className="text-xs text-[#4A3737]/60">Total</p>
                                            </div>
                                            <div className="p-4 text-center border-r border-emerald-200">
                                                <p className="text-2xl font-bold text-emerald-600">{importResult.stats.created}</p>
                                                <p className="text-xs text-[#4A3737]/60">Created</p>
                                            </div>
                                            <div className="p-4 text-center border-r border-emerald-200">
                                                <p className="text-2xl font-bold text-blue-600">{importResult.stats.updated}</p>
                                                <p className="text-xs text-[#4A3737]/60">Updated</p>
                                            </div>
                                            <div className="p-4 text-center">
                                                <p className="text-2xl font-bold text-red-500">{importResult.stats.failed}</p>
                                                <p className="text-xs text-[#4A3737]/60">Failed</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Error message for failed import */}
                                    {importResult.type === 'error' && (
                                        <div className="px-5 pb-4">
                                            <p className="text-sm text-red-600">{importResult.message}</p>
                                        </div>
                                    )}

                                    {/* Error list */}
                                    {importResult.errors && importResult.errors.length > 0 && (
                                        <div className="px-5 pb-4 border-t border-amber-200 bg-amber-50/50 mt-2 pt-3">
                                            <p className="text-xs font-bold text-amber-700 mb-2">Errors:</p>
                                            <ul className="text-xs text-amber-600 space-y-1 max-h-32 overflow-y-auto">
                                                {importResult.errors.slice(0, 10).map((err, i) => (
                                                    <li key={i}>• {err}</li>
                                                ))}
                                                {importResult.errors.length > 10 && (
                                                    <li className="italic">...and {importResult.errors.length - 10} more errors</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Instructions */}
                            <div className="bg-white rounded-xl p-4 border border-orange-100 space-y-2 text-sm">
                                <p className="text-[#4A3737]">
                                    <span className="font-bold text-[#2D1B1B]">Simple Product:</span> Fill Price, leave Variation columns empty
                                </p>
                                <p className="text-[#4A3737]">
                                    <span className="font-bold text-[#2D1B1B]">Variable Product:</span> Set Type to "variable", add variations like:
                                    <br />
                                    <code className="text-xs bg-orange-50 px-2 py-0.5 rounded ml-1">Variation Names: 250g, 500g, 1kg</code>
                                    <br />
                                    <code className="text-xs bg-orange-50 px-2 py-0.5 rounded ml-1">Variation Prices: 350, 650, 1200</code>
                                </p>
                                <p className="text-[#4A3737]">
                                    <span className="font-bold text-[#2D1B1B]">Update vs Create:</span> If ID exists → updates product. Empty ID → creates new.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8 space-y-6">
                    {/* Product Name */}
                    <div>
                        <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white"
                            placeholder="Enter product name"
                        />
                    </div>

                    {/* Product Type Selector */}
                    <div>
                        <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-3">
                            Product Type *
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="productType"
                                    value="simple"
                                    checked={productType === 'simple'}
                                    onChange={() => setProductType('simple')}
                                    className="w-5 h-5 text-saffron focus:ring-saffron/20"
                                />
                                <span className="font-playfair text-[#2D1B1B] group-hover:text-saffron transition">
                                    Simple Product
                                </span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="productType"
                                    value="variable"
                                    checked={productType === 'variable'}
                                    onChange={() => setProductType('variable')}
                                    className="w-5 h-5 text-saffron focus:ring-saffron/20"
                                />
                                <span className="font-playfair text-[#2D1B1B] group-hover:text-saffron transition">
                                    Variable Product
                                </span>
                            </label>
                        </div>
                        <p className="text-xs text-[#4A3737]/60 mt-2 font-playfair">
                            {productType === 'simple'
                                ? 'Single product with one price'
                                : 'Product with multiple variations (e.g., different sizes, weights)'}
                        </p>
                    </div>

                    {/* Variations Management (only for variable products) */}
                    {productType === 'variable' && (
                        <div className="space-y-4 bg-orange-50/50 p-6 rounded-xl border border-orange-100">
                            <div className="flex items-center justify-between">
                                <h3 className="font-playfair font-bold text-lg text-[#2D1B1B]">Product Variations</h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVariations([...variations, {
                                            id: Date.now().toString(),
                                            name: '',
                                            price: '',
                                            stock: '',
                                            sku: '',
                                            is_default: false
                                        }])
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-saffron text-white rounded-lg hover:bg-orange-600 transition font-playfair text-sm"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Variation
                                </button>
                            </div>

                            {variations.map((variation, index) => (
                                <div key={variation.id} className="bg-white p-4 rounded-lg border border-orange-100 space-y-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-playfair font-semibold text-[#2D1B1B]">Variation {index + 1}</h4>
                                        {variations.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setVariations(variations.filter((_, i) => i !== index))}
                                                className="text-red-500 hover:text-red-700 transition"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-playfair text-xs font-semibold text-[#2D1B1B] mb-1">
                                                Name * (e.g., 1kg, 5kg)
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={variation.name}
                                                onChange={(e) => {
                                                    const newVariations = [...variations]
                                                    newVariations[index].name = e.target.value
                                                    setVariations(newVariations)
                                                }}
                                                className="w-full px-3 py-2 border border-orange-200 rounded-lg font-playfair text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20"
                                                placeholder="e.g., 1kg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-playfair text-xs font-semibold text-[#2D1B1B] mb-1">
                                                Price (₹) *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                value={variation.price}
                                                onChange={(e) => {
                                                    const newVariations = [...variations]
                                                    newVariations[index].price = e.target.value
                                                    setVariations(newVariations)
                                                }}
                                                className="w-full px-3 py-2 border border-orange-200 rounded-lg font-playfair text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20"
                                                placeholder="Enter price"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-playfair text-xs font-semibold text-[#2D1B1B] mb-1">
                                                Stock Quantity
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={variation.stock}
                                                onChange={(e) => {
                                                    const newVariations = [...variations]
                                                    newVariations[index].stock = e.target.value
                                                    setVariations(newVariations)
                                                }}
                                                className="w-full px-3 py-2 border border-orange-200 rounded-lg font-playfair text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20"
                                                placeholder="Optional"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-playfair text-xs font-semibold text-[#2D1B1B] mb-1">
                                                SKU
                                            </label>
                                            <input
                                                type="text"
                                                value={variation.sku}
                                                onChange={(e) => {
                                                    const newVariations = [...variations]
                                                    newVariations[index].sku = e.target.value
                                                    setVariations(newVariations)
                                                }}
                                                className="w-full px-3 py-2 border border-orange-200 rounded-lg font-playfair text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20"
                                                placeholder="Optional"
                                            />
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={variation.is_default}
                                            onChange={(e) => {
                                                const newVariations = variations.map((v, i) => ({
                                                    ...v,
                                                    is_default: i === index ? e.target.checked : false
                                                }))
                                                setVariations(newVariations)
                                            }}
                                            className="w-4 h-4 text-saffron focus:ring-saffron/20 rounded"
                                        />
                                        <span className="font-playfair text-xs text-[#4A3737] group-hover:text-saffron transition">
                                            Default variation (selected by default)
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Description Section */}
                    <div className="space-y-4">
                        <h3 className="font-playfair font-bold text-lg text-[#2D1B1B]">Product Info</h3>

                        {/* Product Description */}
                        <div>
                            <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                                Product Description *
                            </label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => handleTextareaChange(e, 'description')}
                                className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white resize-none min-h-[100px] overflow-hidden"
                                placeholder="Enter main product description"
                            />
                        </div>

                        {/* Product Details */}
                        <div>
                            <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                                Product Details
                            </label>
                            <textarea
                                value={formData.productDetails}
                                onChange={(e) => handleTextareaChange(e, 'productDetails')}
                                className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white resize-none min-h-[100px] overflow-hidden"
                                placeholder="Enter detailed specifications (e.g. Dimensions, Material, Weight)"
                            />
                        </div>

                        {/* Care Instructions */}
                        <div>
                            <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                                Care Instructions
                            </label>
                            <textarea
                                value={formData.careInstructions}
                                onChange={(e) => handleTextareaChange(e, 'careInstructions')}
                                className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white resize-none min-h-[80px] overflow-hidden"
                                placeholder="Enter care instructions"
                            />
                        </div>
                    </div>

                    {/* Price (only for simple products) */}
                    {productType === 'simple' && (
                        <div>
                            <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white"
                                placeholder="Enter price"
                            />
                        </div>
                    )}

                    {/* Categories */}
                    <div>
                        <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                            Categories
                        </label>
                        <div className="relative" ref={dropdownRef}>
                            <div className="flex gap-2 mb-3">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={formData.categoryInput}
                                        onChange={(e) => setFormData({ ...formData, categoryInput: e.target.value })}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                                        onFocus={() => setShowDropdown(true)}
                                        className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white pr-10"
                                        placeholder="Type to search or select from dropdown"
                                    />
                                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-300 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            {/* Dropdown */}
                            {showDropdown && (
                                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-orange-100 rounded-xl shadow-xl overflow-hidden py-1">
                                    {isCategoriesLoading ? (
                                        <div className="px-4 py-3 text-sm text-[#4A3737]/60 font-playfair">Loading categories...</div>
                                    ) : availableCategories.length === 0 ? (
                                        <div className="px-4 py-3 text-sm text-[#4A3737]/60 font-playfair">No categories found</div>
                                    ) : (
                                        availableCategories.map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => addCategory(cat)}
                                                className="w-full text-left px-4 py-3 font-playfair text-sm hover:bg-orange-50 transition-colors flex items-center justify-between group"
                                            >
                                                <span className={formData.categories.includes(cat) ? 'text-saffron font-bold' : 'text-[#4A3737]'}>
                                                    {cat}
                                                </span>
                                                {formData.categories.includes(cat) && (
                                                    <span className="text-[10px] bg-orange-100 text-saffron px-2 py-0.5 rounded-full font-bold">Selected</span>
                                                )}
                                            </button>
                                        ))
                                    )}
                                    {availableCategories.length > 0 && formData.categoryInput && !availableCategories.some(c => c.toLowerCase() === formData.categoryInput.trim().toLowerCase()) && (
                                        <div className="border-t border-orange-50 p-2">
                                            <button
                                                type="button"
                                                onClick={() => addCategory()}
                                                className="w-full text-left px-2 py-2 text-xs font-bold text-saffron hover:bg-orange-50 rounded transition-colors uppercase tracking-widest"
                                            >
                                                Add "{formData.categoryInput}" as new
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {formData.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.categories.map((category) => (
                                    <span
                                        key={category}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-[#2D1B1B] rounded-full text-sm font-playfair"
                                    >
                                        {category}
                                        <button
                                            type="button"
                                            onClick={() => removeCategory(category)}
                                            className="hover:text-red-500 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                            Product Images *
                        </label>

                        {/* Upload / Drop Zone */}
                        <div
                            ref={dropZoneRef}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${isDragging
                                    ? 'border-saffron bg-orange-100/50 scale-[1.02]'
                                    : 'border-orange-200 hover:border-saffron bg-orange-50/30'
                                }`}
                        >
                            <label className="block w-full cursor-pointer">
                                <Upload className={`h-12 w-12 mx-auto mb-3 transition-colors ${isDragging ? 'text-saffron animate-bounce' : 'text-saffron'}`} />
                                <p className="font-playfair text-[#2D1B1B] font-semibold mb-1">
                                    {isDragging ? 'Drop images here' : 'Click or drag images here'}
                                </p>
                                <p className="text-sm text-[#4A3737]/70">
                                    PNG, JPG up to 10MB • Drag from desktop or websites
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Image Preview Grid */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {images.map((image, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-orange-100 group"
                                    >
                                        <Image
                                            src={image}
                                            alt={`Product ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Message */}
                    {submitMessage && (
                        <div className={`p-4 rounded-lg ${submitMessage.type === 'success'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                            <p className="font-playfair text-sm">{submitMessage.text}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || images.length === 0}
                        className="w-full py-4 bg-[#2D1B1B] text-white font-bold uppercase tracking-widest hover:bg-saffron transition-colors shadow-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Adding Product...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Add Product
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
