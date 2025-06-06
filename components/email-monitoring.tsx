"use client"

import { useState } from "react"
import { Mail, AlertTriangle, Shield, RefreshCw, Clock, CheckCircle2, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EmailMonitoring() {
  const [searchQuery, setSearchQuery] = useState("")

  const monitoredEmails = [
    {
      id: "1",
      email: "john.doe@example.com",
      status: "active",
      lastCheck: "2024-03-15",
      breaches: 2,
      alerts: 3,
    },
    {
      id: "2",
      email: "jane.smith@example.com",
      status: "active",
      lastCheck: "2024-03-14",
      breaches: 0,
      alerts: 1,
    },
    {
      id: "3",
      email: "work@example.com",
      status: "inactive",
      lastCheck: "2024-03-10",
      breaches: 1,
      alerts: 0,
    },
  ]

  const recentBreaches = [
    {
      id: "1",
      email: "john.doe@example.com",
      service: "LinkedIn",
      date: "2024-03-01",
      severity: "high",
      status: "unresolved",
    },
    {
      id: "2",
      email: "john.doe@example.com",
      service: "Dropbox",
      date: "2024-02-15",
      severity: "medium",
      status: "resolved",
    },
    {
      id: "3",
      email: "work@example.com",
      service: "Adobe",
      date: "2024-02-01",
      severity: "low",
      status: "resolved",
    },
  ]

  const alerts = [
    {
      id: "1",
      email: "john.doe@example.com",
      type: "suspicious_activity",
      date: "2024-03-15",
      description: "Connexion inhabituelle détectée",
      status: "new",
    },
    {
      id: "2",
      email: "jane.smith@example.com",
      type: "password_change",
      date: "2024-03-14",
      description: "Changement de mot de passe détecté",
      status: "read",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Surveillance des emails</h2>
        <p className="text-muted-foreground">Surveillez vos adresses email pour détecter les fuites de données et les activités suspectes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails surveillés</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground self-start" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitoredEmails.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {monitoredEmails.length === 0
                ? "Aucun email surveillé"
                : "Emails actuellement surveillés"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuites détectées</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500 self-start" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monitoredEmails.reduce((acc, email) => acc + email.breaches, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Fuites de données détectées
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes actives</CardTitle>
            <Shield className="h-4 w-4 text-blue-500 self-start" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monitoredEmails.reduce((acc, email) => acc + email.alerts, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Alertes nécessitant votre attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière vérification</CardTitle>
            <Clock className="h-4 w-4 text-green-500 self-start" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(Math.max(...monitoredEmails.map(e => new Date(e.lastCheck).getTime()))).toLocaleDateString("fr-FR")}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Dernière mise à jour des données
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Surveillance des emails</CardTitle>
            <CardDescription>Gérez vos adresses email surveillées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Ajouter un email
              </Button>
            </div>

            <div className="space-y-4">
              {monitoredEmails.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{email.email}</div>
                    <div className="text-sm text-muted-foreground">
                      Dernière vérification: {new Date(email.lastCheck).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{email.breaches} fuites</div>
                      <div className="text-sm text-muted-foreground">{email.alerts} alertes</div>
                    </div>
                    <Badge variant={email.status === "active" ? "default" : "secondary"}>
                      {email.status === "active" ? "Actif" : "Inactif"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Fuites récentes</CardTitle>
            <CardDescription>Dernières fuites de données détectées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBreaches.map((breach) => (
                <div key={breach.id} className="flex items-start gap-4 p-3 border rounded-lg">
                  <div className="mt-0.5">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{breach.service}</div>
                      <Badge
                        variant={
                          breach.severity === "high"
                            ? "destructive"
                            : breach.severity === "medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {breach.severity === "high"
                          ? "Critique"
                          : breach.severity === "medium"
                          ? "Moyen"
                          : "Faible"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {breach.email} • {new Date(breach.date).toLocaleDateString("fr-FR")}
                    </div>
                    <div className="mt-2">
                      <Button size="sm" variant="outline">
                        {breach.status === "resolved" ? "Résolu" : "Résoudre"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertes récentes</CardTitle>
          <CardDescription>Dernières alertes de sécurité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 p-3 border rounded-lg">
                <div className="mt-0.5">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{alert.description}</div>
                    <Badge variant={alert.status === "new" ? "default" : "secondary"}>
                      {alert.status === "new" ? "Nouveau" : "Lu"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {alert.email} • {new Date(alert.date).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
