"use client"

import { useState } from "react"
import { Search, Plus, Key, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderTree } from "@/components/folder-tree"
import { PasswordList } from "@/components/password-list"
import { PasswordForm } from "@/components/password-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import useOrganization from "@/hooks/use-organization"

// Types for our data model
export interface FolderItem {
  id: string
  name: string
  parentId: string | null
  shared?: boolean
}

export interface PasswordEntry {
  id: string
  title: string
  website: string
  username: string
  password: string
  strength: "weak" | "medium" | "strong"
  lastUpdated: string
  folderId: string
  tags: string[]
  notes?: string
  customFields?: { label: string; value: string; type: string }[]
  files?: { name: string; size: number; type: string }[]
  breached?: boolean
  reused?: boolean
  old?: boolean
}

const initialPasswords: PasswordEntry[] = [
  {
    id: "1",
    title: "Gmail",
    website: "gmail.com",
    username: "user@example.com",
    password: "••••••••••••",
    strength: "strong",
    lastUpdated: "2023-12-01",
    folderId: "personal",
    tags: ["Important", "Email"],
    notes: "Compte email principal",
    customFields: [{ label: "Téléphone de récupération", value: "+33612345678", type: "text" }],
  },
  {
    id: "2",
    title: "GitHub",
    website: "github.com",
    username: "devuser",
    password: "••••••••",
    strength: "medium",
    lastUpdated: "2023-11-15",
    folderId: "work-dev",
    tags: ["Développement"],
    reused: true,
  },
  {
    id: "3",
    title: "Netflix",
    website: "netflix.com",
    username: "moviefan",
    password: "•••••••••",
    strength: "weak",
    lastUpdated: "2023-10-20",
    folderId: "entertainment",
    tags: ["Streaming", "Partagé"],
    breached: true,
  },
  {
    id: "4",
    title: "Amazon",
    website: "amazon.com",
    username: "shopper123",
    password: "•••••••••••",
    strength: "strong",
    lastUpdated: "2023-09-05",
    folderId: "shopping",
    tags: ["Shopping"],
    old: true,
  },
  {
    id: "5",
    title: "Banque Populaire",
    website: "banquepopulaire.fr",
    username: "client123",
    password: "••••••••••••••",
    strength: "strong",
    lastUpdated: "2023-11-28",
    folderId: "finance-banking",
    tags: ["Banque", "Important"],
    customFields: [
      { label: "Numéro de compte", value: "FR76 1234 5678 9012 3456 7890 123", type: "text" },
      { label: "Code secret", value: "••••", type: "password" },
    ],
  },
  {
    id: "6",
    title: "Projet X",
    website: "projet-x.com",
    username: "team-member",
    password: "•••••••••••",
    strength: "strong",
    lastUpdated: "2023-12-10",
    folderId: "shared-team",
    tags: ["Projet", "Équipe"],
    // shared: true,
  },
]

// const allTags = Array.from(new Set(initialPasswords.flatMap((p) => p.tags)))


