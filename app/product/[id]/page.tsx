import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'
import ProductDetails from './product-details'
import { Product } from '@/data/products'

// ISR: Revalidate every 10 minutes - product pages are cached at edge
export const revalidate = 600

interface PageProps {
    params: Promise<{ id: string }>
}

async function getProduct(id: string) {
    // If ID is undefined, return null immediately
    if (!id || id === 'undefined') return null

    const supabase = createServiceRoleClient()
    const { data: product, error } = await supabase
        .from('product')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !product) {
        return null
    }

    return product as Product
}

export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        return {
            title: 'Product Not Found',
        }
    }

    const previousImages = (await parent).openGraph?.images || []

    // Use first product image or fallback
    const mainImage = product.images?.[0] || '/placeholder-product.png'

    // Parse description if it's JSON
    let metaDescription = product.description
    try {
        const jsonDesc = JSON.parse(product.description)
        if (typeof jsonDesc === 'object' && jsonDesc !== null && jsonDesc.productDescription) {
            metaDescription = jsonDesc.productDescription
        }
    } catch {
        // Not JSON, use description as is
    }

    const truncatedDesc = metaDescription?.substring(0, 150) || ''

    return {
        title: `${product.name} - Buy Online`,
        description: `Buy ${product.name} online at Mahek Provisions. ${truncatedDesc}${truncatedDesc.length >= 150 ? '...' : ''} Best prices & fast delivery!`,
        openGraph: {
            title: `${product.name} | Mahek Provisions`,
            description: metaDescription,
            url: `https://mahekprovisions.vercel.app/product/${id}`,
            siteName: 'Mahek Provisions',
            locale: 'en_IN',
            type: 'website',
            images: [
                {
                    url: mainImage,
                    width: 800,
                    height: 800,
                    alt: product.name,
                },
                ...previousImages,
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.name} | Mahek Provisions`,
            description: metaDescription,
            images: [mainImage],
        },
        alternates: {
            canonical: `https://mahekprovisions.vercel.app/product/${id}`,
        },
    }
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        notFound()
    }

    // Parse description for schema
    let schemaDescription = product.description
    try {
        const jsonDesc = JSON.parse(product.description)
        if (typeof jsonDesc === 'object' && jsonDesc !== null && jsonDesc.productDescription) {
            schemaDescription = jsonDesc.productDescription
        }
    } catch {
        // Not JSON, use as is
    }

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: schemaDescription,
        image: product.images || [],
        url: `https://mahekprovisions.vercel.app/product/${product.id}`,
        brand: {
            '@type': 'Brand',
            name: 'Mahek Provisions',
        },
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'Mahek Provisions',
            },
            url: `https://mahekprovisions.vercel.app/product/${product.id}`,
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
            {
                '@type': 'ListItem',
                position: 3,
                name: product.name,
                item: `https://mahekprovisions.vercel.app/product/${product.id}`,
            },
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([productSchema, breadcrumbSchema]) }}
            />
            <ProductDetails product={product} />
        </>
    )
}
