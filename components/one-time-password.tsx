'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Copy, Check, Clock, Link, AlertCircle, Shield, Eye, EyeOff, Plus, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { createSecret, getHistory, type HistorySecret } from '@/app/actions/sharing'
import { encryptData, isCryptoAvailable } from '@/lib/crypto'

// Type pour les paires clé-valeur
interface SecretField {
  key: string
  value: string
  type: 'text' | 'password'
}

export function OneTimePassword() {
  const [secretFields, setSecretFields] = useState<SecretField[]>([
    { key: 'username', value: '', type: 'text' },
    { key: 'password', value: '', type: 'password' },
  ])
  const [secretName, setSecretName] = useState('')
  const [expirationHours, setExpirationHours] = useState('24')
  const [isOneTimeUse, setIsOneTimeUse] = useState(true)
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [passphrase, setPassphrase] = useState('')
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('create')
  const [newFieldKey, setNewFieldKey] = useState('')
  const [newFieldType, setNewFieldType] = useState<'text' | 'password'>('text')
  const [showPassword, setShowPassword] = useState<Record<number, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [historySecrets, setHistorySecrets] = useState<HistorySecret[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Charger l'historique quand on passe à l'onglet historique
  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory()
    }
  }, [activeTab])

  // Fonction pour charger l'historique depuis l'API
  const loadHistory = async () => {
    setIsLoadingHistory(true)
    try {
      const history = await getHistory()
      setHistorySecrets(history)
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error)
      toast({
        title: 'Erreur',
        description: "Impossible de charger l'historique des secrets",
        variant: 'destructive',
      })
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Convertir les champs en map pour l'API
  const getContentMap = () => {
    const contentMap: Record<string, string> = {}
    secretFields.forEach((field) => {
      if (field.key.trim() && field.value.trim()) {
        contentMap[field.key] = field.value
      }
    })

    // Ajouter le nom du secret comme métadonnée si présent
    if (secretName) {
      contentMap['_name'] = secretName
    }

    // Ajouter une métadonnée pour indiquer que c'est un secret à usage unique
    if (isOneTimeUse) {
      contentMap['_one_time_use'] = 'true'
    }

    return contentMap
  }

  // Fonction pour créer un secret
  const handleCreateSecret = async () => {
    setIsLoading(true)

    try {
      // Vérifier que tous les champs ont une valeur et une clé
      const isValid = secretFields.every((field) => field.key.trim() && field.value.trim())
      if (!isValid) {
        toast({
          title: 'Erreur',
          description: 'Tous les champs doivent avoir un nom et une valeur',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      // Vérifier que le mot de passe est fourni si le secret est chiffré
      if (isEncrypted && !passphrase) {
        toast({
          title: 'Erreur',
          description: 'Veuillez fournir un mot de passe pour protéger le secret',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      // Vérifier que l'API Web Crypto est disponible pour le chiffrement
      if (isEncrypted && !isCryptoAvailable()) {
        toast({
          title: 'Erreur',
          description: 'Votre navigateur ne prend pas en charge le chiffrement. Veuillez utiliser un navigateur plus récent.',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      // Obtenir les données à envoyer
      const contentMap = getContentMap()
      let finalContent: Record<string, string>

      // Si le secret est chiffré, chiffrer les données avec le mot de passe
      if (isEncrypted && passphrase) {
        // Chiffrer les données avec le mot de passe
        const encryptedContent = await encryptData(contentMap, passphrase)

        // Créer un nouvel objet avec seulement les données chiffrées
        finalContent = {
          _encrypted: encryptedContent,
          _name: secretName, // Garder le nom en clair pour l'affichage
        }
      } else {
        // Utiliser les données non chiffrées
        finalContent = contentMap
      }

      // Calculer la date d'expiration en timestamp Unix (secondes)
      const now = Math.floor(Date.now() / 1000)
      const expirationSeconds = now + Number.parseInt(expirationHours) * 60 * 60

      // Préparer la requête
      const request = {
        content: finalContent,
        expiration: expirationSeconds,
        is_encrypted: isEncrypted,
        is_one_time_use: isOneTimeUse,
      }

      console.log('Envoi de la requête:', JSON.stringify(request, null, 2))

      // Appeler le Server Action
      const data = await createSecret(request)

      // Générer le lien de partage
      const baseUrl = window.location.origin
      const newLink = `${baseUrl}/share/${data.id}`
      setGeneratedLink(newLink)

      toast({
        title: 'Succès',
        description: 'Le lien de partage a été créé avec succès',
      })

      // Recharger l'historique si on est sur l'onglet historique
      if (activeTab === 'history') {
        loadHistory()
      }
    } catch (error) {
      console.error('Erreur lors de la création du secret:', error)
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de créer le lien de partage. Veuillez réessayer.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleCreateSecret()
  }

  const addField = () => {
    if (newFieldKey.trim()) {
      setSecretFields([...secretFields, { key: newFieldKey, value: '', type: newFieldType }])
      setNewFieldKey('')
      setNewFieldType('text')
    }
  }

  const removeField = (index: number) => {
    if (secretFields.length > 1) {
      setSecretFields(secretFields.filter((_, i) => i !== index))
    }
  }

  const updateField = (index: number, field: Partial<SecretField>) => {
    const newFields = [...secretFields]
    newFields[index] = { ...newFields[index], ...field }
    setSecretFields(newFields)
  }

  const togglePasswordVisibility = (index: number) => {
    setShowPassword((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Fonction pour formater les dates
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Fonction pour vérifier si un secret a expiré
  const isExpired = (expiration: number) => {
    return Date.now() / 1000 > expiration
  }

  // Fonction pour formater la taille du contenu
  const formatContentSize = (size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Partage à usage unique</h2>
        <p className="text-muted-foreground">Partagez des mots de passe et informations sensibles de façon sécurisée</p>
      </div>

      <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="create">Créer un lien</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          {activeTab === 'history' && (
            <Button variant="outline" onClick={loadHistory} disabled={isLoadingHistory}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingHistory ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          )}
        </div>

        <TabsContent value="create" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Créer un secret à partager</CardTitle>
                    <CardDescription>Les informations partagées seront accessibles via un lien unique</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="secretName">Nom du secret (optionnel)</Label>
                      <Input id="secretName" placeholder="Ex: Accès serveur production" value={secretName} onChange={(e) => setSecretName(e.target.value)} />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Informations à partager</Label>
                        <Badge variant="outline" className="ml-2">
                          {secretFields.length} champ{secretFields.length > 1 ? 's' : ''}
                        </Badge>
                      </div>

                      {secretFields.map((field, index) => (
                        <div key={index} className="space-y-2 border rounded-md p-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`field-key-${index}`}>Nom du champ</Label>
                            {secretFields.length > 1 && (
                              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeField(index)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Supprimer le champ</span>
                              </Button>
                            )}
                          </div>
                          <Input id={`field-key-${index}`} placeholder="Ex: Nom d'utilisateur" value={field.key} onChange={(e) => updateField(index, { key: e.target.value })} required />

                          <div className="flex items-center justify-between mt-2">
                            <Label htmlFor={`field-value-${index}`}>Valeur</Label>
                            <div className="flex items-center">
                              <Select value={field.type} onValueChange={(value) => updateField(index, { type: value as 'text' | 'password' })}>
                                <SelectTrigger className="w-[110px] h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Texte</SelectItem>
                                  <SelectItem value="password">Mot de passe</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="relative">
                            <Input
                              id={`field-value-${index}`}
                              type={field.type === 'password' && !showPassword[index] ? 'password' : 'text'}
                              placeholder="Valeur à partager"
                              value={field.value}
                              onChange={(e) => updateField(index, { value: e.target.value })}
                              className={field.type === 'password' ? 'pr-10' : ''}
                              required
                            />
                            {field.type === 'password' && (
                              <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => togglePasswordVisibility(index)}>
                                {showPassword[index] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span className="sr-only">{showPassword[index] ? 'Masquer' : 'Afficher'} le mot de passe</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      <div className="flex items-end gap-2">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="newFieldKey">Ajouter un champ</Label>
                          <Input id="newFieldKey" placeholder="Nom du champ" value={newFieldKey} onChange={(e) => setNewFieldKey(e.target.value)} />
                        </div>
                        <Select value={newFieldType} onValueChange={(value) => setNewFieldType(value as 'text' | 'password')}>
                          <SelectTrigger className="w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Texte</SelectItem>
                            <SelectItem value="password">Mot de passe</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button type="button" onClick={addField} disabled={!newFieldKey.trim()} className="mb-0.5">
                          <Plus className="h-4 w-4 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiration">Expiration</Label>
                      <Select value={expirationHours} onValueChange={setExpirationHours}>
                        <SelectTrigger id="expiration">
                          <SelectValue placeholder="Choisir une durée" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 heure</SelectItem>
                          <SelectItem value="4">4 heures</SelectItem>
                          <SelectItem value="12">12 heures</SelectItem>
                          <SelectItem value="24">24 heures</SelectItem>
                          <SelectItem value="72">3 jours</SelectItem>
                          <SelectItem value="168">7 jours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="oneTimeUse" className="cursor-pointer">
                          Lecture unique (burn after read)
                        </Label>
                        <Switch id="oneTimeUse" checked={isOneTimeUse} onCheckedChange={setIsOneTimeUse} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="encrypted" className="cursor-pointer">
                          Protéger par mot de passe
                        </Label>
                        <Switch id="encrypted" checked={isEncrypted} onCheckedChange={setIsEncrypted} />
                      </div>

                      {isEncrypted && (
                        <div className="space-y-2 pt-2">
                          <Label htmlFor="passphrase">Mot de passe</Label>
                          <div className="relative">
                            <Input
                              id="passphrase"
                              type={showPassphrase ? 'text' : 'password'}
                              placeholder="Entrez un mot de passe"
                              value={passphrase}
                              onChange={(e) => setPassphrase(e.target.value)}
                              className="pr-10"
                            />
                            <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPassphrase(!showPassphrase)}>
                              {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              <span className="sr-only">{showPassphrase ? 'Masquer' : 'Afficher'} le mot de passe</span>
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">Le destinataire devra saisir ce mot de passe pour accéder au contenu.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading || !secretFields.every((field) => field.key.trim() && field.value.trim())}>
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Création en cours...
                        </>
                      ) : (
                        'Générer un lien de partage'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>

            <div className="space-y-6">
              {generatedLink ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Lien généré</CardTitle>
                    <CardDescription>Partagez ce lien avec la personne qui doit accéder au secret</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Input value={generatedLink} readOnly className="pr-20 font-mono text-sm" />
                      <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => copyToClipboard(generatedLink)}>
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        {copied ? 'Copié' : 'Copier'}
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Expire dans {expirationHours} heure{Number.parseInt(expirationHours) > 1 ? 's' : ''}
                      </Badge>
                      {isOneTimeUse && (
                        <Badge variant="outline" className="flex items-center gap-1 bg-amber-100 text-amber-800">
                          <Eye className="h-3 w-3" />
                          Usage unique
                        </Badge>
                      )}
                      {isEncrypted && (
                        <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800">
                          <Shield className="h-3 w-3" />
                          Protégé par mot de passe
                        </Badge>
                      )}
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Plus className="h-3 w-3" />
                        {secretFields.length} champ{secretFields.length > 1 ? 's' : ''}
                      </Badge>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        {isOneTimeUse
                          ? "Ce lien ne pourra être consulté qu'une seule fois. Une fois ouvert, le secret sera détruit."
                          : "Ce lien peut être consulté plusieurs fois jusqu'à son expiration."}
                        {isEncrypted && ' Le destinataire devra saisir le mot de passe pour accéder au contenu.'}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab('history')}>
                      Voir l'historique
                    </Button>
                    <Button
                      onClick={() => {
                        setSecretFields([
                          { key: 'username', value: '', type: 'text' },
                          { key: 'password', value: '', type: 'password' },
                        ])
                        setSecretName('')
                        setGeneratedLink('')
                        setPassphrase('')
                      }}
                    >
                      Créer un nouveau lien
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Comment ça fonctionne</CardTitle>
                    <CardDescription>Partagez des informations sensibles de manière sécurisée</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 bg-muted rounded-full p-1">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Sécurisé</h4>
                          <p className="text-sm text-muted-foreground">Les secrets sont chiffrés et stockés de manière sécurisée.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 bg-muted rounded-full p-1">
                          <Eye className="h-4 w-4 text-amber-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Usage unique</h4>
                          <p className="text-sm text-muted-foreground">L'option "burn after read" détruit le secret après sa première consultation.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 bg-muted rounded-full p-1">
                          <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Expiration automatique</h4>
                          <p className="text-sm text-muted-foreground">Tous les secrets expirent automatiquement après la durée définie.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 bg-muted rounded-full p-1">
                          <Link className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Lien de partage</h4>
                          <p className="text-sm text-muted-foreground">Partagez simplement le lien généré avec le destinataire.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Cas d'utilisation</CardTitle>
                  <CardDescription>Exemples de situations où utiliser cette fonctionnalité</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc pl-5">
                    <li className="text-sm">Partager des identifiants temporaires avec des collaborateurs</li>
                    <li className="text-sm">Transmettre un mot de passe Wi-Fi à des invités</li>
                    <li className="text-sm">Envoyer des informations d'accès à un serveur</li>
                    <li className="text-sm">Partager des clés API ou des tokens d'authentification</li>
                    <li className="text-sm">Transmettre des informations confidentielles qui ne doivent être lues qu'une fois</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des secrets partagés</CardTitle>
              <CardDescription>Liste des secrets que vous avez créés</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : historySecrets.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">Aucun secret créé</div>
              ) : (
                <div className="space-y-4">
                  {historySecrets.map((secret) => {
                    const expired = isExpired(secret.expiration)
                    const baseUrl = window.location.origin
                    const secretUrl = `${baseUrl}/share/${secret.id}`

                    return (
                      <div key={secret.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2 ${expired ? 'opacity-60' : ''}`}>
                        <div>
                          <div className="font-medium">{secret.name || 'Secret sans nom'}</div>
                          <div className="text-xs text-muted-foreground">
                            Créé le {formatDate(secret.created_at)} • Expire le {formatDate(secret.expiration)}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground mt-1 truncate max-w-[300px]">{secretUrl}</div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                          <div className="flex flex-wrap gap-1">
                            {expired && (
                              <Badge variant="outline" className="bg-red-100 text-red-800">
                                Expiré
                              </Badge>
                            )}
                            {secret.is_one_time_use && (
                              <Badge variant="outline" className="bg-amber-100 text-amber-800">
                                Usage unique
                              </Badge>
                            )}
                            <Badge variant="outline">{formatContentSize(secret.content_size)}</Badge>
                          </div>
                          <Button variant="outline" size="sm" className="ml-auto" onClick={() => copyToClipboard(secretUrl)} disabled={expired}>
                            <Copy className="h-3 w-3 mr-1" />
                            Copier
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
