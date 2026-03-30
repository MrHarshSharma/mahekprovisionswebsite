import { MetadataRoute } from 'next'
import { createServiceRoleClient } from '@/utils/supabase/service-role'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mahekprovisions.com/'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${siteUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${siteUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${siteUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${siteUrl}/shipping-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${siteUrl}/refund-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${siteUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${siteUrl}/terms-and-conditions`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ]

    // Dynamic product pages
    let productPages: MetadataRoute.Sitemap = []

    try {
        const supabase = createServiceRoleClient()
        const { data: products } = await supabase
            .from('product')
            .select('id, created_at')
            .order('created_at', { ascending: false })

        if (products) {
            productPages = products.map((product) => ({
                url: `${siteUrl}/product/${product.id}`,
                lastModified: new Date(product.created_at),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }))
        }
    } catch (error) {
        console.error('Error fetching products for sitemap:', error)
    }

    return [...staticPages, ...productPages]
}
