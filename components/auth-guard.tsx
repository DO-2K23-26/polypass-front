'use client'

import type React from 'react'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/auth'
import { initiateOIDCLogin } from '@/lib/auth'
import { usePathname } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, accessToken } = useAuthStore()

  const pathname = usePathname() // Get current path

  // Skip guard for /auth/callback
  if (pathname === '/auth/callback') {
    return <>{children}</>
  }

  useEffect(() => {
    // Si pas d'access token, rediriger vers l'identity provider
    if (!accessToken) {
      initiateOIDCLogin()
    }
  }, [accessToken])

  // Afficher un loader pendant la redirection
  if (!isAuthenticated || !accessToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Connexion en cours...</h2>
          <p className="text-muted-foreground">Redirection vers le fournisseur d'identité...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
