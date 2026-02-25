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
                        <h1>Nourishing Families <br /><span style={{ color: 'var(--primary-dark)' }}>Since Decades.</span></h1>
                        <p>Experience the heritage of quality. We source directly from the richest lands of India to bring you provisions that taste like home.</p>
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

            {/* Categories Section */}
            <section id="categories" style={{ background: '#fff' }}>
                <div className="container">
                    <h2 className="animate">Discover Our <span style={{ color: 'var(--primary-dark)' }}>Pantry Picks</span></h2>
                    <div className="category-grid">
                        {[
                            { icon: "🥛", title: "Dairy", desc: "Farm-fresh milk, organic butter, and regional gourmet cheeses.", delay: '0.1s' },
                            { icon: "🌾", title: "Rich Grains", desc: "Hand-picked Basmati rice, premium wheat, and ancient pulses.", delay: '0.2s' },
                            { icon: "🥐", title: "Bakery & Craft", desc: "Artisanal crusty breads and traditional Indian treats.", delay: '0.3s' },
                            { icon: "🍵", title: "Spices & Teas", desc: "Aromatic whole spices and estate-grown tea leaves.", delay: '0.4s' }
                        ].map((cat, i) => (
                            <div key={i} className="category-card animate" style={{ animationDelay: cat.delay }}>
                                <span className="category-icon">{cat.icon}</span>
                                <h3>{cat.title}</h3>
                                <p>{cat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            {products.length > 0 && (
                <section style={{ background: 'var(--background)', padding: '6rem 0' }}>
                    <div className="container">
                        <h2 className="animate">Featured <span style={{ color: 'var(--primary-dark)' }}>Products</span></h2>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
                        <h2 style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Dedicated to <br />Pure Excellence</h2>
                        <p style={{ fontSize: '1.25rem', opacity: '0.8', marginBottom: '2rem' }}>
                            At Mahek Provisions, we don't just sell groceries; we curate experiences for your kitchen. Founded on the principles of purity and transparency, every item on our shelves is a testament to our quality-first philosophy.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>100%</h3>
                                <p style={{ fontSize: '0.9rem', opacity: '0.7' }}>Quality Assurance on every single product we sell.</p>
                            </div>
                            <div>
                                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>50k+</h3>
                                <p style={{ fontSize: '0.9rem', opacity: '0.7' }}>Happy households served across the region.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
