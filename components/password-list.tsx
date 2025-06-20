"use client"

import { useState } from "react"
import { Copy, Eye, EyeOff, MoreHorizontal, FileText, AlertTriangle, RefreshCw, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { FolderItem, PasswordEntry } from "@/components/password-manager"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface PasswordListProps {
  passwords: PasswordEntry[]
  folders: FolderItem[]
}

export function PasswordList({ passwords, folders }: PasswordListProps) {
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({})
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)

  const togglePasswordVisibility = (id: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
      case "weak":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
    }
  }

  // Get folder name by ID
  const getFolderName = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId)
    return folder ? folder.name : ""
  }

  // Get folder path
  const getFolderPath = (folderId: string): string => {
    const folder = folders.find((f) => f.id === folderId)
    if (!folder) return ""

    if (folder.parentId) {
      const parentPath = getFolderPath(folder.parentId)
      return parentPath ? `${parentPath} / ${folder.name}` : folder.name
    }

    return folder.name
  }

  if (passwords.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Aucun mot de passe trouvé.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {passwords.map((password) => (
          <Card
            key={password.id}
            className={cn(
              "overflow-hidden",
              password.breached && "border-red-200",
              password.reused && "border-blue-200",
              password.old && "border-amber-200",
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {password.title}
                    {password.breached && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Identifiants compromis</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {password.reused && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <RefreshCw className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mot de passe réutilisé</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </CardTitle>
                  <CardDescription>{password.username}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => copyToClipboard(password.username)}>
                      Copier l'identifiant
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyToClipboard(password.password)}>
                      Copier le mot de passe
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedPassword(password)
                      }}
                    >
                      Voir les détails
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedPassword(password)
                        setShowShareDialog(true)
                      }}
                    >
                      Partager
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                <Badge variant="outline" className="bg-muted/50 text-xs" title={getFolderPath(password.folderId)}>
                  {getFolderName(password.folderId)}
                </Badge>
                {password.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {password.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{password.tags.length - 2}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Mot de passe:</span>
                    <span className="text-sm">
                      {revealedPasswords[password.id] ? "ExamplePass123" : password.password}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => togglePasswordVisibility(password.id)}
                    >
                      {revealedPasswords[password.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">
                        {revealedPasswords[password.id] ? "Masquer" : "Afficher"} le mot de passe
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard("ExamplePass123")}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copier le mot de passe</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Mis à jour: {password.lastUpdated}</span>
                  <Badge variant="outline" className={getStrengthColor(password.strength)}>
                    {password.strength === "strong" ? "Fort" : password.strength === "medium" ? "Moyen" : "Faible"}
                  </Badge>
                </div>
                {password.notes && (
                  <div className="pt-2 flex items-center text-xs text-muted-foreground">
                    <FileText className="h-3 w-3 mr-1" />
                    Notes
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Password Details Dialog */}
      <Dialog
        open={!!selectedPassword && !showShareDialog}
        onOpenChange={(open) => {
          if (!open) setSelectedPassword(null)
        }}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{selectedPassword?.title}</DialogTitle>
            <DialogDescription>{selectedPassword?.website}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="files">Fichiers</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Identifiant
                  </Label>
                  <div className="col-span-3 flex">
                    <Input id="username" value={selectedPassword?.username} readOnly className="flex-1" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => selectedPassword && copyToClipboard(selectedPassword.username)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Mot de passe
                  </Label>
                  <div className="col-span-3 flex">
                    <Input
                      id="password"
                      type={revealedPasswords[selectedPassword?.id || ""] ? "text" : "password"}
                      value="ExamplePass123"
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => selectedPassword && togglePasswordVisibility(selectedPassword.id)}
                    >
                      {revealedPasswords[selectedPassword?.id || ""] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => copyToClipboard("ExamplePass123")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedPassword?.customFields?.map((field, index) => (
                  <div key={index} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={`custom-${index}`} className="text-right">
                      {field.label}
                    </Label>
                    <div className="col-span-3 flex">
                      <Input
                        id={`custom-${index}`}
                        type={field.type === "password" ? "password" : "text"}
                        value={field.value}
                        readOnly
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon" className="ml-2" onClick={() => copyToClipboard(field.value)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Dossier</Label>
                  <div className="col-span-3">
                    <Badge variant="outline" className="bg-muted/50">
                      {selectedPassword && getFolderPath(selectedPassword.folderId)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Tags</Label>
                  <div className="col-span-3 flex flex-wrap gap-1">
                    {selectedPassword?.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="notes" className="space-y-4 pt-4">
              {selectedPassword?.notes ? (
                <Textarea readOnly value={selectedPassword.notes} className="min-h-[200px]" />
              ) : (
                <p className="text-center text-muted-foreground py-8">Aucune note pour cette entrée.</p>
              )}
            </TabsContent>
            <TabsContent value="files" className="space-y-4 pt-4">
              {selectedPassword?.files && selectedPassword.files.length > 0 ? (
                <div className="space-y-2">
                  {selectedPassword.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{file.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Aucun fichier attaché à cette entrée.</p>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between items-center">
            <div className="flex items-center">
              <Badge variant="outline" className={getStrengthColor(selectedPassword?.strength || "medium")}>
                {selectedPassword?.strength === "strong"
                  ? "Fort"
                  : selectedPassword?.strength === "medium"
                    ? "Moyen"
                    : "Faible"}
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">Mis à jour: {selectedPassword?.lastUpdated}</span>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setShowShareDialog(true)
              }}
            >
              <Link2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={showShareDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowShareDialog(false)
            if (!selectedPassword) setSelectedPassword(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Partager {selectedPassword?.title}</DialogTitle>
            <DialogDescription>
              Créez un lien à usage unique pour partager cette entrée en toute sécurité.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expiration">Date d'expiration</Label>
              <Input type="date" id="expiration" min={new Date().toISOString().split("T")[0]} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passphrase">Phrase secrète (optionnel)</Label>
              <Input type="text" id="passphrase" placeholder="Phrase secrète pour accéder au contenu" />
              <p className="text-xs text-muted-foreground">
                Le destinataire devra saisir cette phrase pour accéder au contenu partagé.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Options de partage</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="share-username" className="rounded border-gray-300" />
                <Label htmlFor="share-username" className="text-sm font-normal">
                  Partager l'identifiant
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="share-password" className="rounded border-gray-300" />
                <Label htmlFor="share-password" className="text-sm font-normal">
                  Partager le mot de passe
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="share-notes" className="rounded border-gray-300" />
                <Label htmlFor="share-notes" className="text-sm font-normal">
                  Partager les notes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="share-files" className="rounded border-gray-300" />
                <Label htmlFor="share-files" className="text-sm font-normal">
                  Partager les fichiers
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Annuler
            </Button>
            <Button>Créer un lien de partage</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Helper function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
