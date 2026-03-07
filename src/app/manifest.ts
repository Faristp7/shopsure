import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'ShopSure Seller App',
        short_name: 'ShopSure',
        description: 'Manage your ShopSure store',
        start_url: '/seller',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0a0a0a',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
