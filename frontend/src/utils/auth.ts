import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: number;
  email: string;
  role: "user" | "admin";
  iat: number;
  exp: number;
};

export function getToken() {
  return localStorage.getItem("token");
}

export function removeAuthStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
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

export function isAuthenticated() {
  const token = getToken();

  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    removeAuthStorage();
    return false;
  }

  return true;
}