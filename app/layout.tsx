import type React from 'react'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'
import { Metadata } from 'next'
import { AuthGuard } from '@/components/auth-guard'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthGuard>{children}</AuthGuard>
        <Toaster />
      </body>
    </html>
  )
}
