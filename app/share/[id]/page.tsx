'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Eye, EyeOff, Copy, Check, Shield, AlertTriangle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { getSecret } from '@/app/actions/sharing'
import { decryptData, isCryptoAvailable } from '@/lib/crypto'

interface SecretField {
  key: string
  value: string
  type: 'text' | 'password'
}

export default function SharePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [secretContent, setSecretContent] = useState<Record<string, string> | null>(null)
  const [secretFields, setSecretFields] = useState<SecretField[]>([])
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [hasEncryptedData, setHasEncryptedData] = useState(false)
  const [encryptedData, setEncryptedData] = useState<string | null>(null)
  const [passphrase, setPassphrase] = useState('')
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [isOneTimeUse, setIsOneTimeUse] = useState(false)
  const [secretViewed, setSecretViewed] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showPasswordFields, setShowPasswordFields] = useState<Record<string, boolean>>({})
  const [secretName, setSecretName] = useState<string | null>(null)
  const [isDecrypting, setIsDecrypting] = useState(false)

  useEffect(() => {
    fetchSecret()
  }, [id])

  // Récupérer le secret depuis le serveur
  const fetchSecret = async () => {
    setLoading(true)
    try {
      console.log(`Récupération du secret avec l'ID: ${id}`)

      // Appel au Server Action pour récupérer le secret
      const data = await getSecret(id)
      console.log('Données reçues:', data)

      // Vérifier si le secret est chiffré
      setIsEncrypted(data.is_encrypted)

      // Vérifier si les données contiennent un contenu chiffré côté client
      if (data.content._encrypted) {
        setHasEncryptedData(true)
        setEncryptedData(data.content._encrypted)

        // Extraire le nom du secret s'il existe
        if (data.content._name) {
          setSecretName(data.content._name)
        }
      } else if (!data.is_encrypted) {
        // Si le secret n'est pas chiffré, on peut afficher son contenu directement
        processSecretContent(data.content)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du secret:', error)
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de la récupération du secret.')
    } finally {
      setLoading(false)
    }
  }

  // Déchiffrer les données avec le mot de passe fourni par l'utilisateur
  const handleDecrypt = async () => {
    if (!passphrase || !encryptedData) return

    setIsDecrypting(true)
    try {
      // Vérifier que l'API Web Crypto est disponible
      if (!isCryptoAvailable()) {
        throw new Error('Votre navigateur ne prend pas en charge le déchiffrement. Veuillez utiliser un navigateur plus récent.')
      }

      // Déchiffrer les données avec le mot de passe
      const decryptedContent = await decryptData(encryptedData, passphrase)

      // Traiter le contenu déchiffré
      processSecretContent(decryptedContent)
    } catch (error) {
      console.error('Erreur lors du déchiffrement:', error)
      toast({
        title: 'Erreur',
        description: 'Mot de passe incorrect ou données corrompues',
        variant: 'destructive',
      })
    } finally {
      setIsDecrypting(false)
    }
  }

  const processSecretContent = (content: Record<string, string>) => {
    setSecretContent(content)

    // Extraire le nom du secret s'il existe
    if (content._name) {
      setSecretName(content._name)
      // On peut supprimer cette clé pour ne pas l'afficher dans la liste
      const { _name, ...rest } = content
      content = rest
    }

    // Vérifier si c'est un secret à usage unique
    if (content._one_time_use) {
      setIsOneTimeUse(content._one_time_use === 'true')
      const { _one_time_use, ...rest } = content
      content = rest
    }

    // Convertir en champs avec types
    const fields: SecretField[] = Object.entries(content).map(([key, value]) => ({
      key,
      value,
      type: key.includes('password') || key.includes('secret') || key.includes('key') ? 'password' : 'text',
    }))

    setSecretFields(fields)
    setSecretViewed(true)
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
            <CardDescription className="text-center">Veuillez patienter pendant que nous récupérons les informations.</CardDescription>
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
            <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
              Retour à l'accueil
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Afficher l'écran de saisie du mot de passe pour les secrets chiffrés côté client
  if (hasEncryptedData && !secretContent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Secret protégé par mot de passe</CardTitle>
            <CardDescription className="text-center">Ce secret est protégé par un mot de passe. Veuillez le saisir pour accéder au contenu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passphrase">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="passphrase"
                  type={showPassphrase ? 'text' : 'password'}
                  placeholder="Entrez le mot de passe"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="pr-10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleDecrypt()
                    }
                  }}
                />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPassphrase(!showPassphrase)}>
                  {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassphrase ? 'Masquer' : 'Afficher'} le mot de passe</span>
                </Button>
              </div>
            </div>

            {isOneTimeUse && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Attention</AlertTitle>
                <AlertDescription>Ce secret ne peut être consulté qu'une seule fois. Une fois déchiffré, il sera définitivement supprimé.</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleDecrypt} disabled={!passphrase || isDecrypting}>
              {isDecrypting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Déchiffrement...
                </>
              ) : (
                'Accéder au secret'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Afficher l'écran de saisie du mot de passe pour les secrets chiffrés côté serveur
  if (isEncrypted && !hasEncryptedData && !secretContent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Secret protégé par mot de passe</CardTitle>
            <CardDescription className="text-center">Ce secret est protégé par un mot de passe. Veuillez contacter l'expéditeur pour obtenir le mot de passe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>Ce secret utilise un chiffrement côté serveur. Veuillez contacter l'expéditeur pour obtenir le mot de passe.</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
              Retour à l'accueil
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
          <CardTitle className="text-center">{secretName || 'Secret partagé'}</CardTitle>
          <CardDescription className="text-center">{secretViewed ? 'Voici le contenu du secret partagé avec vous.' : 'Ce secret est prêt à être consulté.'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isOneTimeUse && !secretViewed && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>Ce secret ne peut être consulté qu'une seule fois. Une fois affiché, il sera définitivement supprimé.</AlertDescription>
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
                  {secretFields.length} champ{secretFields.length > 1 ? 's' : ''}
                </Badge>
              </div>

              {secretFields.map((field, index) => (
                <div key={index} className="space-y-1">
                  <Label htmlFor={`field-${index}`} className="text-xs font-medium uppercase text-muted-foreground">
                    {field.key}
                  </Label>
                  <div className="relative">
                    {field.type === 'password' ? (
                      <div className="flex">
                        <Input id={`field-${index}`} type={showPasswordFields[field.key] ? 'text' : 'password'} value={field.value} readOnly className="pr-20" />
                        <div className="absolute right-0 top-0 h-full flex">
                          <Button type="button" variant="ghost" size="icon" className="h-full" onClick={() => togglePasswordVisibility(field.key)}>
                            {showPasswordFields[field.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showPasswordFields[field.key] ? 'Masquer' : 'Afficher'}</span>
                          </Button>
                          <Button type="button" variant="ghost" size="icon" className="h-full" onClick={() => copyToClipboard(field.value, field.key)}>
                            {copiedField === field.key ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            <span className="sr-only">Copier</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex">
                        <Input id={`field-${index}`} value={field.value} readOnly className="pr-10" />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => copyToClipboard(field.value, field.key)}>
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
              <AlertDescription>Ce secret a été consulté et a été supprimé de nos serveurs. Il n'est plus accessible.</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
