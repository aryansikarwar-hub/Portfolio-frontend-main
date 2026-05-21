import '@/styles/global.css'
import AppShell from './AppShell'

export const metadata = {
    metadataBase: new URL('https://aryansikarwar.vercel.app'),
    title: {
        default: 'Aryan Sikarwar | Software Developer',
        template: '%s',
    },
    description:
        'Aryan Sikarwar - Software Developer. Building scalable, performant, and elegant web applications with React, Node.js, Python, and modern cloud technologies.',
    keywords: [
        'Aryan Sikarwar',
        'Software Developer',
        'Full Stack Developer',
        'React',
        'Node.js',
        'JavaScript',
        'TypeScript',
        'Python',
        'Web Developer',
    ],
    authors: [{ name: 'Aryan Sikarwar' }],
    openGraph: {
        title: 'Aryan Sikarwar | Software Developer',
        description:
            'Software Developer specializing in building scalable web applications with modern technologies.',
        type: 'website',
        url: 'https://aryansikarwar.vercel.app',
        siteName: 'Aryan Sikarwar',
        images: [
            {
                url: '/icon.png',
                width: 512,
                height: 512,
                alt: 'Aryan Sikarwar',
            },
        ],
    },
    twitter: {
        card: 'summary',
        title: 'Aryan Sikarwar | Software Developer',
        description: 'Building scalable web applications with React, Node.js, and modern cloud tech.',
        images: ['/icon.png'],
    },
    // File-based icons in /app are picked up automatically (icon.png, apple-icon.png, favicon.ico).
    // We keep an explicit `icons` map as well so older browsers and link previews resolve cleanly.
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.png', type: 'image/png', sizes: '512x512' },
        ],
        apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
        shortcut: '/favicon.ico',
    },
    manifest: '/manifest.json',
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#06070a',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/*
                  Google Fonts are loaded as standard <link> tags instead of via
                  next/font/google so that the 138+ existing CSS rules in this
                  codebase (font-family: 'Inter', 'JetBrains Mono', 'EB Garamond',
                  'Oswald', 'Space Mono', 'VT323') keep working unchanged.
                */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Oswald:wght@500;600;700&family=Space+Mono:wght@400;700&family=VT323&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <AppShell>{children}</AppShell>
            </body>
        </html>
    )
}