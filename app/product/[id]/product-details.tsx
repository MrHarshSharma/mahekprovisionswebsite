'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Sparkles, Minus, Plus, CheckCircle, ChevronLeft, ChevronRight, Package, X } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { Product } from '@/data/products'

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
    })
}

interface ProductDetailsProps {
    product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
    const { addToCartSilent, items, updateQuantity } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [selectedVariation, setSelectedVariation] = useState<any>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [[page, direction], setPage] = useState([0, 0])

    // Image zoom state
    const [isZooming, setIsZooming] = useState(false)
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const imageContainerRef = React.useRef<HTMLDivElement>(null)

    // Bulk enquiry modal state
    const [showBulkModal, setShowBulkModal] = useState(false)
    const [bulkForm, setBulkForm] = useState({ name: '', phone: '', quantity: '' })
    const [bulkErrors, setBulkErrors] = useState({ name: '', phone: '', quantity: '' })

    // Parse description
    const parsedDescription = React.useMemo(() => {
        let description = product.description
        let details = ''
        let care = ''
        let isJson = false

        try {
            const jsonDesc = JSON.parse(product.description)
            if (typeof jsonDesc === 'object' && jsonDesc !== null) {
                description = jsonDesc.productDescription || ''
                details = jsonDesc.productDetails || ''
                care = jsonDesc.careInstructions || ''
                isJson = true
            }
        } catch {
            // Not a JSON string
        }

        return { description, details, care, isJson }
    }, [product.description])

    // Initialize selected variation
    useEffect(() => {
        if (product?.product_type === 'variable' && product.variations && product.variations.length > 0) {
            const defaultVar = product.variations.find(v => v.is_default) || product.variations[0]
            setSelectedVariation(defaultVar)
        }
    }, [product])

    const id = product.id.toString()

    // Auto-advance carousel
    useEffect(() => {
        if (!product || !product.images || product.images.length <= 1) return

        const timer = setInterval(() => {
            paginate(1)
        }, 4000)

        return () => clearInterval(timer)
    }, [product, page])

    const paginate = (newDirection: number) => {
        if (!product?.images) return
        const newPage = (page + newDirection + product.images.length) % product.images.length
        setPage([newPage, newDirection])
    }

    // Sync quantity with cart when cart changes
    useEffect(() => {
        if (id && product) {
            const cartItem = items.find(item =>
                item.id.toString() === id.toString() &&
                (!selectedVariation || item.selectedVariation?.id === selectedVariation.id)
            )
            if (cartItem) {
                setQuantity(cartItem.quantity)
            } else {
                setQuantity(1)
            }
        }
    }, [id, items, product, selectedVariation])

    const cartItem = items.find(item =>
        item.id.toString() === id.toString() &&
        (!selectedVariation || item.selectedVariation?.id === selectedVariation.id)
    )
    const isInCart = !!cartItem

    const handleAddToCart = () => {
        if (!product) return
        if (isInCart) {
            // Update quantity if already in cart
            updateQuantity(product.id, quantity, selectedVariation?.id)
        } else {
            // Add new item to cart
            addToCartSilent(product, quantity, selectedVariation)
        }

        // Show success animation
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
    }

    const handleQuantityChange = (newQuantity: number) => {
        // Only update local state, don't update cart until button is clicked
        setQuantity(newQuantity)
    }

    const handleBulkEnquirySubmit = () => {
        const errors = { name: '', phone: '', quantity: '' }
        let hasError = false

        if (!bulkForm.name.trim()) {
            errors.name = 'Name is required'
            hasError = true
        }
        if (!bulkForm.phone.trim()) {
            errors.phone = 'Phone number is required'
            hasError = true
        } else if (!/^\d{10}$/.test(bulkForm.phone)) {
            errors.phone = 'Phone number must be exactly 10 digits'
            hasError = true
        }
        if (!bulkForm.quantity.trim()) {
            errors.quantity = 'Quantity is required'
            hasError = true
        }

        setBulkErrors(errors)

        if (hasError) return

        // Format WhatsApp message
        const message = `Hey, I want ${product.name} in bulk ${bulkForm.quantity}.
My details
Name: ${bulkForm.name}
Phone: ${bulkForm.phone}`

        // WhatsApp URL with phone number
        const whatsappUrl = `https://wa.me/919359587859?text=${encodeURIComponent(message)}`

        // Open WhatsApp
        window.open(whatsappUrl, '_blank')

        // Reset form and close modal
        setBulkForm({ name: '', phone: '', quantity: '' })
        setBulkErrors({ name: '', phone: '', quantity: '' })
        setShowBulkModal(false)
    }

