'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { exchangeCodeForTokens } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const errorParam = searchParams.get('error')

        if (errorParam) {
          setError(`Erreur d'authentification: ${errorParam}`)
          setStatus('error')
          return
        }

        if (!code || !state) {
          setError('Paramètres de callback manquants')
          setStatus('error')
          return
        }

        const success = await exchangeCodeForTokens(code, state)

        if (success) {
          setStatus('success')
          // Rediriger vers la page d'accueil après un court délai
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          setError("Échec de l'échange du code d'autorisation")
          setStatus('error')
        }
      } catch (error) {
        console.error('Erreur dans le callback:', error)
        setError("Une erreur inattendue s'est produite")
        setStatus('error')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'loading' && 'Authentification en cours...'}
            {status === 'success' && 'Connexion réussie'}
            {status === 'error' && "Erreur d'authentification"}
          </CardTitle>
          <CardDescription className="text-center">
            {status === 'loading' && 'Veuillez patienter pendant que nous finalisons votre connexion.'}
            {status === 'success' && "Vous allez être redirigé vers l'application."}
            {status === 'error' && "Une erreur s'est produite lors de l'authentification."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === 'loading' && <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>}

          {status === 'success' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription>Vous êtes maintenant connecté. Redirection en cours...</AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error || "Une erreur inconnue s'est produite."}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
