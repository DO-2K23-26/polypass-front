import { useState, useEffect } from 'react'
import type { Tag } from '@/types/tag'

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des tags')
        }
        const data = await res.json()
        const mapped = data.map((t: any) => ({
          id: t.id,
          name: t.name,
          color: t.color,
          folderId: t.folder_id,
          createdBy: t.created_by,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
        }))
        setTags(mapped)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTags()
  }, [])

  return { tags, isLoading }
}
