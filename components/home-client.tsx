'use client'

import Image from "next/image"
import Link from "next/link"
import { Product } from '@/data/products'
import ProductCard from '@/components/product-card'

export default function HomeClient({ products }: { products: Product[] }) {
    return (
        <>
            {/* Hero Section */}
            <section id="home" className="hero">
                <div className="container">
                    <div className="hero-content animate">
                        <span className="hero-tagline">Awarded Safest Groceries 2024</span>
                        <h1>Nourishing Families Since Decades.</h1>
                        <p>Experience the heritage of quality provisions at Mahek. Fresh, trusted, and delivered with care since 1916.</p>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }} className="lg:justify-start">
                            <Link href="/products" className="btn btn-primary">Browse Essentials</Link>
                            <Link href="/about" className="btn" style={{ border: '1px solid var(--glass-border)', background: 'white' }}>Our Story</Link>
                        </div>
                    </div>
                    <div className="hero-image-container animate" style={{ animationDelay: '0.4s' }}>
                        <div className="hero-img-main">
                            <Image src="/hero-basket.png" alt="Fresh Grocery Basket" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="hero-img-secondary">
                            <Image src="/hero-grains.png" alt="Premium Grains" fill style={{ objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            {products.length > 0 && (
                <section style={{ background: 'var(--background)', padding: '6rem 0' }}>
                    <div className="container">
                        <h2 className="animate">Featured Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {products.slice(0, 6).map((product, index) => (
                                <div
                                    key={product.id}
                                    className="animate"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                        <div className="mt-16 text-center">
                            <Link href="/products" className="btn btn-primary">
                                View Full Collection
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="container" style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', minWidth: '300px', position: 'relative', height: '450px', borderRadius: '40px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }} className="animate">
                        <Image src="/about-store.png" alt="Mahek Provisions Store Interior" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: '1', minWidth: '300px' }} className="animate">
                        <h2 style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Dedicated to Pure Excellence</h2>
                        <p style={{ fontSize: '1.25rem', opacity: '0.8', marginBottom: '2rem' }}>
                            At Mahek Provisions, we don&apos;t just sell groceries—we curate everyday essentials that embody trust, quality, and tradition. From our family to yours.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>100%</h3>
                                <p style={{ fontSize: '0.9rem', opacity: '0.7' }}>Quality Assurance on every item</p>
                            </div>
                            <div>
                                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>50k+</h3>
                                <p style={{ fontSize: '0.9rem', opacity: '0.7' }}>Happy households served with care</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
