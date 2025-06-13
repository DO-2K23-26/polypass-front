'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types pour OIDC
interface OIDCTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

interface AuthState {
  accessToken: string | null
  nickname: string | null
  isAuthenticated: boolean
  setTokens: (tokens: OIDCTokens) => void
  setNickname: (nickname: string) => void
  clearTokens: () => void
  refreshAccessToken: () => Promise<boolean>
}

// Store Zustand pour l'état d'authentification
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      isAuthenticated: false,
      nickname: null,

      setTokens: (tokens: OIDCTokens) => {
        // Stocker l'access token dans le state
        set({
          accessToken: tokens.access_token,
          isAuthenticated: true,
        })

        // Stocker le refresh token dans le localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('refresh_token', tokens.refresh_token)
        }
      },

      setNickname: (nickname: string) => {
        set({ nickname })
      },

      clearTokens: () => {
        set({ accessToken: null, isAuthenticated: false })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('refresh_token')
        }
      },

      refreshAccessToken: async (): Promise<boolean> => {
        try {
          const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null

          if (!refreshToken) {
            get().clearTokens()
            return false
          }

          const oidcUrl = process.env.NEXT_PUBLIC_OIDC_PROVIDER_URL
          const clientId = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID

          if (!oidcUrl || !clientId) {
            console.error('Configuration OIDC manquante')
            return false
          }

          const tokenEndpoint = `${oidcUrl}/realms/master/protocol/openid-connect/token`

          const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
              client_id: clientId,
            }),
          })

          if (!response.ok) {
            console.error('Erreur lors du refresh token:', response.status)
            get().clearTokens()
            return false
          }

          const tokens: OIDCTokens = await response.json()
          get().setTokens(tokens)
          return true
        } catch (error) {
          console.error('Erreur lors du refresh token:', error)
          get().clearTokens()
          return false
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Ne persister que l'état d'authentification, pas l'access token
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Fonction pour initier la connexion OIDC
export const initiateOIDCLogin = () => {
  const oidcUrl = process.env.NEXT_PUBLIC_OIDC_PROVIDER_URL
  const clientId = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI

  if (!oidcUrl || !clientId || !redirectUri) {
    console.error('Configuration OIDC manquante')
    return
  }

  // Générer un state pour la sécurité
  const state = crypto.randomUUID()
  sessionStorage.setItem('oidc_state', state)

  // Générer un code verifier pour PKCE (optionnel mais recommandé)
  const codeVerifier = crypto.randomUUID() + crypto.randomUUID()
  sessionStorage.setItem('oidc_code_verifier', codeVerifier)

  // Créer le code challenge
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  crypto.subtle.digest('SHA-256', data).then((hash) => {
    const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    const authUrl = new URL(`${oidcUrl}/realms/master/protocol/openid-connect/auth`)
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', 'openid profile email')
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('code_challenge', codeChallenge)
    authUrl.searchParams.set('code_challenge_method', 'S256')

    window.location.href = authUrl.toString()
  })
}

// Fonction pour échanger le code d'autorisation contre des tokens
export const exchangeCodeForTokens = async (code: string, state: string): Promise<boolean> => {
  try {
    // Vérifier le state
    const storedState = sessionStorage.getItem('oidc_state')
    if (state !== storedState) {
      console.error('State OIDC invalide')
      return false
    }

    const oidcUrl = process.env.NEXT_PUBLIC_OIDC_PROVIDER_URL
    const clientId = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI
    const codeVerifier = sessionStorage.getItem('oidc_code_verifier')

    if (!oidcUrl || !clientId || !redirectUri || !codeVerifier) {
      console.error('Configuration OIDC manquante')
      return false
    }

    const tokenEndpoint = `${oidcUrl}/realms/master/protocol/openid-connect/token`

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      }),
    })

    if (!response.ok) {
      console.error("Erreur lors de l'échange du code:", response.status)
      return false
    }

    const tokens: OIDCTokens = await response.json()
    useAuthStore.getState().setTokens(tokens)

    const userinfoEndpoint = `${oidcUrl}/realms/master/protocol/openid-connect/userinfo`
    const userinfoResponse = await fetch(userinfoEndpoint, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })
    if (userinfoResponse.ok) {
      const userinfo = await userinfoResponse.json()
      if (userinfo.preferred_username) {
        useAuthStore.getState().setNickname(userinfo.preferred_username)
      }
    } else {
      console.warn('Impossible de récupérer le userinfo:', userinfoResponse.status)
    }

    
    // Nettoyer le sessionStorage
    sessionStorage.removeItem('oidc_state')
    sessionStorage.removeItem('oidc_code_verifier')

    return true
  } catch (error) {
    console.error("Erreur lors de l'échange du code:", error)
    return false
  }
}

// Fonction pour déconnecter l'utilisateur
export const logout = () => {
  const oidcUrl = process.env.NEXT_PUBLIC_OIDC_PROVIDER_URL
  const clientId = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI

  useAuthStore.getState().clearTokens()

  if (oidcUrl && clientId && redirectUri) {
    const logoutUrl = new URL(`${oidcUrl}/realms/master/protocol/openid-connect/logout`)
    logoutUrl.searchParams.set('client_id', clientId)
    logoutUrl.searchParams.set('post_logout_redirect_uri', redirectUri)

    window.location.href = logoutUrl.toString()
  } else {
    window.location.href = '/'
  }
}
