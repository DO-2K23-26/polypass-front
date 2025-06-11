"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Shield, RefreshCw, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { analyzePasswords, SecurityMetrics } from "@/lib/api/security"
import { useCredentials } from "@/hooks/use-credentials"
import { toast } from "sonner"

export function SecurityDashboard() {
  const [securityScore, setSecurityScore] = useState(0)
  const [lastScan, setLastScan] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    weakPasswords: {},
    strongPasswords: {},
    reusedPasswords: {},
    oldPasswords: {},
    breachedPasswords: {},
  })

  const { credentials, isLoading: isLoadingCredentials } = useCredentials()

  const analyzeSecurity = async () => {
    if (credentials.length === 0) {
      toast.error("Aucun credential à analyser")
      return
    }

    try {
      setIsAnalyzing(true)
      const result = await analyzePasswords(credentials)
      setMetrics(result)
      setLastScan(new Date().toISOString())
      toast.success("Analyse de sécurité terminée")
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error)
      toast.error("Erreur lors de l'analyse de sécurité")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Calculer le score de sécurité
  useEffect(() => {
    if (credentials.length === 0) return

    const totalPasswords = credentials.length
    const weakCount = Object.keys(metrics.weakPasswords).length
    const reusedCount = Object.keys(metrics.reusedPasswords).length
    const oldCount = Object.keys(metrics.oldPasswords).length
    const breachedCount = Object.keys(metrics.breachedPasswords).length

    // Calcul basé sur la proportion de chaque type de problème
    const weakPenalty = (weakCount / totalPasswords) * 30 // 30% de pénalité max pour les mots de passe faibles
    const reusedPenalty = (reusedCount / totalPasswords) * 25 // 25% de pénalité max pour les réutilisations
    const oldPenalty = (oldCount / totalPasswords) * 20 // 20% de pénalité max pour les mots de passe anciens
    const breachedPenalty = (breachedCount / totalPasswords) * 25 // 25% de pénalité max pour les compromissions

    // Score final en soustrayant les pénalités de 100
    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round(100 - (weakPenalty + reusedPenalty + oldPenalty + breachedPenalty))
      )
    )

    setSecurityScore(score)
  }, [metrics, credentials])

  // Transformer les données pour l'affichage
  const weakPasswordsList = Object.entries(metrics.weakPasswords).flatMap(([password, ids]) =>
    ids.map(id => {
      const credential = credentials.find(c => c.id === id)
      return {
        id,
        title: credential?.title || "Inconnu",
        username: credential?.username || "Inconnu",
        website: credential?.website || "Inconnu",
        lastUpdated: credential?.lastUpdated || "Inconnu",
      }
    })
  )

  const reusedPasswordsList = Object.entries(metrics.reusedPasswords).flatMap(([password, ids]) =>
    ids.map(id => {
      const credential = credentials.find(c => c.id === id)
      return {
        id,
        title: credential?.title || "Inconnu",
        username: credential?.username || "Inconnu",
        website: credential?.website || "Inconnu",
        lastUpdated: credential?.lastUpdated || "Inconnu",
      }
    })
  )

  const oldPasswordsList = Object.entries(metrics.oldPasswords).flatMap(([password, ids]) =>
    ids.map(id => {
      const credential = credentials.find(c => c.id === id)
      return {
        id,
        title: credential?.title || "Inconnu",
        username: credential?.username || "Inconnu",
        website: credential?.website || "Inconnu",
        lastUpdated: credential?.lastUpdated || "Inconnu",
      }
    })
  )

  const breachedPasswordsList = Object.entries(metrics.breachedPasswords).flatMap(([password, ids]) =>
    ids.map(id => {
      const credential = credentials.find(c => c.id === id)
      return {
        id,
        title: credential?.title || "Inconnu",
        username: credential?.username || "Inconnu",
        website: credential?.website || "Inconnu",
        lastUpdated: credential?.lastUpdated || "Inconnu",
      }
    })
  )

  if (isLoadingCredentials) {
    return <div>Chargement...</div>
  }

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
            <div className="text-2xl font-bold">{weakPasswordsList.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {weakPasswordsList.length === 0
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
            <div className="text-2xl font-bold">{reusedPasswordsList.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {reusedPasswordsList.length === 0
                ? "Aucun mot de passe n'est réutilisé"
                : "Mots de passe utilisés sur plusieurs sites"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mots de passe compromis</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500 self-start" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{breachedPasswordsList.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {breachedPasswordsList.length === 0
                ? "Aucun mot de passe compromis"
                : "Mots de passe trouvés dans des fuites de données"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Analyse de sécurité</CardTitle>
            <CardDescription>
              {lastScan 
                ? `Dernière analyse: ${new Date(lastScan).toLocaleString('fr-FR')}`
                : "Aucune analyse effectuée"}
            </CardDescription>
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
                {weakPasswordsList.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                      <h3 className="mt-2 text-sm font-medium">Tous vos mots de passe sont forts</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Continuez comme ça !</p>
                    </div>
                  </div>
                ) : (
                  weakPasswordsList.map((password) => (
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
                {reusedPasswordsList.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                      <h3 className="mt-2 text-sm font-medium">Aucun mot de passe réutilisé</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Tous vos mots de passe sont uniques.</p>
                    </div>
                  </div>
                ) : (
                  reusedPasswordsList.map((password) => (
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
                {oldPasswordsList.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                      <h3 className="mt-2 text-sm font-medium">Aucun mot de passe ancien</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Tous vos mots de passe ont été mis à jour récemment.
                      </p>
                    </div>
                  </div>
                ) : (
                  oldPasswordsList.map((password) => (
                    <div key={password.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{password.title}</div>
                        <div className="text-sm text-muted-foreground">{password.username}</div>
                        <div className="text-xs text-muted-foreground">
                          Dernière mise à jour: {password.lastUpdated}
                        </div>
                      </div>
                      <Button size="sm">Mettre à jour</Button>
                    </div>
                  ))
                )}
              </TabsContent>
              <TabsContent value="breached" className="space-y-4 pt-4">
                {breachedPasswordsList.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                      <h3 className="mt-2 text-sm font-medium">Aucun mot de passe compromis</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Aucun de vos mots de passe n'a été trouvé dans les fuites de données connues.
                      </p>
                    </div>
                  </div>
                ) : (
                  breachedPasswordsList.map((password) => (
                    <div key={password.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{password.title}</div>
                        <div className="text-sm text-muted-foreground">{password.username}</div>
                        <div className="text-xs text-red-500">
                          Ce mot de passe a été compromis dans une fuite de données
                        </div>
                      </div>
                      <Button size="sm" variant="destructive">Changer immédiatement</Button>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={analyzeSecurity}
              disabled={isAnalyzing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyse en cours...' : 'Lancer une analyse complète'}
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
