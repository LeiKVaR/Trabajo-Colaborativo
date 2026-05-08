export type Role = "ADMIN" | "EMPLOYEE";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  status: "PENDING" | "ACTIVE" | "REJECTED" | "INACTIVE";
  position?: string;
  department?: string;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}