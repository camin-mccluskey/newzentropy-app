import '~/styles/globals.css'

import { GeistSans } from 'geist/font/sans'
import { type Metadata } from 'next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { TRPCReactProvider } from '~/trpc/react'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Newzentropy',
  description: 'A best worst news aggregator that',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <Script
        defer
        data-domain="newzentropy.com"
        src="https://getanalyzr.vercel.app/tracking-script.js"
      />
      <body>
        <NuqsAdapter>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
