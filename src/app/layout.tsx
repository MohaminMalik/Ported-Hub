import type { Metadata } from 'next'
import './globals.css'
import './animations.css'
import Link from 'next/link'
import Header from '@/components/Header'
import ToastContainer from '@/components/Toast'

export const metadata: Metadata = {
  title: 'Ported Hub | Premium Vintage & Streetwear Fashion',
  description: 'Discover curated vintage, 90s grunge, and Y2K streetwear. Every piece is hand-selected and verified for quality, authenticity, and sustainable style at Ported Hub.',
  keywords: ['vintage clothing', 'streetwear', 'y2k fashion', 'sustainable fashion', 'thrift store', 'Ported Hub', 'premium thrift', 'leather jackets'],
  openGraph: {
    title: 'Ported Hub | Premium Vintage Fashion',
    description: 'Find your unique style with our curated collection of vintage and streetwear.',
    url: 'https://portedhub.com',
    siteName: 'Ported Hub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ported Hub | Premium Vintage Fashion',
    description: 'Find your unique style with our curated collection of vintage and streetwear.',
    creator: '@PortedHub',
  },
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="main-content">
          {children}
        </main>
        <ToastContainer />
      </body>
    </html>
  )
}
