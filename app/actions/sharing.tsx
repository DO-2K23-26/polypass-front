'use server'

import { apiClient } from '@/lib/api-client'

// Types pour l'API
export interface PostSecretRequest {
  content: Record<string, string>
  expiration: number
  is_encrypted: boolean
  is_one_time_use: boolean
}

export interface PostSecretResponse {
  id: string
  created_at: number
}

export interface GetSecretResponse {
  id: string
  is_encrypted: boolean
  content: Record<string, string>
}

export interface HistorySecret {
  id: string
  created_at: number
  expiration: number
  content_size: number
  is_one_time_use: boolean
  name: string
}

// Créer un nouveau secret
export async function createSecret(request: PostSecretRequest): Promise<PostSecretResponse> {
  const apiUrl = process.env.SHARING_API

  if (!apiUrl) {
    console.error("Variable d'environnement SHARING_API non définie")
    throw new Error('Configuration API manquante')
  }

  console.log('Appel API vers:', apiUrl)
  console.log('Données envoyées:', JSON.stringify(request, null, 2))

  try {
    const response = await apiClient.fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erreur API:', response.status, errorText)
      throw new Error(`Erreur lors de la création du secret: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    throw new Error('Impossible de communiquer avec le serveur de partage')
  }
}

// Récupérer un secret
export async function getSecret(id: string): Promise<GetSecretResponse> {
  const apiUrl = process.env.SHARING_API

  if (!apiUrl) {
    console.error("Variable d'environnement SHARING_API non définie")
    throw new Error('Configuration API manquante')
  }

  console.log(`Récupération du secret ${id} depuis ${apiUrl}/${id}`)

  try {
    const response = await apiClient.fetch(`${apiUrl}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Ce lien a expiré ou n'existe pas.")
      }
      const errorText = await response.text()
      console.error('Erreur API:', response.status, errorText)
      throw new Error(`Erreur lors de la récupération du secret: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Impossible de communiquer avec le serveur de partage')
  }
}

// Déchiffrer un secret protégé par mot de passe
export async function decryptSecret(id: string, passphrase: string): Promise<GetSecretResponse> {
  const apiUrl = process.env.SHARING_API

  if (!apiUrl) {
    console.error("Variable d'environnement SHARING_API non définie")
    throw new Error('Configuration API manquante')
  }

  console.log(`Déchiffrement du secret ${id}`)

  try {
    const response = await apiClient.fetch(`${apiUrl}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ passphrase }),
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Mot de passe incorrect')
      }
      const errorText = await response.text()
      console.error('Erreur API:', response.status, errorText)
      throw new Error(`Erreur lors du déchiffrement: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Impossible de communiquer avec le serveur de partage')
  }
}

// Récupérer l'historique des secrets
export async function getHistory(): Promise<HistorySecret[]> {
  const apiUrl = process.env.SHARING_API

  if (!apiUrl) {
    console.error("Variable d'environnement SHARING_API non définie")
    throw new Error('Configuration API manquante')
  }

  console.log(`Récupération de l'historique depuis ${apiUrl}/history`)

  try {
    const response = await apiClient.fetch(`${apiUrl}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erreur API:', response.status, errorText)
      throw new Error(`Erreur lors de la récupération de l'historique: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Impossible de communiquer avec le serveur de partage')
  }
}
