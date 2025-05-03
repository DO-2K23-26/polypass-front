"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Eye, EyeOff, Copy, Check, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface SecretField {
  key: string
  value: string
  type: "text" | "password"
}

export default function SharePage() {
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [secretContent, setSecretContent] = useState<Record<string, string> | null>(null)
  const [secretFields, setSecretFields] = useState<SecretField[]>([])
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [passphrase, setPassphrase] = useState("")
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [isOneTimeUse, setIsOneTimeUse] = useState(false)
  const [secretViewed, setSecretViewed] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showPasswordFields, setShowPasswordFields] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Simuler un appel API pour récupérer les informations du secret
    const fetchSecret = async () => {
      setLoading(true)
      try {
        // Simulation d'un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simulation de données
        if (id === "expired") {
          setError("Ce lien a expiré ou n'existe pas.")
        } else {
          setIsEncrypted(id.includes("encrypted"))
          setIsOneTimeUse(id.includes("onetime") || Math.random() > 0.5)

          if (!isEncrypted) {
            // Exemple de contenu pour un secret non chiffré
            const content = {
              username: "admin",
              password: "P@ssw0rd123!",
              server: "srv-prod-01.example.com",
              port: "22",
              notes: "Utiliser la clé SSH fournie séparément. Accès limité aux répertoires /var/www et /opt/app.",
            }
            setSecretContent(content)

            // Convertir en champs avec types
            const fields: SecretField[] = Object.entries(content).map(([key, value]) => ({
              key,
              value,
              type: key.includes("password") || key.includes("secret") || key.includes("key") ? "password" : "text",
            }))
            setSecretFields(fields)
          }
        }
      } catch (err) {
        setError("Une erreur est survenue lors de la récupération du secret.")
      } finally {
        setLoading(false)
      }
    }

    fetchSecret()
  }, [id])

  const handleDecrypt = () => {
    if (passphrase) {
      // Simulation de déchiffrement
      const content = {
        username: "admin",
        password: "P@ssw0rd123!",
        server: "srv-prod-01.example.com",
        port: "22",
        notes: "Utiliser la clé SSH fournie séparément. Accès limité aux répertoires /var/www et /opt/app.",
      }
      setSecretContent(content)

      // Convertir en champs avec types
      const fields: SecretField[] = Object.entries(content).map(([key, value]) => ({
        key,
        value,
        type: key.includes("password") || key.includes("secret") || key.includes("key") ? "password" : "text",
      }))
      setSecretFields(fields)
      setSecretViewed(true)
    }
  }

  const handleViewSecret = () => {
    setShowSecret(true)
    setSecretViewed(true)
  }

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldKey)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const togglePasswordVisibility = (fieldKey: string) => {
    setShowPasswordFields((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }))
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Chargement du secret...</CardTitle>
            <CardDescription className="text-center">
              Veuillez patienter pendant que nous récupérons les informations.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Secret non disponible</CardTitle>
            <CardDescription className="text-center">Nous n'avons pas pu récupérer le secret demandé.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/")}>
              Retour à l'accueil
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (isEncrypted && !secretContent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Secret protégé par mot de passe</CardTitle>
            <CardDescription className="text-center">
              Ce secret est protégé par un mot de passe. Veuillez le saisir pour accéder au contenu.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passphrase">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="passphrase"
                  type={showPassphrase ? "text" : "password"}
                  placeholder="Entrez le mot de passe"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                >
                  {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassphrase ? "Masquer" : "Afficher"} le mot de passe</span>
                </Button>
              </div>
            </div>

            {isOneTimeUse && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Attention</AlertTitle>
                <AlertDescription>
                  Ce secret ne peut être consulté qu'une seule fois. Une fois déchiffré, il sera définitivement
                  supprimé.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleDecrypt} disabled={!passphrase}>
              Accéder au secret
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Secret partagé</CardTitle>
          <CardDescription className="text-center">
            {secretViewed ? "Voici le contenu du secret partagé avec vous." : "Ce secret est prêt à être consulté."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isOneTimeUse && !secretViewed && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                Ce secret ne peut être consulté qu'une seule fois. Une fois affiché, il sera définitivement supprimé.
              </AlertDescription>
            </Alert>
          )}

          {!showSecret && !secretViewed ? (
            <div className="flex justify-center py-4">
              <Button onClick={handleViewSecret}>
                <Eye className="mr-2 h-4 w-4" />
                Afficher le secret
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Informations partagées</h3>
                <Badge variant="outline">
                  {secretFields.length} champ{secretFields.length > 1 ? "s" : ""}
                </Badge>
              </div>

              {secretFields.map((field, index) => (
                <div key={index} className="space-y-1">
                  <Label htmlFor={`field-${index}`} className="text-xs font-medium uppercase text-muted-foreground">
                    {field.key}
                  </Label>
                  <div className="relative">
                    {field.type === "password" ? (
                      <div className="flex">
                        <Input
                          id={`field-${index}`}
                          type={showPasswordFields[field.key] ? "text" : "password"}
                          value={field.value}
                          readOnly
                          className="pr-20"
                        />
                        <div className="absolute right-0 top-0 h-full flex">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-full"
                            onClick={() => togglePasswordVisibility(field.key)}
                          >
                            {showPasswordFields[field.key] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">{showPasswordFields[field.key] ? "Masquer" : "Afficher"}</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-full"
                            onClick={() => copyToClipboard(field.value, field.key)}
                          >
                            {copiedField === field.key ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            <span className="sr-only">Copier</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex">
                        <Input id={`field-${index}`} value={field.value} readOnly className="pr-10" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => copyToClipboard(field.value, field.key)}
                        >
                          {copiedField === field.key ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          <span className="sr-only">Copier</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {secretViewed && isOneTimeUse && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Secret consulté</AlertTitle>
              <AlertDescription>
                Ce secret a été consulté et a été supprimé de nos serveurs. Il n'est plus accessible.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/")}>
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
