
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import { CartProvider } from '@/context/cart-context'
import { AuthProvider } from '@/context/auth-context'
import { LanguageProvider } from '@/context/language-context'
import CartDrawer from '@/components/cart-drawer'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' })

import { Suspense } from 'react'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mahekprovisions.vercel.app'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f7b700',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Mahek Provisions | Quality Groceries & Provisions Store in Digras',
    template: '%s | Mahek Provisions'
  },
  description: 'Shop quality groceries, daily essentials & provisions online at Mahek Provisions. Your trusted neighborhood store in Digras, Maharashtra since 1986. Fast delivery & best prices!',
  keywords: [
    'Mahek Provisions',
    'grocery store Digras',
    'provisions shop',
    'online groceries',
    'daily essentials',
    'grocery delivery Digras',
    'kirana store online',
    'household items',
    'quality provisions',
    'grocery shopping online',
    'Mahek Provision Digras',
    'Maharashtra grocery store'
  ],
  authors: [{ name: 'Mahek Provisions' }],
  creator: 'Mahek Provisions',
  publisher: 'Mahek Provisions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Mahek Provisions',
    title: 'Mahek Provisions | Quality Groceries & Provisions Store',
    description: 'Shop quality groceries, daily essentials & provisions online. Your trusted store in Digras since 1986. Fast delivery!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mahek Provisions - Quality Groceries & Provisions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahek Provisions | Quality Groceries & Provisions',
    description: 'Shop quality groceries & daily essentials online. Trusted store in Digras since 1986.',
    images: ['/og-image.png'],
    creator: '@mahekprovisions',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'ecommerce',
}

import Footer from '@/components/footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${plusJakarta.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <Suspense fallback={null}>
                <CartDrawer />
              </Suspense>
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

