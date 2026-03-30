import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mahekprovisions.com/'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/my-orders'],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    }
}
