import { useState, useEffect } from 'react'
import { Credential } from '@/types/credential'
import { mockCredentials } from '@/lib/mocks/credentials'

export function useCredentials() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        // En développement, utiliser les données mockées
        if (process.env.NODE_ENV === 'development') {
          setCredentials(mockCredentials)
          setIsLoading(false)
          return
        }

        // En production, faire l'appel API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/credentials`)
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des credentials')
        }
        const data = await response.json()
        setCredentials(data)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCredentials()
  }, [])

  return { credentials, isLoading }
} 