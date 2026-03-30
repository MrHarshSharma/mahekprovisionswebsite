import type { Metadata } from 'next'
import TermsClient from './terms-client'

export const metadata: Metadata = {
    title: 'Terms & Conditions',
    description: 'Read Mahek Provisions terms and conditions. Learn about our ordering process, payments, and user guidelines.',
    openGraph: {
        title: 'Terms & Conditions | Mahek Provisions',
        description: 'Learn about our ordering process, payments, and user guidelines.',
        url: 'https://mahekprovisions.com/terms-and-conditions',
        siteName: 'Mahek Provisions',
        locale: 'en_IN',
        type: 'website',
    },
    alternates: {
        canonical: 'https://mahekprovisions.com/terms-and-conditions',
    },
}

export default function TermsPage() {
    return <TermsClient />
}
