export interface Credential {
  id: string;
  title: string;
  note: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  last_read_at: string | null;
  custom_fields: Record<string, any> | null;
}

export interface CardCredential extends Credential {
  owner_name: string;
  cvc: number;
  expiration_date: string;
  card_number: string;
}

export interface PasswordCredential extends Credential {
  user_identifier: string;
  password: string;
  domain_name: string;
}

export interface SSHKeyCredential extends Credential {
  private_key: string;
  public_key: string;
  hostname: string | null;
  user_identifier: string | null;
}

export interface GetCredentialsResponse {
    credentials: (CardCredential | PasswordCredential | SSHKeyCredential)[],
    total: number,
    page: number,
    limit: number
}