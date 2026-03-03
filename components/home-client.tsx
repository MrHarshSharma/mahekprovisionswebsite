'use client'

import Image from "next/image"
import Link from "next/link"
import { Product } from '@/data/products'
import ProductCard from '@/components/product-card'
import { useLanguage } from '@/context/language-context'

export default function HomeClient({ products }: { products: Product[] }) {
    const { t } = useLanguage()
    return (
        <>
            {/* Hero Section */}
            <section id="home" className="hero">
                <div className="container">
                    <div className="hero-content animate">
                        <span className="hero-tagline">{t('home.hero.badge')}</span>
                        <h1>{t('home.hero.title')}</h1>
                        <p>{t('home.hero.description')}</p>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }} className="lg:justify-start">
                            <Link href="/products" className="btn btn-primary">{t('home.hero.browseBtn')}</Link>
                            <Link href="/about" className="btn" style={{ border: '1px solid var(--glass-border)', background: 'white' }}>{t('home.hero.storyBtn')}</Link>
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
                    <h2 className="animate">{t('home.categories.title')}</h2>
                    <div className="category-grid">
                        {[
                            { icon: "🥛", titleKey: "home.categories.dairy", descKey: "home.categories.dairyDesc", delay: '0.1s' },
                            { icon: "🌾", titleKey: "home.categories.grains", descKey: "home.categories.grainsDesc", delay: '0.2s' },
                            { icon: "🥐", titleKey: "home.categories.bakery", descKey: "home.categories.bakeryDesc", delay: '0.3s' },
                            { icon: "🍵", titleKey: "home.categories.spices", descKey: "home.categories.spicesDesc", delay: '0.4s' }
                        ].map((cat, i) => (
                            <div key={i} className="category-card animate" style={{ animationDelay: cat.delay }}>
                                <span className="category-icon">{cat.icon}</span>
                                <h3>{t(cat.titleKey)}</h3>
                                <p>{t(cat.descKey)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            {products.length > 0 && (
                <section style={{ background: 'var(--background)', padding: '6rem 0' }}>
                    <div className="container">
                        <h2 className="animate">{t('home.featured.title')}</h2>
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
                                {t('home.featured.viewAll')}
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
                        <h2 style={{ textAlign: 'left', marginBottom: '1.5rem' }}>{t('home.quality.title')}</h2>
                        <p style={{ fontSize: '1.25rem', opacity: '0.8', marginBottom: '2rem' }}>
                            {t('home.quality.description')}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{t('home.quality.stat1')}</h3>
                                <p style={{ fontSize: '0.9rem', opacity: '0.7' }}>{t('home.quality.stat1Desc')}</p>
                            </div>
                            <div>
                                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{t('home.quality.stat2')}</h3>
                                <p style={{ fontSize: '0.9rem', opacity: '0.7' }}>{t('home.quality.stat2Desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
