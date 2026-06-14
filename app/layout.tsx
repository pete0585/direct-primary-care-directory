import type { Metadata } from 'next'
import { Orbitron } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://directprimarycarefinder.com'),
  title: {
    default: 'Direct Primary Care Finder | Find a DPC Doctor Near You',
    template: '%s | DirectPrimaryCareFinder.com',
  },
  description:
    'Find a Direct Primary Care practice near you. Flat monthly membership, no insurance required. Compare DPC doctors by price, specialty, and location — 2,000+ practices across 48 states.',
  keywords: [
    'direct primary care near me',
    'DPC doctor',
    'direct primary care directory',
    'find DPC practice',
    'membership medicine',
    'concierge doctor near me',
    'direct care doctor',
  ],
  openGraph: {
    type: 'website',
    siteName: 'DirectPrimaryCareFinder.com',
    title: 'Direct Primary Care Finder | Find a DPC Doctor Near You',
    description:
      'Find a Direct Primary Care practice near you. Flat monthly membership, no insurance required.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://directprimarycarefinder.com' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={orbitron.variable}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
