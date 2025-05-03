"use client"

import { useState } from "react"
import { AlertTriangle, Shield, RefreshCw, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function SecurityDashboard() {
  const [securityScore, setSecurityScore] = useState(68)
  const [lastScan, setLastScan] = useState("2023-12-15")

  const weakPasswords = [
    { id: "1", title: "Netflix", username: "moviefan", website: "netflix.com", lastUpdated: "2023-10-20" },
    { id: "2", title: "Twitter", username: "socialuser", website: "twitter.com", lastUpdated: "2023-08-12" },
  ]

  const reusedPasswords = [
    { id: "3", title: "GitHub", username: "devuser", website: "github.com", lastUpdated: "2023-11-15" },
    { id: "4", title: "GitLab", username: "devuser", website: "gitlab.com", lastUpdated: "2023-09-22" },
  ]

  const oldPasswords = [
    { id: "5", title: "Amazon", username: "shopper123", website: "amazon.com", lastUpdated: "2023-09-05" },
    { id: "6", title: "eBay", username: "bidder42", website: "ebay.com", lastUpdated: "2023-07-18" },
  ]

  const breachedAccounts = [
    {
      id: "7",
      title: "LinkedIn",
      username: "professional",
      website: "linkedin.com",
      breachDate: "2023-11-30",
      severity: "high",
    },
    {
      id: "8",
      title: "Dropbox",
      username: "fileuser",
      website: "dropbox.com",
      breachDate: "2023-10-05",
      severity: "medium",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tableau de bord de sécurité</h2>
        <p className="text-muted-foreground">Surveillez et améliorez la sécurité de vos mots de passe.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de sécurité</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground self-start" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityScore}/100</div>
            <Progress value={securityScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {securityScore < 50
                ? "Votre sécurité est à risque"
                : securityScore < 80
                  ? "Votre sécurité est moyenne"
                  : "Votre sécurité est bonne"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mots de passe faibles</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500 self-start" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weakPasswords.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {weakPasswords.length === 0
                ? "Tous vos mots de passe sont forts"
                : "Mots de passe nécessitant une amélioration"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mots de passe réutilisés</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500 self-start" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reusedPasswords.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {reusedPasswords.length === 0
                ? "Aucun mot de passe n'est réutilisé"
                : "Mots de passe utilisés sur plusieurs sites"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comptes compromis</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500 self-start" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{breachedAccounts.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {breachedAccounts.length === 0
                ? "Aucun compte compromis détecté"
                : "Comptes détectés dans des fuites de données"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Analyse de sécurité</CardTitle>
            <CardDescription>Dernière analyse: {lastScan}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Tabs defaultValue="weak">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="weak">Faibles</TabsTrigger>
                <TabsTrigger value="reused">Réutilisés</TabsTrigger>
                <TabsTrigger value="old">Anciens</TabsTrigger>
                <TabsTrigger value="breached">Compromis</TabsTrigger>
              </TabsList>
              <TabsContent value="weak" className="space-y-4 pt-4">
                {weakPasswords.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                      <h3 className="mt-2 text-sm font-medium">Tous vos mots de passe sont forts</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Continuez comme ça !</p>
                    </div>
                  </div>
                ) : (
                  weakPasswords.map((password) => (
                    <div key={password.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{password.title}</div>
                        <div className="text-sm text-muted-foreground">{password.username}</div>
                      </div>
                      <Button size="sm">Renforcer</Button>
                    </div>
                  ))
                )}
              </TabsContent>
              <TabsContent value="reused" className="space-y-4 pt-4">
                {reusedPasswords.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                      <h3 className="mt-2 text-sm font-medium">Aucun mot de passe réutilisé</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Tous vos mots de passe sont uniques.</p>
                    </div>
                  </div>
                ) : (
                  reusedPasswords.map((password) => (
                    <div key={password.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{password.title}</div>
                        <div className="text-sm text-muted-foreground">{password.username}</div>
                      </div>
                      <Button size="sm">Changer</Button>
                    </div>
                  ))
                )}
              </TabsContent>
              <TabsContent value="old" className="space-y-4 pt-4">
                {oldPasswords.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                      <h3 className="mt-2 text-sm font-medium">Tous vos mots de passe sont récents</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Vous mettez régulièrement à jour vos mots de passe.
                      </p>
                    </div>
                  </div>
                ) : (
                  oldPasswords.map((password) => (
                    <div key={password.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{password.title}</div>
                        <div className="text-sm text-muted-foreground">Mis à jour: {password.lastUpdated}</div>
                      </div>
                      <Button size="sm">Mettre à jour</Button>
                    </div>
                  ))
                )}
              </TabsContent>
              <TabsContent value="breached" className="space-y-4 pt-4">
                {breachedAccounts.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                      <h3 className="mt-2 text-sm font-medium">Aucun compte compromis</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Vos comptes n'ont pas été détectés dans des fuites de données.
                      </p>
                    </div>
                  </div>
                ) : (
                  breachedAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{account.title}</div>
                        <div className="text-sm text-muted-foreground">Fuite détectée: {account.breachDate}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={account.severity === "high" ? "destructive" : "outline"}>
                          {account.severity === "high" ? "Critique" : "Moyen"}
                        </Badge>
                        <Button size="sm">Sécuriser</Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Lancer une analyse complète
            </Button>
          </CardFooter>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Conseils de sécurité</CardTitle>
            <CardDescription>Améliorez votre sécurité en ligne</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Utilisez l'authentification à deux facteurs</h4>
                  <p className="text-sm text-muted-foreground">
                    Activez l'authentification à deux facteurs sur tous vos comptes importants pour une sécurité
                    renforcée.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <RefreshCw className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Évitez de réutiliser les mots de passe</h4>
                  <p className="text-sm text-muted-foreground">
                    Utilisez un mot de passe unique pour chaque site web et service.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <Clock className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Changez régulièrement vos mots de passe</h4>
                  <p className="text-sm text-muted-foreground">
                    Mettez à jour vos mots de passe tous les 3 mois, surtout pour les comptes sensibles.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <Shield className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Vérifiez régulièrement les fuites de données</h4>
                  <p className="text-sm text-muted-foreground">
                    Surveillez si vos comptes apparaissent dans des fuites de données et réagissez rapidement.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
