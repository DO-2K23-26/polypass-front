'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PasswordManager } from '@/components/password-manager'
import { SecurityDashboard } from '@/components/security-dashboard'
import { SharingCenter } from '@/components/sharing-center'
import { AdminPanel } from '@/components/admin-panel'
import { MainNav } from '@/components/main-nav'
import { UserNav } from '@/components/user-nav'
import { PasswordGenerator } from '@/components/password-generator'
import { OneTimePassword } from '@/components/one-time-password'

export function PasswordDashboard() {
  const [activeTab, setActiveTab] = useState('passwords')

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between w-full px-5">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <div className="container flex-1 py-6">
        <Tabs defaultValue="passwords" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="md:grid md:grid-cols-[200px_1fr] md:gap-8 lg:grid-cols-[220px_1fr] lg:gap-10">
            <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
              <div className="h-full py-6 px-4 lg:py-8">
                <TabsList className="flex h-auto w-full flex-col items-start justify-start bg-transparent p-0">
                  <TabsTrigger value="passwords" className="justify-start w-full px-4 py-2 text-sm font-medium border-0 data-[state=active]:border-0">
                    Mots de passe
                  </TabsTrigger>
                  <TabsTrigger value="generator" className="justify-start w-full px-4 py-2 text-sm font-medium border-0 data-[state=active]:border-0">
                    Générateur
                  </TabsTrigger>
                  <TabsTrigger value="one-time" className="justify-start w-full px-4 py-2 text-sm font-medium border-0 data-[state=active]:border-0">
                    Partage unique
                  </TabsTrigger>
                  <TabsTrigger value="security" className="justify-start w-full px-4 py-2 text-sm font-medium border-0 data-[state=active]:border-0">
                    Sécurité
                  </TabsTrigger>
                  <TabsTrigger value="sharing" className="justify-start w-full px-4 py-2 text-sm font-medium border-0 data-[state=active]:border-0">
                    Partage
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="justify-start w-full px-4 py-2 text-sm font-medium border-0 data-[state=active]:border-0">
                    Administration
                  </TabsTrigger>
                </TabsList>
              </div>
            </aside>
            <main className="flex w-full flex-col overflow-hidden">
              <TabsContent value="passwords" className="mt-0">
                <PasswordManager />
              </TabsContent>
              <TabsContent value="generator" className="mt-0">
                <PasswordGenerator />
              </TabsContent>
              <TabsContent value="one-time" className="mt-0">
                <OneTimePassword />
              </TabsContent>
              <TabsContent value="security" className="mt-0">
                <SecurityDashboard />
              </TabsContent>
              <TabsContent value="sharing" className="mt-0">
                <SharingCenter />
              </TabsContent>
              <TabsContent value="admin" className="mt-0">
                <AdminPanel />
              </TabsContent>
            </main>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
