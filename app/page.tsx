import { createServiceRoleClient } from '@/utils/supabase/service-role'
import HomeClient from '@/components/home-client'
import { Product } from '@/data/products'
import type { Metadata } from 'next'

// ISR: Revalidate every 5 minutes - page is cached and served instantly from edge
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Mahek Provisions | Quality Groceries & Provisions Online',
  description: 'Shop quality groceries, daily essentials & provisions online at Mahek Provisions. Your trusted neighborhood store in Digras, Maharashtra since 1986. Fast delivery & best prices!',
  keywords: ['Mahek Provisions', 'grocery store Digras', 'online groceries', 'provisions shop', 'daily essentials', 'kirana store', 'household items', 'quality products'],
  openGraph: {
    title: 'Mahek Provisions | Quality Groceries & Provisions Store',
    description: 'Shop quality groceries, daily essentials & provisions online. Your trusted store in Digras since 1986!',
    url: 'https://mahekprovisions.vercel.app',
    siteName: 'Mahek Provisions',
    locale: 'en_IN',
    type: 'website',
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
    description: 'Shop quality groceries & daily essentials online. Trusted store since 1986!',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://mahekprovisions.vercel.app',
  },
}

async function getProducts() {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return (data || []) as Product[]
}

export default async function Home() {
  const products = await getProducts()

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://mahekprovisions.vercel.app/#organization',
    name: 'Mahek Provisions',
    url: 'https://mahekprovisions.vercel.app',
    logo: {
      '@type': 'ImageObject',
      url: 'https://mahekprovisions.vercel.app/logo.png',
      width: 512,
      height: 512,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-93595-87859',
      contactType: 'customer service',
      email: 'mahekprovisions20@gmail.com',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Marathi'],
    },
    sameAs: [
      'https://www.instagram.com/mahekprovisions',
      'https://www.facebook.com/mahekprovisions',
    ],
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'GroceryStore',
    '@id': 'https://mahekprovisions.vercel.app/#store',
    name: 'Mahek Provisions',
    description: 'Quality groceries, daily essentials and provisions store in Digras, Maharashtra. Serving customers since 1986.',
    image: 'https://mahekprovisions.vercel.app/logo.png',
    url: 'https://mahekprovisions.vercel.app',
    telephone: '+91-93595-87859',
    email: 'mahekprovisions20@gmail.com',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Rd, near Shitla Mata Mandir',
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
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Mahek Provisions Products',
      itemListElement: products.slice(0, 10).map(p => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: p.name,
          url: `https://mahekprovisions.vercel.app/product/${p.id}`,
        },
      })),
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://mahekprovisions.vercel.app/#website',
    url: 'https://mahekprovisions.vercel.app',
    name: 'Mahek Provisions',
    description: 'Quality groceries, daily essentials and provisions online store',
    publisher: {
      '@id': 'https://mahekprovisions.vercel.app/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://mahekprovisions.vercel.app/products?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const jsonLd = [organizationSchema, localBusinessSchema, websiteSchema]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient products={products} />
    </>
  )
}
