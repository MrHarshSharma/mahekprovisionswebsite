import type { Metadata } from 'next'
import AboutClient from './about-client'

export const metadata: Metadata = {
    title: 'About Us - Our Story & Values',
    description: 'Learn about Mahek Provisions - your trusted grocery and provisions store in Digras, Maharashtra since 1916. Quality products, honest service, and community trust.',
    keywords: ['about Mahek Provisions', 'grocery store Digras', 'provisions shop history', 'trusted store Maharashtra'],
    openGraph: {
        title: 'About Mahek Provisions | Our Story',
        description: 'Your trusted grocery and provisions store in Digras since 1916. Quality products & honest service.',
        url: 'https://mahekprovisions.com/about',
        siteName: 'Mahek Provisions',
        locale: 'en_IN',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'About Mahek Provisions',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Mahek Provisions',
        description: 'Your trusted grocery store in Digras since 1916.',
        images: ['/og-image.png'],
    },
    alternates: {
        canonical: 'https://mahekprovisions.com/about',
    },
}

export default function AboutPage() {
    const aboutSchema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Mahek Provisions',
        description: 'Learn about Mahek Provisions - your trusted grocery and provisions store in Digras, Maharashtra since 1916.',
        url: 'https://mahekprovisions.com/about',
        mainEntity: {
            '@type': 'GroceryStore',
            name: 'Mahek Provisions',
            foundingDate: '1916',
            address: {
                '@type': 'PostalAddress',
                streetAddress: 'Main Rd, near Shitla Mata Mandir',
                addressLocality: 'Digras',
                addressRegion: 'Maharashtra',
                postalCode: '445203',
                addressCountry: 'IN',
            },
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
                name: 'About Us',
                item: 'https://mahekprovisions.com/about',
            },
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([aboutSchema, breadcrumbSchema]) }}
            />
            <AboutClient />
        </>
    )
}
