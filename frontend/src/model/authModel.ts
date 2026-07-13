type UserRole = "user" | "admin";

export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