export function PasswordManager() {
  const { folders, tags, loadings } = useOrganization()

  const [passwords, setPasswords] = useState<PasswordEntry[]>(initialPasswords)
  // const [folders, setFolders] = useState<FolderItem[]>(initialFolders)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchFilter, setSearchFilter] = useState<"all" | "login" | "website" | "tags">("all")

  // Function to get all child folder IDs recursively
  const getAllChildFolderIds = (folderId: string): string[] => {
    const directChildren = folders.filter((f) => f.parentId === folderId).map((f) => f.id)
    const allChildren = [...directChildren]

    directChildren.forEach((childId) => {
      allChildren.push(...getAllChildFolderIds(childId))
    })

    return allChildren
  }

  // Get the full path of a folder
  const getFolderPath = (folderId: string): string[] => {
    const folder = folders.find((f) => f.id === folderId)
    if (!folder) return []

    if (folder.parentId) {
      return [...getFolderPath(folder.parentId), folder.name]
    }

    return [folder.name]
  }

  // Filter passwords based on search query, selected folder and tags
  const filteredPasswords = passwords.filter((password) => {
    // Search filter
    let matchesSearch = true
    if (searchQuery) {
      switch (searchFilter) {
        case "login":
          matchesSearch = password.username.toLowerCase().includes(searchQuery.toLowerCase())
          break
        case "website":
          matchesSearch =
            password.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
            password.title.toLowerCase().includes(searchQuery.toLowerCase())
          break
        case "tags":
          matchesSearch = password.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          break
        case "all":
        default:
          matchesSearch =
            password.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            password.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
            password.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            password.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      }
    }

    // Folder filter
    let matchesFolder = true
    if (selectedFolderId) {
      const folderIds = [selectedFolderId, ...getAllChildFolderIds(selectedFolderId)]
      matchesFolder = folderIds.includes(password.folderId)
    }

    // Tags filter
    let matchesTags = true
    if (selectedTags.length > 0) {
      matchesTags = selectedTags.every((tag) => password.tags.includes(tag))
    }

    return matchesSearch && matchesFolder && matchesTags
  })

  // Add a new password
  const handleAddPassword = (newPassword: Partial<PasswordEntry>) => {
    const passwordEntry: PasswordEntry = {
      id: (passwords.length + 1).toString(),
      title: newPassword.title || "",
      website: newPassword.website || "",
      username: newPassword.username || "",
      password: newPassword.password || "",
      strength: newPassword.strength || "medium",
      lastUpdated: new Date().toISOString().split("T")[0],
      folderId: newPassword.folderId || "",
      tags: newPassword.tags || [],
      notes: newPassword.notes,
      customFields: newPassword.customFields,
      files: newPassword.files,
    }

    setPasswords([...passwords, passwordEntry])
    setShowAddForm(false)
  }

  // Add a new folder
  const handleAddFolder = (name: string, parentId: string | null) => {
    // const newId = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36)
    // setFolders([...folders, { id: newId, name, parentId }])
  }

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestionnaire de mots de passe</h2>
          <p className="text-muted-foreground">Gérez et organisez vos identifiants en toute sécurité.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau mot de passe
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Dossiers</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-2">
              <ScrollArea className="h-[300px]">
                <FolderTree />
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Tags</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) || true ? "default" : "outline"}
                    className="cursor-pointer"
                    // onClick={() => toggleTag(tag)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{passwords.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <AlertTriangle className="mr-1 h-3 w-3 text-amber-500" />
                    Faibles:
                  </span>
                  <span className="font-medium">{passwords.filter((p) => p.strength === "weak").length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <AlertTriangle className="mr-1 h-3 w-3 text-red-500" />
                    Compromis:
                  </span>
                  <span className="font-medium">{passwords.filter((p) => p.breached).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <Key className="mr-1 h-3 w-3 text-blue-500" />
                    Réutilisés:
                  </span>
                  <span className="font-medium">{passwords.filter((p) => p.reused).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs defaultValue="all" onValueChange={(v) => setSearchFilter(v as any)}>
                <TabsList className="h-9">
                  <TabsTrigger value="all" className="text-xs px-2">
                    Tout
                  </TabsTrigger>
                  <TabsTrigger value="login" className="text-xs px-2">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="website" className="text-xs px-2">
                    Site
                  </TabsTrigger>
                  <TabsTrigger value="tags" className="text-xs px-2">
                    Tags
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {selectedFolderId && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {getFolderPath(selectedFolderId).map((part, i, arr) => (
                  <span key={i} className="flex items-center">
                    {part}
                    {i < arr.length - 1 && <span className="mx-1">/</span>}
                  </span>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFolderId(null)}>
                Effacer le filtre
              </Button>
            </div>
          )}

          {selectedTags.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground mr-2">Tags:</span>
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <span className="sr-only">Remove {tag}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </Badge>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
                Effacer les tags
              </Button>
            </div>
          )}

          {showAddForm ? (
            <PasswordForm
              onAddPassword={handleAddPassword}
              folders={folders}
              onAddFolder={handleAddFolder}
              onCancel={() => setShowAddForm(false)}
              allTags={tags.map((tag) => tag.name)}
            />
          ) : (
            <PasswordList passwords={filteredPasswords} folders={folders} />
          )}
        </div>
      </div>
    </div>
  )
}
