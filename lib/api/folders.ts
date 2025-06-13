import { Folder, GetFoldersResponse, PostFolderRequest, PostFolderResponse } from '@/types/folder'

export async function getFolders(userId?: string, page?: number, limit?: number): Promise<Folder[]> {
  const baseUrl = process.env.NEXT_PUBLIC_ORGANIZATION_URL || 'http://localhost:8000'
  const url = new URL(`${baseUrl}/folders`)
  if (userId) url.searchParams.append('user_id', userId)
  if (page) url.searchParams.append('page', String(page))
  if (limit) url.searchParams.append('limit', String(limit))

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null,
    })
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des dossiers')
    }

    const data: GetFoldersResponse = await response.json()

    return data.folders.map(folder => ({
      id: folder.Id,
      name: folder.Name,
      description: folder.Description || null,
      icon: folder.Icon || null,
      parentId: folder.ParentID || null,
      createdBy: folder.CreatedBy || undefined,
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des dossiers:', error)
    throw error
  }
}

export async function createFolder(data: PostFolderRequest): Promise<Folder> {
  const baseUrl = process.env.NEXT_PUBLIC_ORGANIZATION_URL || 'http://localhost:3001'
  const response = await fetch(`${baseUrl}/folders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la création du dossier')
  }

  const responseData: PostFolderResponse = await response.json()

  return {
    id: responseData.Id,
    name: responseData.Name,
    description: responseData.Description || null,
    icon: responseData.Icon || null,
    parentId: responseData.ParentID || null,
    createdBy: responseData.CreatedBy || undefined,
  }
}

export async function updateFolder(id: string, data: Partial<Folder>): Promise<Folder> {
  const baseUrl = process.env.NEXT_PUBLIC_ORGANIZATION_URL || 'http://localhost:3001'
  const response = await fetch(`${baseUrl}/folders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour du dossier')
  }
  return await response.json()
}

export async function deleteFolder(id: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_ORGANIZATION_URL || 'http://localhost:3001'
  const response = await fetch(`${baseUrl}/folders/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression du dossier')
  }
}