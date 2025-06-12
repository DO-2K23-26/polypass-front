import { Tag } from '@/types/tag'

export async function getTags(): Promise<Tag[]> {
  const baseUrl = process.env.NEXT_PUBLIC_ORGANIZATION_URL || 'http://localhost:3001'
  const response = await fetch(`${baseUrl}/tags`)
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des tags')
  }
  return await response.json()
}

export async function createTag(data: Partial<Tag>): Promise<Tag> {
  const baseUrl = process.env.NEXT_PUBLIC_ORGANIZATION_URL || 'http://localhost:3001'
  const response = await fetch(`${baseUrl}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Erreur lors de la création du tag')
  }
  return await response.json()
}

export async function updateTag(id: string, data: Partial<Tag>): Promise<Tag> {
  const baseUrl = process.env.NEXT_PUBLIC_ORGANIZATION_URL || 'http://localhost:3001'
  const response = await fetch(`${baseUrl}/tags/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour du tag')
  }
  return await response.json()
}

export async function deleteTag(id: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_ORGANIZATION_URL || 'http://localhost:3001'
  const response = await fetch(`${baseUrl}/tags/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression du tag')
  }
}