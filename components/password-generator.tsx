"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Copy, Check, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [passwordLength, setPasswordLength] = useState(12)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong">("medium")
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [generationType, setGenerationType] = useState<"random" | "memorable">("random")
  const [memorableOptions, setMemorableOptions] = useState({
    wordCount: 3,
    separator: "-",
    capitalize: true,
    includeNumber: true,
  })
  const [savedPasswords, setSavedPasswords] = useState<Array<{ password: string; strength: string; date: string }>>([])
  const [passwordName, setPasswordName] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  useEffect(() => {
    generatePassword()
  }, [])

  const generatePassword = () => {
    if (generationType === "memorable") {
      generateMemorablePassword()
    } else {
      generateRandomPassword()
    }
  }

  const generateRandomPassword = () => {
    let charset = "abcdefghijklmnopqrstuvwxyz"
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()"

    let newPassword = ""
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      newPassword += charset[randomIndex]
    }
    setPassword(newPassword)
    calculatePasswordStrength(newPassword)
  }

  const generateMemorablePassword = () => {
    // This is a simplified version - in a real app you'd use a word list
    const words = [
      "apple",
      "banana",
      "cherry",
      "date",
      "elderberry",
      "fig",
      "grape",
      "honeydew",
      "kiwi",
      "lemon",
      "mango",
      "nectarine",
      "orange",
      "papaya",
      "quince",
      "raspberry",
      "strawberry",
      "tangerine",
      "watermelon",
      "zucchini",
      "almond",
      "brazil",
      "cashew",
      "pecan",
      "walnut",
      "coffee",
      "donut",
      "eclair",
      "frosting",
      "gingerbread",
    ]

    const result = []

    for (let i = 0; i < memorableOptions.wordCount; i++) {
      let word = words[Math.floor(Math.random() * words.length)]

      if (memorableOptions.capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1)
      }

      result.push(word)
    }

    let newPassword = result.join(memorableOptions.separator)

    if (memorableOptions.includeNumber) {
      newPassword += memorableOptions.separator + Math.floor(Math.random() * 100)
    }

    setPassword(newPassword)
    calculatePasswordStrength(newPassword)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const savePassword = () => {
    if (passwordName.trim()) {
      const newSavedPassword = {
        name: passwordName,
        password: password,
        strength: passwordStrength,
        date: new Date().toLocaleDateString(),
      }
      setSavedPasswords([...savedPasswords, newSavedPassword])
      setSaved(true)
      setPasswordName("")
      setShowSaveDialog(false)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const calculatePasswordStrength = (pass: string) => {
    let strength: "weak" | "medium" | "strong" = "weak"
    if (pass.length >= 8) {
      strength = "medium"
      if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[!@#$%^&*()]/.test(pass)) {
        strength = "strong"
      }
    }
    setPasswordStrength(strength)
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

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Générateur de mot de passe</h2>
        <p className="text-muted-foreground">Créez des mots de passe forts et sécurisés</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Générateur</CardTitle>
              <CardDescription>Configurez et générez un mot de passe sécurisé</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="random" onValueChange={(value) => setGenerationType(value as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="random">Aléatoire</TabsTrigger>
                  <TabsTrigger value="memorable">Mémorisable</TabsTrigger>
                </TabsList>

                <TabsContent value="random" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="length">Longueur: {passwordLength}</Label>
                    </div>
                    <Slider
                      id="length"
                      min={6}
                      max={30}
                      step={1}
                      value={[passwordLength]}
                      onValueChange={(value) => setPasswordLength(value[0])}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                      <Label htmlFor="uppercase">Majuscules (A-Z)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                      <Label htmlFor="numbers">Chiffres (0-9)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                      <Label htmlFor="symbols">Symboles (!@#$)</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="memorable" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="wordCount">Nombre de mots: {memorableOptions.wordCount}</Label>
                    <Slider
                      id="wordCount"
                      min={2}
                      max={6}
                      step={1}
                      value={[memorableOptions.wordCount]}
                      onValueChange={(value) => setMemorableOptions({ ...memorableOptions, wordCount: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="separator">Séparateur</Label>
                    <Select
                      value={memorableOptions.separator}
                      onValueChange={(value) => setMemorableOptions({ ...memorableOptions, separator: value })}
                    >
                      <SelectTrigger id="separator">
                        <SelectValue placeholder="Choisir un séparateur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-">Tiret (-)</SelectItem>
                        <SelectItem value=".">Point (.)</SelectItem>
                        <SelectItem value="_">Underscore (_)</SelectItem>
                        <SelectItem value="#">Dièse (#)</SelectItem>
                        <SelectItem value="*">Astérisque (*)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="capitalize"
                        checked={memorableOptions.capitalize}
                        onCheckedChange={(checked) => setMemorableOptions({ ...memorableOptions, capitalize: checked })}
                      />
                      <Label htmlFor="capitalize">Première lettre en majuscule</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="includeNumber"
                        checked={memorableOptions.includeNumber}
                        onCheckedChange={(checked) =>
                          setMemorableOptions({ ...memorableOptions, includeNumber: checked })
                        }
                      />
                      <Label htmlFor="includeNumber">Ajouter un nombre à la fin</Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowSaveDialog(true)} disabled={!password}>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </Button>
              <Button onClick={generatePassword}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Générer
              </Button>
            </CardFooter>
          </Card>

          {showSaveDialog && (
            <Card>
              <CardHeader>
                <CardTitle>Sauvegarder le mot de passe</CardTitle>
                <CardDescription>Donnez un nom à ce mot de passe pour le retrouver facilement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="passwordName">Nom</Label>
                  <Input
                    id="passwordName"
                    placeholder="Ex: Compte Gmail"
                    value={passwordName}
                    onChange={(e) => setPasswordName(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={savePassword} disabled={!passwordName.trim()}>
                  Sauvegarder
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mot de passe généré</CardTitle>
              <CardDescription>Votre mot de passe sécurisé</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input value={password} readOnly className="pr-20 font-mono text-base h-12" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? "Copié" : "Copier"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className={getStrengthColor(passwordStrength)}>
                  {passwordStrength === "strong" ? "Fort" : passwordStrength === "medium" ? "Moyen" : "Faible"}
                </Badge>
                <span className="text-sm text-muted-foreground">{password.length} caractères</span>
              </div>

              {password && (
                <Alert
                  variant={
                    passwordStrength === "strong"
                      ? "default"
                      : passwordStrength === "medium"
                        ? "warning"
                        : "destructive"
                  }
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="capitalize">
                    Mot de passe{" "}
                    {passwordStrength === "strong" ? "fort" : passwordStrength === "medium" ? "moyen" : "faible"}
                  </AlertTitle>
                  <AlertDescription>
                    {passwordStrength === "strong"
                      ? "Ce mot de passe est sécurisé et difficile à craquer."
                      : passwordStrength === "medium"
                        ? "Ce mot de passe offre une sécurité modérée. Envisagez d'ajouter plus de complexité."
                        : "Ce mot de passe est facile à deviner. Ajoutez de la longueur et de la complexité."}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              {saved && (
                <div className="w-full text-center text-sm text-green-600">
                  <Check className="inline-block h-4 w-4 mr-1" />
                  Mot de passe sauvegardé avec succès
                </div>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mots de passe récents</CardTitle>
              <CardDescription>Historique des mots de passe générés et sauvegardés</CardDescription>
            </CardHeader>
            <CardContent>
              {savedPasswords.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">Aucun mot de passe sauvegardé</div>
              ) : (
                <div className="space-y-2">
                  {savedPasswords.map((savedPassword, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <div className="font-medium">{savedPassword.name}</div>
                        <div className="text-xs text-muted-foreground">Créé le {savedPassword.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStrengthColor(savedPassword.strength)}>
                          {savedPassword.strength === "strong"
                            ? "Fort"
                            : savedPassword.strength === "medium"
                              ? "Moyen"
                              : "Faible"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            navigator.clipboard.writeText(savedPassword.password)
                          }}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copier</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
