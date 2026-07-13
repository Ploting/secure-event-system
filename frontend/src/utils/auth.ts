import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: number;
  email: string;
  role: "user" | "admin";
  iat: number;
  exp: number;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeAuthStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Cannot decode token:", error);
    return null;
  }
}

export function isTokenExpired(token: string) {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      return true;
    }

    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function getCurrentUser(): JwtPayload | null {
  const token = getToken();

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    removeAuthStorage();
    return null;
  }
  return decodeToken(token);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
