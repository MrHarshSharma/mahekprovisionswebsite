import { createServiceRoleClient } from '@/utils/supabase/service-role'
import ProductsClient from './products-client'
import type { Metadata } from 'next'

// Disable static caching - always fetch fresh data
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Shop All Products - Groceries & Provisions',
    description: 'Browse our complete collection of quality groceries, daily essentials & provisions. Best prices, fast delivery. Shop online at Mahek Provisions!',
    keywords: ['groceries online', 'provisions', 'daily essentials', 'household items', 'buy groceries', 'online shopping', 'Digras grocery'],
    openGraph: {
        title: 'Shop All Products | Mahek Provisions',
        description: 'Browse our complete collection of quality groceries, daily essentials & provisions. Best prices!',
        url: 'https://mahekprovisions.vercel.app/products',
        siteName: 'Mahek Provisions',
        locale: 'en_IN',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Mahek Provisions Products',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Shop All Products | Mahek Provisions',
        description: 'Browse our collection of quality groceries & provisions.',
        images: ['/og-image.png'],
    },
    alternates: {
        canonical: 'https://mahekprovisions.vercel.app/products',
    },
}

async function getProducts() {
    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
        .from('product')
        .select('id, name, description, price, categories, images, product_type, variations, created_at')
        .eq('instock', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching products:', error)
        return []
    }

    return data || []
}

export default async function ProductsPage() {
    const products = await getProducts()

    const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'All Products - Mahek Provisions',
        description: 'Browse our complete collection of quality groceries, daily essentials and provisions.',
        url: 'https://mahekprovisions.vercel.app/products',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: products.slice(0, 20).map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Product',
                    name: product.name,
                    url: `https://mahekprovisions.vercel.app/product/${product.id}`,
                    image: product.images?.[0] || 'https://mahekprovisions.vercel.app/logo.png',
                    offers: {
                        '@type': 'Offer',
                        price: product.price,
                        priceCurrency: 'INR',
                        availability: 'https://schema.org/InStock',
                        seller: {
                            '@type': 'Organization',
                            name: 'Mahek Provisions',
                        },
                    },
                },
            })),
        },
    }

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://mahekprovisions.vercel.app',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Products',
                item: 'https://mahekprovisions.vercel.app/products',
            },
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([collectionSchema, breadcrumbSchema]) }}
            />
            <ProductsClient products={products} />
        </>
    )
}
