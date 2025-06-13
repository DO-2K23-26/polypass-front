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
