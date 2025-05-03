"use client"

import { useState } from "react"
import { Link2, Clock, Users, Shield, Copy, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SharingCenter() {
  const [activeTab, setActiveTab] = useState("shared-links")
  const [showCreateLinkDialog, setShowCreateLinkDialog] = useState(false)
  const [showShareFolderDialog, setShowShareFolderDialog] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const sharedLinks = [
    {
      id: "1",
      title: "Accès Netflix",
      created: "2023-12-10",
      expires: "2023-12-17",
      views: 2,
      maxViews: 5,
      url: "https://securevault.example/share/abc123",
      hasPassphrase: true,
    },
    {
      id: "2",
      title: "Wifi Invités",
      created: "2023-12-05",
      expires: "2024-01-05",
      views: 0,
      maxViews: null,
      url: "https://securevault.example/share/def456",
      hasPassphrase: false,
    },
    {
      id: "3",
      title: "Accès Serveur",
      created: "2023-11-28",
      expires: "2023-12-28",
      views: 3,
      maxViews: 3,
      url: "https://securevault.example/share/ghi789",
      hasPassphrase: true,
      expired: true,
    },
  ]

  const sharedFolders = [
    {
      id: "1",
      name: "Équipe Marketing",
      shared: "2023-11-15",
      members: 4,
      itemCount: 12,
      owner: true,
    },
    {
      id: "2",
      name: "Projet X",
      shared: "2023-12-01",
      members: 7,
      itemCount: 8,
      owner: false,
    },
    {
      id: "3",
      name: "Accès Clients",
      shared: "2023-10-20",
      members: 3,
      itemCount: 5,
      owner: true,
    },
  ]

  const folderMembers = [
    { id: "1", name: "Marie Dupont", email: "marie@example.com", role: "admin", avatar: "/placeholder.svg" },
    { id: "2", name: "Jean Martin", email: "jean@example.com", role: "write", avatar: "/placeholder.svg" },
    { id: "3", name: "Sophie Bernard", email: "sophie@example.com", role: "read", avatar: "/placeholder.svg" },
    { id: "4", name: "Thomas Petit", email: "thomas@example.com", role: "read", avatar: "/placeholder.svg" },
  ]

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Centre de partage</h2>
        <p className="text-muted-foreground">Gérez vos liens de partage et dossiers partagés.</p>
      </div>

      <Tabs defaultValue="shared-links" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="shared-links">Liens partagés</TabsTrigger>
            <TabsTrigger value="shared-folders">Dossiers partagés</TabsTrigger>
          </TabsList>

          {activeTab === "shared-links" ? (
            <Button onClick={() => setShowCreateLinkDialog(true)}>
              <Link2 className="mr-2 h-4 w-4" />
              Créer un lien
            </Button>
          ) : (
            <Button onClick={() => setShowShareFolderDialog(true)}>
              <Users className="mr-2 h-4 w-4" />
              Partager un dossier
            </Button>
          )}
        </div>

        <TabsContent value="shared-links" className="space-y-4 mt-6">
          {sharedLinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
              <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucun lien partagé</h3>
              <p className="text-muted-foreground mt-1 mb-4">Vous n'avez pas encore créé de liens de partage.</p>
              <Button onClick={() => setShowCreateLinkDialog(true)}>Créer un lien</Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {sharedLinks.map((link) => (
                <Card key={link.id} className={link.expired ? "border-muted" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{link.title}</CardTitle>
                        <CardDescription>Créé le {link.created}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {link.hasPassphrase && (
                          <Badge variant="outline">
                            <Shield className="mr-1 h-3 w-3" />
                            Protégé
                          </Badge>
                        )}
                        {link.expired ? (
                          <Badge variant="outline" className="text-muted-foreground">
                            Expiré
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Actif
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Expire le {link.expires}</span>
                        </div>
                        <div className="text-sm">
                          {link.views} {link.maxViews ? `/ ${link.maxViews}` : ""} vues
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input value={link.url} readOnly className="text-xs font-mono" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(link.url, link.id)}
                          className="flex-shrink-0"
                        >
                          {copied === link.id ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Révoquer
                    </Button>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared-folders" className="space-y-4 mt-6">
          {sharedFolders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucun dossier partagé</h3>
              <p className="text-muted-foreground mt-1 mb-4">Vous n'avez pas encore partagé de dossiers.</p>
              <Button onClick={() => setShowShareFolderDialog(true)}>Partager un dossier</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sharedFolders.map((folder) => (
                <Card key={folder.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{folder.name}</CardTitle>
                      {folder.owner ? (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          Propriétaire
                        </Badge>
                      ) : (
                        <Badge variant="outline">Membre</Badge>
                      )}
                    </div>
                    <CardDescription>Partagé depuis le {folder.shared}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{folder.members} membres</span>
                        </div>
                        <div className="text-sm">{folder.itemCount} éléments</div>
                      </div>

                      <div className="flex -space-x-2">
                        {Array.from({ length: Math.min(folder.members, 4) }).map((_, i) => (
                          <Avatar key={i} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>U{i + 1}</AvatarFallback>
                          </Avatar>
                        ))}
                        {folder.members > 4 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                            +{folder.members - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm">
                      Voir les détails
                    </Button>
                    {folder.owner && (
                      <Button variant="outline" size="sm">
                        Gérer l'accès
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Share Link Dialog */}
      <Dialog open={showCreateLinkDialog} onOpenChange={setShowCreateLinkDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Créer un lien de partage</DialogTitle>
            <DialogDescription>
              Partagez un mot de passe de façon sécurisée avec un lien à usage unique.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password-entry">Élément à partager</Label>
              <Select>
                <SelectTrigger id="password-entry">
                  <SelectValue placeholder="Sélectionner un élément" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="netflix">Netflix</SelectItem>
                  <SelectItem value="gmail">Gmail</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link-name">Nom du lien</Label>
              <Input id="link-name" placeholder="Ex: Accès Netflix pour la famille" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiration">Date d'expiration</Label>
              <Input type="date" id="expiration" min={new Date().toISOString().split("T")[0]} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-views">Nombre maximum de vues (optionnel)</Label>
              <Input type="number" id="max-views" min="1" placeholder="Illimité si vide" />
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
                <input type="checkbox" id="share-username" className="rounded border-gray-300" defaultChecked />
                <Label htmlFor="share-username" className="text-sm font-normal">
                  Partager l'identifiant
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="share-password" className="rounded border-gray-300" defaultChecked />
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
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateLinkDialog(false)}>
              Annuler
            </Button>
            <Button>Créer le lien</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Folder Dialog */}
      <Dialog open={showShareFolderDialog} onOpenChange={setShowShareFolderDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Partager un dossier</DialogTitle>
            <DialogDescription>Invitez des utilisateurs à accéder à un dossier de mots de passe.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder">Dossier à partager</Label>
              <Select>
                <SelectTrigger id="folder">
                  <SelectValue placeholder="Sélectionner un dossier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personnel</SelectItem>
                  <SelectItem value="work">Travail</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="entertainment">Divertissement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="flex gap-2">
                <Input id="email" type="email" placeholder="utilisateur@example.com" className="flex-1" />
                <Select defaultValue="read">
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Permissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Lecture</SelectItem>
                    <SelectItem value="write">Écriture</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Ajouter un utilisateur
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Membres actuels</Label>
              <div className="border rounded-md divide-y">
                {folderMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue={member.role}>
                        <SelectTrigger className="h-8 w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="read">Lecture</SelectItem>
                          <SelectItem value="write">Écriture</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareFolderDialog(false)}>
              Annuler
            </Button>
            <Button>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Import missing component
import { Trash2 } from "lucide-react"
