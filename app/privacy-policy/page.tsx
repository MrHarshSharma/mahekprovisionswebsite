import type { Metadata } from 'next'
import PrivacyClient from './privacy-client'

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Read Mahek Provisions privacy policy. Learn how we collect, use, and protect your personal information.',
    openGraph: {
        title: 'Privacy Policy | Mahek Provisions',
        description: 'Learn how we collect, use, and protect your personal information.',
        url: 'https://mahekprovisions.vercel.app/privacy-policy',
        siteName: 'Mahek Provisions',
        locale: 'en_IN',
        type: 'website',
    },
    alternates: {
        canonical: 'https://mahekprovisions.vercel.app/privacy-policy',
    },
}

export default function PrivacyPolicyPage() {
    return <PrivacyClient />
}
