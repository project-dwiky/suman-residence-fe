export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
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
}

export interface UserUpdate {
  name?: string;
  phone?: string;
  role?: UserRole;
}

// Register data type extending UserCredentials
export interface RegisterData extends UserCredentials {
  name: string;
  phone: string;
}

// Response type for registration
export interface RegisterResponse {
  status: 'success' | 'error';
  message?: string;
}

