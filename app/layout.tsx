import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Sevasaathi — Find Trusted Skilled Workers Near You',
    template: '%s | Sevasaathi',
  },
  description:
    'Sevasaathi connects you with verified carpenters, electricians, plumbers, painters, and other skilled workers in your neighbourhood. No middlemen.',
  keywords: ['electrician', 'plumber', 'carpenter', 'skilled workers', 'India', 'local workers'],
  openGraph: {
    siteName: 'Sevasaathi',
    type: 'website',
    locale: 'en_IN',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}
