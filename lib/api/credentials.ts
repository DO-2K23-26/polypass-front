import { CardCredential, GetCredentialsResponse, PasswordCredential, SSHKeyCredential } from "@/types/credential";

export async function getCredentials(folderId: string, type: 'password' | 'card' | 'sshkey'): Promise<(CardCredential | PasswordCredential | SSHKeyCredential)[]> {
  const baseUrl = process.env.NEXT_PUBLIC_ORGANIZATION_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${baseUrl}/folders/${folderId}/credentials/${type}?page=1&limit=100`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: null,
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des identifiants');
    }

    const data: GetCredentialsResponse = await response.json();

    return data.credentials.map((cred: any) => {
        if (type === 'password') {
            return {
                id: cred.id,
                title: cred.title,
                note: cred.note || null,
                created_at: cred.created_at,
                updated_at: cred.updated_at,
                expires_at: cred.expires_at || null,
                last_read_at: cred.last_read_at || null,
                custom_fields: cred.custom_fields || null,
                username: cred.username,
                password: cred.password,
                url: cred.url || null,
                user_identifier: cred.user_identifier || null,
                domain_name: cred.domain_name || null,
            } as PasswordCredential;
        } else if (type === 'card') {
            return {
                id: cred.id,
                title: cred.title,
                note: cred.note || null,
                created_at: cred.created_at,
                updated_at: cred.updated_at,
                expires_at: cred.expires_at || null,
                last_read_at: cred.last_read_at || null,
                custom_fields: cred.custom_fields || null,
                card_number: cred.card_number,
                card_holder: cred.card_holder,
                expiration_date: cred.expiration_date,
                cvv: cred.cvv,
                owner_name: cred.owner_name,
                cvc: cred.cvc,
            } as CardCredential;
        } else if (type === 'sshkey') {
            return {
                id: cred.id,
                title: cred.title,
                note: cred.note || null,
                created_at: cred.created_at,
                updated_at: cred.updated_at,
                expires_at: cred.expires_at || null,
                last_read_at: cred.last_read_at || null,
                custom_fields: cred.custom_fields || null,
                private_key: cred.private_key,
                public_key: cred.public_key,
                hostname: cred.hostname,
                user_identifier: cred.user_identifier,
            } as SSHKeyCredential;
        } else {
            throw new Error('Unknown credential type');
        }
    });
    } catch (error) {
        console.error('Erreur lors de la récupération des identifiants:', error);
        throw error;
    }
}

export async function getUserCredentials(userId: string, type?: 'all' | 'password' | 'card' | 'sshkey'): Promise<(CardCredential | PasswordCredential | SSHKeyCredential)[]> {
    const baseUrl = process.env.NEXT_PUBLIC_ORGANIZATION_URL || 'http://localhost:3001';
    
    try {
        const url = `${baseUrl}/users/credentials?user_id=${userId}` + (type ? `&type=${type}` : '');
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des identifiants de l\'utilisateur');
        }
    
        const data: (CardCredential | PasswordCredential | SSHKeyCredential)[] = await response.json();
    
        return data.map((cred: any) => {
            if (type === 'password') {
                return {
                    id: cred.id,
                    title: cred.title,
                    note: cred.note || null,
                    created_at: cred.created_at,
                    updated_at: cred.updated_at,
                    expires_at: cred.expires_at || null,
                    last_read_at: cred.last_read_at || null,
                    custom_fields: cred.custom_fields || null,
                    username: cred.username,
                    password: cred.password,
                    url: cred.url || null,
                    user_identifier: cred.user_identifier || null,
                    domain_name: cred.domain_name || null,
                } as PasswordCredential;
            } else if (type === 'card') {
                return {
                    id: cred.id,
                    title: cred.title,
                    note: cred.note || null,
                    created_at: cred.created_at,
                    updated_at: cred.updated_at,
                    expires_at: cred.expires_at || null,
                    last_read_at: cred.last_read_at || null,
                    custom_fields: cred.custom_fields || null,
                    card_number: cred.card_number,
                    card_holder: cred.card_holder,
                    expiration_date: cred.expiration_date,
                    cvv: cred.cvv,
                    owner_name: cred.owner_name,
                    cvc: cred.cvc,
                } as CardCredential;
            } else if (type === 'sshkey') {
                return {
                    id: cred.id,
                    title: cred.title,
                    note: cred.note || null,
                    created_at: cred.created_at,
                    updated_at: cred.updated_at,
                    expires_at: cred.expires_at || null,
                    last_read_at: cred.last_read_at || null,
                    custom_fields: cred.custom_fields || null,
                    private_key: cred.private_key,
                    public_key: cred.public_key,
                    hostname: cred.hostname,
                    user_identifier: cred.user_identifier,
                } as SSHKeyCredential;
            } else if (type === 'all') {
                throw new Error('Type "all" is not supported for user credentials. Please specify a type.');
            } else if (type === undefined) {
                return cred as (CardCredential | PasswordCredential | SSHKeyCredential);
            } else {
                throw new Error(`Unknown credential type '${type}'`);
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des identifiants de l\'utilisateur:', error);
        throw error;
    }
}

export async function createCredential(folderId: string, type: string, credentialData: any): Promise<CardCredential | PasswordCredential | SSHKeyCredential> {
    const baseUrl = process.env.NEXT_PUBLIC_ORGANIZATION_URL || 'http://localhost:3001';
    
    try {
        const response = await fetch(`${baseUrl}/folders/${folderId}/credentials/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentialData),
        });
    
        if (!response.ok) {
            throw new Error('Erreur lors de la création de l\'identifiant');
        }
    
        const data: CardCredential | PasswordCredential | SSHKeyCredential = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la création de l\'identifiant:', error);
        throw error;
    }
} 