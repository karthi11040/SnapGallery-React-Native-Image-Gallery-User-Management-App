export interface User {
  fullName: string;
  email: string;
  gender: string;
  mobileNumber: string;
  address: string;
  city: string;
  credits?: number;
  avatarUrl?: string;
}

export interface RememberedCreds {
  email: string;
  password?: string;
  rememberedAt: number;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  gender: string;
  mobileNumber: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberSession?: boolean;
}

export interface StoredUser extends User {
  passwordHash?: string;
  createdAt: string;
  credits?: number;
}

export interface AuthSession {
  userEmail: string;
  token: string;
  expiresAt: number;
}

