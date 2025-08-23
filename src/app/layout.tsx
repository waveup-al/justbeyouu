import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://justbeyouu-75iz-9es4x9oh2-everrs-projects.vercel.app'),
  title: 'Nguyễn Công Hiếu - AI Agent & Automation Developer',
  description: 'Một người thích học mỗi ngày — AI Agent · Automation · Data',
  keywords: ['AI Agent', 'Automation', 'Data Analysis', 'Full Stack Developer'],
  authors: [{ name: 'Nguyễn Công Hiếu' }],
  openGraph: {
    title: 'Nguyễn Công Hiếu - AI Agent & Automation Developer',
    description: 'Một người thích học mỗi ngày — AI Agent · Automation · Data',
    url: 'https://justbeyouu-75iz-9es4x9oh2-everrs-projects.vercel.app',
    siteName: 'Hiếu Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nguyễn Công Hiếu Portfolio',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nguyễn Công Hiếu - AI Agent & Automation Developer',
    description: 'Một người thích học mỗi ngày — AI Agent · Automation · Data',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Nguyễn Công Hiếu',
              jobTitle: 'AI Agent & Automation Developer',
              description: 'Một người thích học mỗi ngày — AI Agent · Automation · Data',
              url: 'https://hieu-portfolio.vercel.app',
              sameAs: [
                'https://github.com/hieudev',
                'https://www.linkedin.com/in/hi%E1%BA%BFu-nguy%E1%BB%85n-c%C3%B4ng-324394361/',
              ],
              knowsAbout: ['AI Agent', 'Automation', 'Data Analysis', 'Full Stack Development'],
            }),
          }}
        />
      </head>
      <body className="bg-dark-bg text-white font-sans antialiased overflow-x-hidden">
        <LanguageProvider>
          <LanguageToggle />
          <div className="min-h-screen relative">
            {/* Starfield Background */}
            <div className="fixed inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-bg to-purple-900/20"></div>
              <div className="stars absolute inset-0"></div>
            </div>
            
            {/* Main Content */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}