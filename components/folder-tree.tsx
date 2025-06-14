"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { FolderItem } from "@/components/password-manager"

interface FolderTreeProps {
  folders: FolderItem[]
  selectedFolderId: string | null
  onSelectFolder: (folderId: string | null) => void
  onAddFolder: (name: string, parentId: string | null) => void
  className?: string
}

export function FolderTree({ folders, selectedFolderId, onSelectFolder, onAddFolder, className }: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState("")

  // Get root level folders
  const rootFolders = folders.filter((folder) => folder.parentId === null)

  const toggleExpand = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim(), newFolderParentId)
      setNewFolderName("")
      setNewFolderParentId(null)
    }
  }

  const renderFolder = (folder: FolderItem, level = 0) => {
    const isExpanded = expandedFolders[folder.id]
    const isSelected = selectedFolderId === folder.id
    const childFolders = folders.filter((f) => f.parentId === folder.id)
    const hasChildren = childFolders.length > 0

    return (
      <div key={folder.id} className="select-none">
        <div
          className={cn(
            "group flex items-center py-1 px-2 rounded-md text-sm transition-colors",
            isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            level > 0 && "ml-4",
          )}
        >
          <button
            type="button"
            onClick={() => toggleExpand(folder.id)}
            className={cn("mr-1 h-4 w-4 flex items-center justify-center", !hasChildren && "invisible")}
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
          <button type="button" className="flex items-center gap-2 flex-1" onClick={() => onSelectFolder(folder.id)}>
            {folder.shared ? (
              <Users className="h-4 w-4 text-blue-500" />
            ) : isExpanded ? (
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Folder className="h-4 w-4 text-muted-foreground" />
            )}
            <span>{folder.name}</span>
          </button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
            onClick={() => setNewFolderParentId(folder.id)}
          >
            <Plus className="h-3 w-3" />
            <span className="sr-only">Ajouter un sous-dossier</span>
          </Button>
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1">{childFolders.map((childFolder) => renderFolder(childFolder, level + 1))}</div>
        )}

        {newFolderParentId === folder.id && (
          <div className="flex items-center gap-2 mt-1 ml-8">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nom du dossier"
              className="h-7 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddFolder()
                if (e.key === "Escape") setNewFolderParentId(null)
              }}
            />
            <Button type="button" variant="outline" size="sm" className="h-7" onClick={handleAddFolder}>
              Ajouter
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7" onClick={() => setNewFolderParentId(null)}>
              Annuler
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-1", className)}>
      <button
        type="button"
        className={cn(
          "flex items-center gap-2 w-full py-1 px-2 rounded-md text-sm transition-colors",
          selectedFolderId === null ? "bg-primary text-primary-foreground" : "hover:bg-muted",
        )}
        onClick={() => onSelectFolder(null)}
      >
        <Folder className="h-4 w-4 text-muted-foreground" />
        <span>Tous les mots de passe</span>
      </button>

      {rootFolders.map((folder) => renderFolder(folder))}

      {newFolderParentId === null && (
        <div className="flex items-center gap-2 mt-2">
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Nouveau dossier"
            className="h-7 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddFolder()
              if (e.key === "Escape") setNewFolderName("")
            }}
          />
          <Button type="button" variant="outline" size="sm" className="h-7" onClick={handleAddFolder}>
            Ajouter
          </Button>
        </div>
      )}
    </div>
  )
}
