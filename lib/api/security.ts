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
  // Récupérer les métriques d'analyse
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{
      id: passwordId,
      password: 'dummy-password', // Le mot de passe n'est pas utilisé pour le comptage
      lastUpdated: new Date().toISOString().split('T')[0]
    }])
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de l\'utilisation du mot de passe')
  }

  const data = await response.json()
  // Le nombre d'utilisations est stocké dans les métriques de réutilisation
  const reusedCount = Object.values(data.reusedPasswords || {}).flat().length
  return reusedCount
}

export async function usePassword(passwordId: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        id: passwordId,
        password: 'dummy-password', // Le mot de passe n'est pas utilisé pour le comptage
        lastUpdated: new Date().toISOString().split('T')[0]
      }])
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

