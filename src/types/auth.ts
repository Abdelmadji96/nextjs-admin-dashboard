export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    user_type: string;
  };
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: number;
  reference: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type: string;
  signed_token: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  email_verified_at: string | null;
  owner: string | null;
  admin_type: string;
}

export interface ProfileResponse {
  user: User;
  extra: Record<string, any>;
}

