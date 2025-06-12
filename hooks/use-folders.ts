import { useState, useEffect } from 'react'
import type { Folder } from '@/types/folder'

export function useFolders(userId: string) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchFolders() {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/folders`)
        url.searchParams.append('user_id', userId)
        const res = await fetch(url.toString(), { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des dossiers')
        }
        const data = await res.json()
        const mapped = data.folders.map((f: any) => ({
          id: f.Id,
          name: f.Name,
          parentId: f.ParentID,
        }))
        setFolders(mapped)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFolders()
  }, [userId])

  return { folders, isLoading }
}
