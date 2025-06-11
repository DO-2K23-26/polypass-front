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