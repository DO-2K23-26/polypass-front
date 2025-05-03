/**
 * Utilitaires pour le chiffrement/déchiffrement côté client
 * Utilise l'API Web Crypto pour un chiffrement AES-GCM
 */

// Dérive une clé à partir d'un mot de passe
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  // Convertir le mot de passe en buffer
  const passwordBuffer = new TextEncoder().encode(password)

  // Importer le mot de passe comme clé brute
  const passwordKey = await window.crypto.subtle.importKey('raw', passwordBuffer, { name: 'PBKDF2' }, false, ['deriveKey'])

  // Dériver une clé AES-GCM à partir du mot de passe
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

// Chiffre un objet JSON avec un mot de passe
export async function encryptData(data: Record<string, string>, password: string): Promise<string> {
  // Générer un vecteur d'initialisation (IV) et un sel aléatoires
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const salt = window.crypto.getRandomValues(new Uint8Array(16))

  // Dériver une clé à partir du mot de passe et du sel
  const key = await deriveKey(password, salt)

  // Convertir les données en buffer
  const dataBuffer = new TextEncoder().encode(JSON.stringify(data))

  // Chiffrer les données
  const encryptedBuffer = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, dataBuffer)

  // Concaténer le sel, l'IV et les données chiffrées
  const result = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength)
  result.set(salt, 0)
  result.set(iv, salt.length)
  result.set(new Uint8Array(encryptedBuffer), salt.length + iv.length)

  // Convertir en base64 pour le stockage/transmission
  return btoa(String.fromCharCode(...result))
}

// Déchiffre des données avec un mot de passe
export async function decryptData(encryptedData: string, password: string): Promise<Record<string, string>> {
  try {
    // Convertir de base64 à Uint8Array
    const data = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map((char) => char.charCodeAt(0))
    )

    // Extraire le sel, l'IV et les données chiffrées
    const salt = data.slice(0, 16)
    const iv = data.slice(16, 28)
    const encryptedBuffer = data.slice(28)

    // Dériver la clé à partir du mot de passe et du sel
    const key = await deriveKey(password, salt)

    // Déchiffrer les données
    const decryptedBuffer = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedBuffer)

    // Convertir le buffer en chaîne JSON puis en objet
    const decryptedText = new TextDecoder().decode(decryptedBuffer)
    return JSON.parse(decryptedText)
  } catch (error) {
    console.error('Erreur lors du déchiffrement:', error)
    throw new Error('Mot de passe incorrect ou données corrompues')
  }
}

// Vérifie si l'API Web Crypto est disponible
export function isCryptoAvailable(): boolean {
  return typeof window !== 'undefined' && window.crypto && window.crypto.subtle && typeof window.crypto.subtle.encrypt === 'function'
}
