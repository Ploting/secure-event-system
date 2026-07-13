import { useEffect, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./authContext";
import type { JwtPayload } from "../model/authModel";

type AuthProviderProps = {
  children: ReactNode;
};

function decodeValidToken(token: string): JwtPayload | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      return null;
    }

    if (decoded.exp * 1000 <= Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsAuthLoading(false);
      return;
    }

    const decodedUser = decodeValidToken(token);

    if (!decodedUser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(null);
      setUser(null);
      setIsAuthLoading(false);
      return;
    }

    setUser(decodedUser);
    setIsAuthLoading(false);
  }, [token]);

  const login = (newToken: string): boolean => {
    const decodedUser = decodeValidToken(newToken);

    if (!decodedUser) {
      return false;
    }

    localStorage.setItem("token", newToken);

    setToken(newToken);
    setUser(decodedUser);

    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: user !== null,
        isAdmin: user?.role === "admin",
        isAuthLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
