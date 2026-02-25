'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/data/products'

export default function ProductCard({ product }: { product: Product }) {
    const getPrice = () => {
        if ((product as any).product_type === 'variable' && (product as any).variations) {
            const prices = (product as any).variations.map((v: any) => v.price)
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)
            return minPrice === maxPrice ? `₹${minPrice.toLocaleString()}` : `₹${minPrice.toLocaleString()} – ₹${maxPrice.toLocaleString()}`
        }
        return `₹${product.price.toLocaleString()}`
    }

    const getDescription = () => {
        try {
            const jsonDesc = JSON.parse(product.description)
            return jsonDesc.productDescription || product.description
        } catch {
            return product.description
        }
    }

    return (
        <Link href={`/product/${product.id}`} className="group block h-full">
            <article className="h-full bg-white border border-stone-100 rounded-2xl overflow-hidden transition-all duration-500 hover:border-amber-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-white">
                    <Image
                        src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.png'}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-all duration-700 group-hover:scale-105"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    {/* Category */}
                    {product.categories && product.categories.length > 0 && (
                        <span className="inline-block text-[11px] font-medium text-amber-600 tracking-widest uppercase mb-2">
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

                    {/* Description */}
                    <p className="text-[13px] leading-relaxed text-stone-500 line-clamp-2 mb-4 flex-1">
                        {getDescription()}
                    </p>

                    {/* Price & CTA */}
                    <div className="flex items-end justify-between pt-3 border-t border-stone-100 mt-auto">
                        <div>
                            <span className="text-[11px] text-stone-400 uppercase tracking-wide">Price</span>
                            <p className="text-md font-bold text-stone-900 -mt-0.5">
                                {getPrice()}
                            </p>
                        </div>

                        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                            Shop
                            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    )
}
