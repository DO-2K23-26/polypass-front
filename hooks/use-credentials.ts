import { useState, useEffect } from 'react'
import type { PasswordEntry } from '@/types/password-entry'

function computeStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length > 12 && /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password)) return 'strong'
  if (password.length >= 8) return 'medium'
  return 'weak'
}

export function useCredentials(userId: string) {
  const [credentials, setCredentials] = useState<PasswordEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCredentials() {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/users/credentials`)
        url.searchParams.append('user_id', userId)
        const res = await fetch(url.toString(), { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des credentials')
        }
        const data = await res.json()
        const mapped = data.map((c: any) => ({
          id: c.id,
          title: c.title,
          website: c.domain_name,
          username: c.user_identifier,
          password: c.password,
          strength: computeStrength(c.password ?? ''),
          lastUpdated: c.updated_at ?? c.created_at,
          folderId: '',
          tags: [],
        }))
        setCredentials(mapped)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCredentials()
  }, [userId])

  return { credentials, isLoading }
}
