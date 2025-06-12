import { GetTagsResponse, PostTagRequest, Tag } from '@/types/tag'

export async function getTags(): Promise<Tag[]> {
  const baseUrl = process.env.NEXT_PUBLIC_ORGANIZATION_URL || 'http://localhost:3001'
  
  try {
    const response = await fetch(`${baseUrl}/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null
    })
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des tags')
    }

    const data: GetTagsResponse[] = await response.json()

    return data.map(tag => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      folderId: tag.folder_id,
      createdBy: tag.created_by,
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des tags:', error)
    throw error
  }
}

export async function createTag(data: PostTagRequest): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_ORGANIZATION_URL || 'http://localhost:3001'
  
  try {
    const response = await fetch(`${baseUrl}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la création du tag')
    }
    
  } catch (error) {
    console.error('Erreur lors de la création du tag:', error)
    throw error
  }
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