    const imageIndex = product.images && product.images.length > 0 ? page % product.images.length : 0

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current) return
        const rect = imageContainerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setZoomPosition({ x, y })
        setMousePos({ x: e.clientX, y: e.clientY })
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] pt-32 pb-20">
            <div className="container mx-auto px-4">
                <Link
                    href="/products"
                    className="inline-flex items-center text-[#4A3737]/60 hover:text-saffron transition-colors mb-12 uppercase tracking-widest text-sm font-bold"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Collection
                </Link>

                <div className="grid md:grid-cols-12 gap-16 lg:gap-24">
                    {/* Image Section */}
                    <div className="md:col-span-5 space-y-6 md:sticky md:top-32 h-fit relative">
                        <div
                            ref={imageContainerRef}
                            className="relative aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-2xl border-8 border-white group cursor-zoom-in"
                            onMouseEnter={() => setIsZooming(true)}
                            onMouseLeave={() => setIsZooming(false)}
                            onMouseMove={handleMouseMove}
                        >
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={page}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = Math.abs(offset.x) * velocity.x
                                        if (swipe < -10000) {
                                            paginate(1)
                                        } else if (swipe > 10000) {
                                            paginate(-1)
                                        }
                                    }}
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={product.images && product.images.length > 0 ? product.images[imageIndex] : '/placeholder-product.png'}
                                        alt={`${product.name} image ${imageIndex + 1}`}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Zoom Lens Indicator */}
                            {isZooming && (
                                <div
                                    className="absolute w-24 h-24 border-2 border-saffron rounded-lg pointer-events-none z-10 hidden md:block"
                                    style={{
                                        left: `calc(${zoomPosition.x}% - 48px)`,
                                        top: `calc(${zoomPosition.y}% - 48px)`,
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    }}
                                />
                            )}

                            {/* Navigation Arrows */}
                            {product.images && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => paginate(-1)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-md text-[#2D1B1B] hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={() => paginate(1)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-md text-[#2D1B1B] hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}

                            {product.isNew && (
                                <div className="absolute top-6 right-6 bg-magenta text-white px-4 py-2 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg animate-pulse z-10">
                                    New Arrival
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-3 md:gap-4 overflow-x-auto p-2 scrollbar-hide">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setPage([idx, idx > imageIndex ? 1 : -1])}
                                        className={`relative w-10 h-10 md:w-10 md:h-10 rounded-xl overflow-hidden flex-shrink-0 transition-all border-2 ${imageIndex === idx ? 'border-saffron ring-2 md:ring-4 ring-saffron/20' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} thumbnail ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="md:col-span-7 flex flex-col justify-center">
                        <div className="flex flex-wrap gap-2 mb-6">
                            <Sparkles className="h-5 w-5 text-saffron self-center" />
                            {product.categories && product.categories.length > 0 ? (
                                product.categories.map((category, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-orange-50 text-saffron px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-orange-100"
                                    >
                                        {category}
                                    </span>
                                ))
                            ) : (
                                <span className="bg-orange-50 text-saffron px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-orange-100">
                                    General
                                </span>
                            )}
                        </div>

                        <span className="text-2xl md:text-5xl font-cinzel text-[#2D1B1B] mb-4 md:mb-6 leading-tight">
                            {product.name}
                        </span>
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                            <span className="text-2xl md:text-3xl text-[#4A3737] font-bold">
                                ₹{selectedVariation ? selectedVariation.price : product.price}
                            </span>
                            {selectedVariation && (
                                <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-purple-100">
                                    {selectedVariation.name}
                                </span>
                            )}
                        </div>


                        <div className="space-y-8 mb-10">
                            <div className={`text-[#4A3737]/80 font-playfair text-lg leading-relaxed ${!parsedDescription.isJson ? 'border-l-4 border-magenta/20 pl-6' : ''}`}>
                                {parsedDescription.isJson && <h3 className="font-cinzel text-xl text-[#2D1B1B] mb-3 font-bold">Description</h3>}
                                <p>{parsedDescription.description}</p>
                            </div>

                            {parsedDescription.details && (
                                <div className="text-[#4A3737]/80 font-playfair text-lg leading-relaxed">
                                    <h3 className="font-cinzel text-xl text-[#2D1B1B] mb-3 font-bold">Details</h3>
                                    <p className="whitespace-pre-line">{parsedDescription.details}</p>
                                </div>
                            )}

                            {parsedDescription.care && (
                                <div className="text-[#4A3737]/80 font-playfair text-lg leading-relaxed">
                                    <h3 className="font-cinzel text-xl text-[#2D1B1B] mb-3 font-bold">Care Instructions</h3>
                                    <p className="whitespace-pre-line">{parsedDescription.care}</p>
                                </div>
                            )}
                        </div>


                        {/* Variation Selector */}
                        {product.product_type === 'variable' && product.variations && product.variations.length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-[#4A3737] mb-4">Select Option</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variations.map((variation) => (
                                        <button
                                            key={variation.id}
                                            onClick={() => setSelectedVariation(variation)}
                                            className={`px-6 py-3 rounded-xl border-2 transition-all font-playfair text-sm ${selectedVariation?.id === variation.id
                                                ? 'border-saffron bg-saffron/5 text-saffron shadow-md'
                                                : 'border-orange-100 bg-white text-[#4A3737] hover:border-orange-200'
                                                }`}
                                        >
                                            <div className="font-bold">{variation.name}</div>
                                            <div className="text-[10px] opacity-70">₹{variation.price}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-8">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4">
                                <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-[#4A3737]">Quantity</span>
                                <div className="flex items-center border border-orange-200 rounded-full bg-white shadow-sm">
                                    <button
                                        onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                                        className="p-2 md:p-3 hover:text-magenta transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-3 w-3 md:h-4 md:w-4" />
                                    </button>
                                    <span className="w-6 md:w-8 text-center text-sm md:text-base font-bold text-[#2D1B1B]">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="p-2 md:p-3 hover:text-saffron transition-colors"
                                    >
                                        <Plus className="h-3 w-3 md:h-4 md:w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 md:flex-none px-8 py-3 md:px-12 md:py-5 text-white text-sm md:text-base font-bold tracking-widest uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-2 md:gap-3 rounded-full ${showSuccess
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-amber-500 hover:bg-amber-600 hover:shadow-amber-300/50'
                                        }`}
                                >
                                    {showSuccess ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                                            Cart Updated!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                                            {isInCart ? 'Update Cart' : 'Add to Cart'}
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowBulkModal(true)}
                                    className="flex-1 md:flex-none px-8 py-3 md:px-12 md:py-5 text-[#2D1B1B] text-sm md:text-base font-bold tracking-widest uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-2 md:gap-3 rounded-full border-2 border-[#2D1B1B] hover:bg-[#2D1B1B] hover:text-white"
                                >
                                    <Package className="h-4 w-4 md:h-5 md:w-5" />
                                    Bulk Enquiry
                                </button>
                            </div>

                            <div className="pt-8 border-t border-orange-100 grid grid-cols-2 gap-8 text-xs text-[#4A3737]/60 uppercase tracking-widest font-bold">
                                <div>
                                    <span className="block text-[#2D1B1B] mb-1 text-sm">Authenticity</span>
                                    100% Certified
                                </div>
                                <div>
                                    <span className="block text-[#2D1B1B] mb-1 text-sm">Shipping</span>
                                    Pan India Delivery
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bulk Enquiry Modal */}
            <AnimatePresence>
                {showBulkModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1001] flex items-center justify-center p-4"
                        onClick={() => setShowBulkModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl md:text-2xl font-cinzel text-[#2D1B1B] font-bold mb-0" style={{ marginBottom: '0' }}>Bulk Enquiry</span>
                                <button
                                    onClick={() => setShowBulkModal(false)}
                                    className="p-2 hover:bg-orange-50 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5 text-[#4A3737]" />
                                </button>
                            </div>

                            <div className="bg-orange-50 rounded-xl px-4 py-3 mb-4 border border-orange-100">
                                <p className="text-xs text-[#4A3737]/60 uppercase tracking-wider font-bold mb-1">Product</p>
                                <p className="text-base font-playfair text-[#2D1B1B] font-semibold">{product.name}</p>
                            </div>

                            <p className="text-sm text-[#4A3737]/70 mb-6 font-playfair">
                                Need this product in bulk? Fill in your details and we&apos;ll get back to you via WhatsApp.
                            </p>

                            <div className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-bold text-[#4A3737] mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={bulkForm.name}
                                        onChange={(e) => setBulkForm({ ...bulkForm, name: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-xl font-playfair focus:outline-none focus:ring-2 transition-all ${bulkErrors.name ? 'border-red-300 focus:ring-red-200' : 'border-orange-200 focus:ring-saffron/20 focus:border-saffron'}`}
                                        placeholder="Enter your full name"
                                    />
                                    {bulkErrors.name && (
                                        <p className="text-red-500 text-xs mt-1 font-playfair">{bulkErrors.name}</p>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-bold text-[#4A3737] mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={bulkForm.phone}
                                        onChange={(e) => setBulkForm({ ...bulkForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                        className={`w-full px-4 py-3 border rounded-xl font-playfair focus:outline-none focus:ring-2 transition-all ${bulkErrors.phone ? 'border-red-300 focus:ring-red-200' : 'border-orange-200 focus:ring-saffron/20 focus:border-saffron'}`}
                                        placeholder="10-digit phone number"
                                    />
                                    {bulkErrors.phone && (
                                        <p className="text-red-500 text-xs mt-1 font-playfair">{bulkErrors.phone}</p>
                                    )}
                                </div>

                                {/* Quantity Field */}
                                <div>
                                    <label className="block text-sm font-bold text-[#4A3737] mb-2">
                                        Bulk Quantity *
                                    </label>
                                    <input
                                        type="text"
                                        value={bulkForm.quantity}
                                        onChange={(e) => setBulkForm({ ...bulkForm, quantity: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-xl font-playfair focus:outline-none focus:ring-2 transition-all ${bulkErrors.quantity ? 'border-red-300 focus:ring-red-200' : 'border-orange-200 focus:ring-saffron/20 focus:border-saffron'}`}
                                        placeholder="e.g. 10kg, 50 pieces"
                                    />
                                    {bulkErrors.quantity && (
                                        <p className="text-red-500 text-xs mt-1 font-playfair">{bulkErrors.quantity}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleBulkEnquirySubmit}
                                className="w-full mt-6 px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-3 rounded-full"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                Send via WhatsApp
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* External Zoom Container - Follows mouse cursor */}
            {isZooming && (
                <div
                    className="fixed w-[350px] h-[400px] rounded-2xl shadow-2xl border border-orange-100 overflow-hidden hidden lg:block pointer-events-none"
                    style={{
                        top: mousePos.y - 200,
                        left: mousePos.x + 30,
                        zIndex: 9999,
                    }}
                >
                    <div
                        className="absolute inset-0 bg-white"
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url(${product.images && product.images.length > 0 ? product.images[imageIndex] : '/placeholder-product.png'})`,
                            backgroundSize: '300%',
                            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            backgroundRepeat: 'no-repeat',
                        }}
                    />
                </div>
            )}
        </div>
    )
}
