"use client"

import { useState } from "react"
import { Users, UserPlus, UserMinus, Activity, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AdminPanel() {
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)

  const users = [
    {
      id: "1",
      name: "Marie Dupont",
      email: "marie@example.com",
      role: "admin",
      status: "active",
      lastActive: "Aujourd'hui",
      avatar: "/placeholder.svg",
    },
    {
      id: "2",
      name: "Jean Martin",
      email: "jean@example.com",
      role: "user",
      status: "active",
      lastActive: "Hier",
      avatar: "/placeholder.svg",
    },
    {
      id: "3",
      name: "Sophie Bernard",
      email: "sophie@example.com",
      role: "user",
      status: "active",
      lastActive: "Il y a 3 jours",
      avatar: "/placeholder.svg",
    },
    {
      id: "4",
      name: "Thomas Petit",
      email: "thomas@example.com",
      role: "user",
      status: "inactive",
      lastActive: "Il y a 2 semaines",
      avatar: "/placeholder.svg",
    },
  ]

  const activityData = [
    { date: "2023-12-15", logins: 12, passwords: 5, shares: 2 },
    { date: "2023-12-14", logins: 8, passwords: 3, shares: 1 },
    { date: "2023-12-13", logins: 15, passwords: 7, shares: 3 },
    { date: "2023-12-12", logins: 10, passwords: 2, shares: 0 },
    { date: "2023-12-11", logins: 9, passwords: 4, shares: 2 },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Administration</h2>
        <p className="text-muted-foreground">Gérez les utilisateurs et consultez les statistiques d'utilisation.</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Input placeholder="Rechercher un utilisateur..." className="w-[300px]" />
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowAddUserDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>{users.length} utilisateurs au total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md divide-y">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {user.name}
                          {user.role === "admin" && (
                            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-right w-32">
                        <div className="flex items-center justify-end">
                          <span
                            className={`mr-2 h-2 w-2 rounded-full ${user.status === "active" ? "bg-green-500" : "bg-gray-300"}`}
                          />
                          <span>{user.status === "active" ? "Actif" : "Inactif"}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Dernière activité: {user.lastActive}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connexions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground self-start" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activityData[0].logins}</div>
                <p className="text-xs text-muted-foreground">
                  +{activityData[0].logins - activityData[1].logins} par rapport à hier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mots de passe créés</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground self-start" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activityData[0].passwords}</div>
                <p className="text-xs text-muted-foreground">
                  +{activityData[0].passwords - activityData[1].passwords} par rapport à hier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partages</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground self-start" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activityData[0].shares}</div>
                <p className="text-xs text-muted-foreground">
                  +{activityData[0].shares - activityData[1].shares} par rapport à hier
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>Statistiques d'utilisation des 5 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Connexions</h4>
                  </div>
                  <div className="space-y-2">
                    {activityData.map((day, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-12 text-xs text-muted-foreground">
                          {new Date(day.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </div>
                        <div className="flex-1">
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${(day.logins / 20) * 100}%` }} />
                          </div>
                        </div>
                        <div className="w-9 text-xs font-medium">{day.logins}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Mots de passe créés</h4>
                  </div>
                  <div className="space-y-2">
                    {activityData.map((day, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-12 text-xs text-muted-foreground">
                          {new Date(day.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </div>
                        <div className="flex-1">
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${(day.passwords / 10) * 100}%` }} />
                          </div>
                        </div>
                        <div className="w-9 text-xs font-medium">{day.passwords}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Partages</h4>
                  </div>
                  <div className="space-y-2">
                    {activityData.map((day, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-12 text-xs text-muted-foreground">
                          {new Date(day.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </div>
                        <div className="flex-1">
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${(day.shares / 5) * 100}%` }} />
                          </div>
                        </div>
                        <div className="w-9 text-xs font-medium">{day.shares}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogDescription>Créez un nouvel utilisateur et définissez ses permissions.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" placeholder="Prénom Nom" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input id="email" type="email" placeholder="utilisateur@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select defaultValue="user">
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="user">Utilisateur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe temporaire</Label>
              <Input id="password" type="password" />
              <p className="text-xs text-muted-foreground">
                L'utilisateur devra changer ce mot de passe lors de sa première connexion.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              Annuler
            </Button>
            <Button>Ajouter l'utilisateur</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
