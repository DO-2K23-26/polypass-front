import { PasswordCredential } from "@/types/credential"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "./ui/button"
import { Copy, FileText, MoreHorizontal } from "lucide-react"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu"
import { Badge } from "./ui/badge"
import { usePassword } from "@/lib/api/security"
import { useState } from "react"

interface PasswordCredentialProps {
    credential: PasswordCredential
}

export function PasswordCredentialCard({ credential }: PasswordCredentialProps) {
    const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({})
    
    const copyToClipboard = async (text: string, idPassword: string) => {
        try {
          await navigator.clipboard.writeText(text)
          await usePassword(idPassword)
          // Mettre à jour le compteur local
        //   setPasswordUsages(prev => ({
        //     ...prev,
        //     [idPassword]: (prev[idPassword] || 0) + 1
        //   }))
        } catch (error) {
          console.error('Erreur lors de la copie:', error)
        }
      }
      
    return (
        <Card
            key={credential.id}
            className={cn(
              "overflow-hidden",
            //   password.breached && "border-red-200",
            //   password.reused && "border-blue-200",
            //   password.old && "border-amber-200",
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {credential.title}
                    {/* {password.breached && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Identifiants compromis</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )} */}
                    {/* {password.reused && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <RefreshCw className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mot de passe réutilisé</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )} */}
                  </CardTitle>
                  <CardDescription>{credential.user_identifier}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => copyToClipboard(credential.user_identifier, credential.id)}>
                      Copier l'identifiant
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyToClipboard(credential.password, credential.id)}>
                      Copier le mot de passe
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuItem
                      onClick={() => {
                        setSelectedPassword(password)
                      }}
                    >
                      Voir les détails
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedPassword(password)
                        setShowShareDialog(true)
                      }}
                    >
                      Partager
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* <div className="mt-1 flex flex-wrap gap-1">
                <Badge variant="outline" className="bg-muted/50 text-xs" title={getFolderPath(password.folderId)}>
                  {getFolderName(password.folderId)}
                </Badge>
                {password.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {password.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{password.tags.length - 2}
                  </Badge>
                )}
              </div> */}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Mot de passe:</span>
                    <span className="text-sm">
                      {revealedPasswords[credential.password] ? "ExamplePass123" : credential.password}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => togglePasswordVisibility(credential.password)}
                    >
                      {revealedPasswords[password.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">
                        {revealedPasswords[password.id] ? "Masquer" : "Afficher"} le mot de passe
                      </span>
                    </Button> */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard("ExamplePass123", credential.password)}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copier le mot de passe</span>
                    </Button>
                  </div>
                </div>
                {/* <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Mis à jour: {password.lastUpdated}</span>
                  <Badge variant="outline" className={getStrengthColor(password.strength)}>
                    {password.strength === "strong" ? "Fort" : password.strength === "medium" ? "Moyen" : "Faible"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Nombre de vues :</span>
                  <span className="text-xs font-semibold">
                    {!isMounted || isLoadingUsages ? '...' : passwordUsages[password.id] ?? 0}
                  </span>
                </div> */}
                {credential.note && (
                  <div className="pt-2 flex items-center text-xs text-muted-foreground">
                    <FileText className="h-3 w-3 mr-1" />
                    Notes
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
    )
}