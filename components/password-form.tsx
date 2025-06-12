"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, Check, Copy, RefreshCw, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { Folder } from "@/types/folder"
import { Switch } from "@/components/ui/switch"

interface PasswordFormProps {
  onAddPassword: (password: any) => void
  folders: Folder[]
  onAddFolder: (name: string, parentId: string | null) => void
  onCancel: () => void
  allTags: string[]
}

export function PasswordForm({ onAddPassword, folders, onAddFolder, onCancel, allTags }: PasswordFormProps) {
  const [title, setTitle] = useState("")
  const [website, setWebsite] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordLength, setPasswordLength] = useState(12)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong">("medium")
  const [copied, setCopied] = useState(false)
  const [folderId, setFolderId] = useState("")
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [notes, setNotes] = useState("")
  const [customFields, setCustomFields] = useState<{ label: string; value: string; type: string }[]>([])
  const [newFieldLabel, setNewFieldLabel] = useState("")
  const [newFieldType, setNewFieldType] = useState("text")
  const [generationType, setGenerationType] = useState<"random" | "memorable">("random")
  const [memorableOptions, setMemorableOptions] = useState({
    wordCount: 3,
    separator: "-",
    capitalize: true,
    includeNumber: true,
  })

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

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddFolder = () => {
    if (newFolderName) {
      onAddFolder(newFolderName, newFolderParentId)
      const newId = newFolderName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36)
      setFolderId(newId)
      setNewFolderName("")
      setShowNewFolderInput(false)
    }
  }

  const addCustomField = () => {
    if (newFieldLabel) {
      setCustomFields([
        ...customFields,
        {
          label: newFieldLabel,
          value: "",
          type: newFieldType,
        },
      ])
      setNewFieldLabel("")
      setNewFieldType("text")
    }
  }

  const updateCustomField = (index: number, value: string) => {
    const updatedFields = [...customFields]
    updatedFields[index].value = value
    setCustomFields(updatedFields)
  }

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && username && password) {
      onAddPassword({
        title,
        website,
        username,
        password,
        strength: passwordStrength,
        folderId,
        tags,
        notes,
        customFields: customFields.length > 0 ? customFields : undefined,
      })
    }
  }

  // Group folders by parent for the select dropdown
  const getFolderGroups = () => {
    const rootFolders = folders.filter((f) => f.parentId === null)

    return rootFolders.map((rootFolder) => {
      const children = folders.filter((f) => f.parentId === rootFolder.id)
      return {
        parent: rootFolder,
        children,
      }
    })
  }

  // Get folder path for display
  const getFolderPath = (folder: Folder): string => {
    if (!folder.parentId) return folder.name

    const parent = folders.find((f) => f.id === folder.parentId)
    if (!parent) return folder.name

    return `${getFolderPath(parent)} / ${folder.name}`
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un mot de passe</CardTitle>
          <CardDescription>Enregistrez un nouveau mot de passe ou générez-en un sécurisé.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="generator">Générateur</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Nom</Label>
                  <Input
                    id="title"
                    placeholder="Mon site web"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    placeholder="example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Identifiant ou Email</Label>
                <Input
                  id="username"
                  placeholder="utilisateur@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="h-8 gap-1" onClick={generatePassword}>
                      <RefreshCw className="h-3.5 w-3.5" />
                      Générer
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={copyToClipboard}
                      disabled={!password}
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copié" : "Copier"}
                    </Button>
                  </div>
                </div>
                <Input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    calculatePasswordStrength(e.target.value)
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="folder">Dossier</Label>
                {showNewFolderInput ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        id="newFolderName"
                        placeholder="Nom du dossier"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={handleAddFolder} disabled={!newFolderName}>
                        Ajouter
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setShowNewFolderInput(false)}>
                        Annuler
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentFolder">Dossier parent (Optionnel)</Label>
                      <Select
                        value={newFolderParentId || ""}
                        onValueChange={(value) => setNewFolderParentId(value || null)}
                      >
                        <SelectTrigger id="parentFolder">
                          <SelectValue placeholder="Sélectionner un dossier parent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="root">Aucun parent (Niveau racine)</SelectItem>
                          {folders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {getFolderPath(folder)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Select value={folderId} onValueChange={setFolderId} className="flex-1">
                      <SelectTrigger id="folder">
                        <SelectValue placeholder="Sélectionner un dossier" />
                      </SelectTrigger>
                      <SelectContent>
                        {getFolderGroups().map((group) => (
                          <SelectGroup key={group.parent.id}>
                            <SelectLabel>{group.parent.name}</SelectLabel>
                            <SelectItem value={group.parent.id}>{group.parent.name}</SelectItem>
                            {group.children.map((child) => (
                              <SelectItem key={child.id} value={child.id} className="pl-6">
                                {child.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                        {folders
                          .filter((f) => !f.parentId && !getFolderGroups().some((g) => g.parent.id === f.id))
                          .map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" onClick={() => setShowNewFolderInput(true)}>
                      Nouveau
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="newTag"
                    placeholder="Ajouter un tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    list="existing-tags"
                  />
                  <datalist id="existing-tags">
                    {allTags.map((tag) => (
                      <option key={tag} value={tag} />
                    ))}
                  </datalist>
                  <Button type="button" variant="outline" onClick={addTag} disabled={!newTag}>
                    Ajouter
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                        >
                          <span className="sr-only">Supprimer {tag}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="generator" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Type de génération</Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="random-type" className="text-sm">
                      Aléatoire
                    </Label>
                    <Switch
                      id="password-type"
                      checked={generationType === "memorable"}
                      onCheckedChange={(checked) => setGenerationType(checked ? "memorable" : "random")}
                    />
                    <Label htmlFor="memorable-type" className="text-sm">
                      Mémorisable
                    </Label>
                  </div>
                </div>

                {generationType === "random" ? (
                  <div className="space-y-4 border rounded-lg p-4">
                    <h3 className="font-medium">Options du générateur</h3>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="uppercase"
                          checked={includeUppercase}
                          onChange={(e) => setIncludeUppercase(e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="uppercase" className="text-sm font-normal">
                          Majuscules (A-Z)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="numbers"
                          checked={includeNumbers}
                          onChange={(e) => setIncludeNumbers(e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="numbers" className="text-sm font-normal">
                          Chiffres (0-9)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="symbols"
                          checked={includeSymbols}
                          onChange={(e) => setIncludeSymbols(e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="symbols" className="text-sm font-normal">
                          Symboles (!@#$)
                        </Label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 border rounded-lg p-4">
                    <h3 className="font-medium">Options du mot de passe mémorisable</h3>
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
                        <input
                          type="checkbox"
                          id="capitalize"
                          checked={memorableOptions.capitalize}
                          onChange={(e) => setMemorableOptions({ ...memorableOptions, capitalize: e.target.checked })}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="capitalize" className="text-sm font-normal">
                          Première lettre en majuscule
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="includeNumber"
                          checked={memorableOptions.includeNumber}
                          onChange={(e) =>
                            setMemorableOptions({ ...memorableOptions, includeNumber: e.target.checked })
                          }
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="includeNumber" className="text-sm font-normal">
                          Ajouter un nombre à la fin
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <Button type="button" onClick={generatePassword} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Générer un mot de passe {generationType === "memorable" ? "mémorisable" : "aléatoire"}
                  </Button>
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
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Ajoutez des notes ou informations supplémentaires..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Champs personnalisés</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => {
                        setNewFieldLabel("")
                        setNewFieldType("text")
                        document.getElementById("newFieldLabel")?.focus()
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Ajouter un champ
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {customFields.map((field, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Label htmlFor={`field-${index}`} className="text-sm">
                            {field.label}{" "}
                            {field.type === "password" && <span className="text-muted-foreground">(masqué)</span>}
                          </Label>
                          <Input
                            id={`field-${index}`}
                            type={field.type}
                            value={field.value}
                            onChange={(e) => updateCustomField(index, e.target.value)}
                            placeholder={`Valeur pour ${field.label}`}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 mt-5"
                          onClick={() => removeCustomField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Supprimer le champ</span>
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end gap-2 mt-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="newFieldLabel">Nom du champ</Label>
                      <Input
                        id="newFieldLabel"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        placeholder="Ex: Numéro de carte"
                      />
                    </div>
                    <div className="w-[120px] space-y-2">
                      <Label htmlFor="newFieldType">Type</Label>
                      <Select value={newFieldType} onValueChange={setNewFieldType}>
                        <SelectTrigger id="newFieldType">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texte</SelectItem>
                          <SelectItem value="password">Mot de passe</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="url">URL</SelectItem>
                          <SelectItem value="number">Nombre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" onClick={addCustomField} disabled={!newFieldLabel} className="mb-0.5">
                      Ajouter
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={!title || !username || !password}>
            Enregistrer
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
