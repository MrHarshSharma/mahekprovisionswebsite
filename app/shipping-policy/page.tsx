import type { Metadata } from 'next'
import ShippingClient from './shipping-client'

export const metadata: Metadata = {
    title: 'Shipping Policy',
    description: 'Learn about Mahek Provisions shipping policy. Free delivery on orders above ₹999. Fast and reliable delivery across Maharashtra.',
    openGraph: {
        title: 'Shipping Policy | Mahek Provisions',
        description: 'Free delivery on orders above ₹999. Fast and reliable delivery.',
        url: 'https://mahekprovisions.vercel.app/shipping-policy',
        siteName: 'Mahek Provisions',
        locale: 'en_IN',
        type: 'website',
    },
    alternates: {
        canonical: 'https://mahekprovisions.vercel.app/shipping-policy',
    },
}

export default function ShippingPolicyPage() {
    return <ShippingClient />
}
