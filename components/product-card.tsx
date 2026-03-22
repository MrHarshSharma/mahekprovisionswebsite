'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { Product } from '@/data/products'

export default function ProductCard({ product }: { product: Product }) {

    const [showEnquiry, setShowEnquiry] = useState(false)
    const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '' })
    const [enquiryErrors, setEnquiryErrors] = useState({ name: '', phone: '' })

    const isVariable = (product as any).product_type === 'variable' && (product as any).variations?.length > 0
    const variations = (product as any).variations as Array<{ name: string; price: number }> | undefined
    const outOfStock = product.instock === false

    const handleEnquirySubmit = () => {
        const errors = { name: '', phone: '' }
        let hasError = false

        if (!enquiryForm.name.trim()) {
            errors.name = 'Name is required'
            hasError = true
        }
        if (!enquiryForm.phone.trim()) {
            errors.phone = 'Phone number is required'
            hasError = true
        } else if (!/^\d{10}$/.test(enquiryForm.phone)) {
            errors.phone = 'Phone number must be exactly 10 digits'
            hasError = true
        }

        setEnquiryErrors(errors)
        if (hasError) return

        const message = `Hi, I'm enquiring about "${product.name}" which is currently out of stock.\n\nPlease let me know when it's available.\n\nName: ${enquiryForm.name}\nPhone: ${enquiryForm.phone}`
        const whatsappUrl = `https://wa.me/919359587859?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')

        setEnquiryForm({ name: '', phone: '' })
        setEnquiryErrors({ name: '', phone: '' })
        setShowEnquiry(false)
    }

    const card = (
        <article className={`h-full bg-white border border-stone-100 rounded-2xl overflow-hidden transition-all duration-500 flex flex-col ${outOfStock ? 'grayscale opacity-60' : 'hover:border-amber-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]'}`}>
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                    src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.png'}
                    alt={product.name}
                    fill
                    className={`object-contain p-4 transition-all duration-700 ${outOfStock ? '' : 'group-hover:scale-105'}`}
                />

                {!outOfStock && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                {/* Category */}
                {product.categories && product.categories.length > 0 && (
                    <span className="inline-block text-[11px] font-medium text-amber-600 tracking-widest capitalize mb-2">
                        {product.categories[0]}
                    </span>
                )}

                {/* Title */}
                <span
                    className="text-lg leading-snug font-semibold text-stone-800 line-clamp-2 mb-2 group-hover:text-amber-700 transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    {product.name}
                </span>

                {/* Price & CTA */}
                <div className="pt-3 border-t border-stone-100 mt-auto">
                    {isVariable && variations ? (
                        <div>
                            <span className="text-[11px] text-stone-400 uppercase tracking-wide">Price</span>
                            <div className="flex flex-wrap justify-between gap-y-2 mt-1">
                                {variations.map((v, i) => (
                                    <span key={i} className="text-[12px] text-stone-600">
                                        <span className="text-stone-400">{v.name}:</span>{' '}
                                        <span className="font-bold text-stone-900">₹{v.price.toLocaleString()}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="text-[11px] text-stone-400 uppercase tracking-wide">Price</span>
                                <p className="text-md font-bold text-stone-900 -mt-0.5">
                                    ₹{product.price.toLocaleString()}
                                </p>
                            </div>

                            {!outOfStock && (
                                <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                                    Shop
                                    <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </article>
    )

    return (
        <>
            {outOfStock ? (
                <div className="relative block h-full cursor-not-allowed">
                    {card}
                    {/* Out of stock overlay - rendered OUTSIDE the grayscale article */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl" style={{ top: 0, pointerEvents: 'none' }}>
                        <span className="bg-black px-3 py-1.5 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                            Out of Stock
                        </span>
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEnquiry(true) }}
                            className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-black text-[11px] font-bold uppercase tracking-wider rounded-full shadow-lg transition-all cursor-pointer"
                            style={{ pointerEvents: 'auto' }}
                        >
                            Enquire
                        </button>
                    </div>
                </div>
            ) : (
                <Link href={`/product/${product.id}`} className="group block h-full">
                    {card}
                </Link>
            )}

            {/* Enquiry Modal */}
            {showEnquiry && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1001] flex items-center justify-center p-4"
                    onClick={() => setShowEnquiry(false)}
                >
                    <div
                        className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xl md:text-2xl font-bold text-stone-800" style={{ fontFamily: 'var(--font-heading)' }}>
                                Product Enquiry
                            </span>
                            <button
                                onClick={() => setShowEnquiry(false)}
                                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-stone-500" />
                            </button>
                        </div>

                        <div className="bg-amber-50 rounded-xl px-4 py-3 mb-4 border border-amber-100">
                            <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold mb-1">Product</p>
                            <p className="text-base font-semibold text-stone-800">{product.name}</p>
                        </div>

                        <p className="text-sm text-stone-500 mb-6">
                            This product is currently out of stock. Leave your details and we&apos;ll notify you when it&apos;s available.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={enquiryForm.name}
                                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${enquiryErrors.name ? 'border-red-300 focus:ring-red-200' : 'border-stone-200 focus:ring-amber-200 focus:border-amber-400'}`}
                                    placeholder="Enter your full name"
                                />
                                {enquiryErrors.name && (
                                    <p className="text-red-500 text-xs mt-1">{enquiryErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={enquiryForm.phone}
                                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${enquiryErrors.phone ? 'border-red-300 focus:ring-red-200' : 'border-stone-200 focus:ring-amber-200 focus:border-amber-400'}`}
                                    placeholder="10-digit phone number"
                                />
                                {enquiryErrors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{enquiryErrors.phone}</p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleEnquirySubmit}
                            className="w-full mt-6 px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-3 rounded-full"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Send via WhatsApp
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
