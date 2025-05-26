export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}