import type { Metadata } from 'next'
import RefundClient from './refund-client'

export const metadata: Metadata = {
    title: 'Refund & Cancellation Policy',
    description: 'Learn about Mahek Provisions refund and cancellation policy. Easy returns within 7 days. Hassle-free refund process.',
    openGraph: {
        title: 'Refund Policy | Mahek Provisions',
        description: 'Easy returns within 7 days. Hassle-free refund process.',
        url: 'https://mahekprovisions.vercel.app/refund-policy',
        siteName: 'Mahek Provisions',
        locale: 'en_IN',
        type: 'website',
    },
    alternates: {
        canonical: 'https://mahekprovisions.vercel.app/refund-policy',
    },
}

export default function RefundPolicyPage() {
    return <RefundClient />
}
