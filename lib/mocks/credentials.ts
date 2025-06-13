import { Credential } from '@/types/credential'

export const mockCredentials: Credential[] = [
  // Mots de passe faibles (3)
  {
    id: '1',
    title: 'Compte Gmail',
    username: 'john.doe@gmail.com',
    website: 'gmail.com',
    password: 'password123',
    lastUpdated: '2025-01-15'
  },
  {
    id: '2',
    title: 'Compte Facebook',
    username: 'john.doe',
    website: 'facebook.com',
    password: '12345678',
    lastUpdated: '2025-01-20'
  },
  {
    id: '3',
    title: 'Compte Twitter',
    username: '@johndoe',
    website: 'twitter.com',
    password: 'qwerty123',
    lastUpdated: '2025-01-25'
  },

  // Mots de passe identiques (2)
  {
    id: '4',
    title: 'Compte GitHub',
    username: 'johndoe',
    website: 'github.com',
    password: 'SecurePass123!',
    lastUpdated: '2025-01-10'
  },
  {
    id: '5',
    title: 'Compte GitLab',
    username: 'john.doe',
    website: 'gitlab.com',
    password: 'SecurePass123!',
    lastUpdated: '2025-01-12'
  },

  // Mots de passe forts (5)
  {
    id: '6',
    title: 'Compte AWS',
    username: 'john.doe@company.com',
    website: 'aws.amazon.com',
    password: 'Kj#9mP$2vL@5nX',
    lastUpdated: '2025-01-05'
  },
  {
    id: '7',
    title: 'Compte Azure',
    username: 'john.doe@company.com',
    website: 'portal.azure.com',
    password: 'P@ssw0rd!2024#Secure',
    lastUpdated: '2025-01-08'
  },
  {
    id: '8',
    title: 'Compte Google Cloud',
    username: 'john.doe@company.com',
    website: 'cloud.google.com',
    password: 'Str0ng!P@ssw0rd2024',
    lastUpdated: '2020-12-15' // Ancien mot de passe
  },
  {
    id: '9',
    title: 'Compte Digital Ocean',
    username: 'john.doe@company.com',
    website: 'digitalocean.com',
    password: 'C0mpl3x!P@ssw0rd#2024',
    lastUpdated: '2025-01-18'
  },
  {
    id: '10',
    title: 'Compte Heroku',
    username: 'john.doe@company.com',
    website: 'heroku.com',
    password: 'S3cur3!P@ssw0rd@2024',
    lastUpdated: '2025-01-22'
  }
] 