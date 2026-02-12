import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Mahek Provisions',
        short_name: 'Mahek',
        description: 'Nourishing Families Since Decades. Your Quality Grocery Store.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#059669',
        icons: [
            {
                src: '/icon.png',
                sizes: '64x64',
                type: 'image/png',
            },
        ],
    }
}
