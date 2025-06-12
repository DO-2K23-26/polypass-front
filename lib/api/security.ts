import { Credential } from '@/types/credential'

export interface SecurityMetrics {
  weakPasswords: {
    [password: string]: string[]
  }
  strongPasswords: {
    [password: string]: string[]
  }
  reusedPasswords: {
    [password: string]: string[]
  }
  oldPasswords: {
    [password: string]: string[]
  }
  breachedPasswords: {
    [password: string]: string[]
  }
}

export async function analyzePasswords(credentials: Credential[]): Promise<SecurityMetrics> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de l\'analyse des mots de passe')
    }

    return await response.json()
  } catch (error) {
    console.error('Erreur lors de l\'analyse des mots de passe:', error)
    throw error
  }
}

export async function getPasswordUsage(passwordId: string): Promise<number> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics/metrcis/name/password_usage_count`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ passwordId }),
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de l\'utilisation du mot de passe')
  }

  const data = await response.json()
  return data.usageCount || 0
}

export async function usePassword(passwordId: string): Promise<void> {
  try {
    const body = {
      passwordId,
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics/use`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de l\'utilisation des mots de passe')
    }

    await response.json()
  } catch (error) {
    console.error('Erreur lors de l\'utilisation des mots de passe:', error)
    throw error
  }
}

