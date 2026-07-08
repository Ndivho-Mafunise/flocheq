export type Role = "admin" | "user" | "guest";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  user?: User;
}
