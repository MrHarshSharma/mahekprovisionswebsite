import type { Metadata } from 'next'
import ContactClient from './contact-client'

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with Mahek Provisions for inquiries about your orders or our products. Visit our store in Digras, Maharashtra or call us at +91 93595 87859.',
    keywords: ['contact Mahek Provisions', 'grocery store Digras', 'provisions shop contact', 'customer support'],
    openGraph: {
        title: 'Contact Us | Mahek Provisions',
        description: 'Visit our Digras store or contact us for any inquiries. Call +91 93595 87859.',
        url: 'https://mahekprovisions.vercel.app/contact',
        siteName: 'Mahek Provisions',
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: 'Contact Mahek Provisions',
        description: 'Get in touch with us for any inquiries.',
    },
    alternates: {
        canonical: 'https://mahekprovisions.vercel.app/contact',
    },
}

export default function ContactPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'GroceryStore',
        name: 'Mahek Provisions',
        image: 'https://mahekprovisions.vercel.app/logo.png',
        '@id': 'https://mahekprovisions.vercel.app',
        url: 'https://mahekprovisions.vercel.app/contact',
        telephone: '+919359587859',
        priceRange: '₹₹',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Main Rd, near shitla mata mandir',
            addressLocality: 'Digras',
            addressRegion: 'Maharashtra',
            postalCode: '445203',
            addressCountry: 'IN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 20.101414,
            longitude: 77.716486,
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                ],
                opens: '09:00',
                closes: '21:00',
            },
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+919359587859',
            contactType: 'customer service',
            email: 'mahekprovisions20@gmail.com',
            areaServed: 'IN',
            availableLanguage: ['en', 'hi', 'mr'],
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ContactClient />
        </>
    )
}
