'use client'

import { useAuthStore } from './auth'

// Client API avec gestion automatique des tokens
export class ApiClient {
  private static instance: ApiClient

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const { accessToken, refreshAccessToken, clearTokens } = useAuthStore.getState()

    // Ajouter l'access token comme Bearer token
    const headers = {
      ...options.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Si 403, essayer de refresh le token
    if (response.status === 403 && accessToken) {
      console.log('Token expiré, tentative de refresh...')
      const refreshSuccess = await refreshAccessToken()

      if (refreshSuccess) {
        // Retry la requête avec le nouveau token
        const newAccessToken = useAuthStore.getState().accessToken
        const retryHeaders = {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        }

        return fetch(url, {
          ...options,
          headers: retryHeaders,
        })
      } else {
        // Refresh failed, redirect to login
        clearTokens()
        window.location.href = '/'
        throw new Error('Session expirée, redirection vers la connexion')
      }
    }

    return response
  }
}

// Instance singleton
export const apiClient = ApiClient.getInstance()
