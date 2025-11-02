import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Header } from './components/layout/Header'

export const metadata: Metadata = {
  title: 'Neopets Tribute - Nostalgic Pet Gallery',
  description: 'A nostalgic tribute to Neopets featuring all pets, colors, and avatars',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
