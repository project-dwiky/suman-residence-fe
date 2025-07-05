export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
  isVerified?: boolean;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserCreate {
  email: string;
  name: string;
  phone: string;
  password: string;
  role: UserRole;
  isVerified?: boolean;
}

export interface UserUpdate {
  name?: string;
  phone?: string;
  role?: UserRole;
  isVerified?: boolean;
}

// Register data type extending UserCredentials
export interface RegisterData extends UserCredentials {
  name: string;
  phone: string;
}

// Response type for registration
export interface RegisterResponse {
  status: 'success' | 'error';
  code?: string;
  message?: string;
}

