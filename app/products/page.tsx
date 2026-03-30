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
        url: 'https://mahekprovisions.com/products',
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
        canonical: 'https://mahekprovisions.com/products',
    },
}

const PRODUCTS_PER_PAGE = 20

async function getProducts(page: number = 1, category: string = '') {
    const supabase = createServiceRoleClient()
    const limit = PRODUCTS_PER_PAGE
    const offset = (page - 1) * limit

    // Build count query
    let countQuery = supabase
        .from('product')
        .select('*', { count: 'exact', head: true })

    // Build data query
    let dataQuery = supabase
        .from('product')
        .select('id, name, description, price, categories, images, product_type, variations, instock, created_at')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    // Apply category filter if provided
    if (category && category !== 'All') {
        countQuery = countQuery.contains('categories', [category])
        dataQuery = dataQuery.contains('categories', [category])
    }

    const [countResult, dataResult] = await Promise.all([countQuery, dataQuery])

    if (dataResult.error) {
        console.error('Error fetching products:', dataResult.error)
        return { products: [], pagination: null }
    }

    const totalCount = countResult.count || 0
    const totalPages = Math.ceil(totalCount / limit)

    return {
        products: dataResult.data || [],
        pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    }
}

export default async function ProductsPage() {
    const { products, pagination } = await getProducts()

    const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'All Products - Mahek Provisions',
        description: 'Browse our complete collection of quality groceries, daily essentials and provisions.',
        url: 'https://mahekprovisions.com/products',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: products.slice(0, 20).map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Product',
                    name: product.name,
                    url: `https://mahekprovisions.com/product/${product.id}`,
                    image: product.images?.[0] || 'https://mahekprovisions.com/logo.png',
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
                item: 'https://mahekprovisions.com/',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Products',
                item: 'https://mahekprovisions.com/products',
            },
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([collectionSchema, breadcrumbSchema]) }}
            />
            <ProductsClient products={products} initialPagination={pagination} />
        </>
    )
}
