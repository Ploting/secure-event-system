import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../model/authModel";

type AuthContextValue = {
  token: string | null;
  user: JwtPayload | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthLoading: boolean;
  login: (token: string) => boolean;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<JwtPayload | null>(null);

  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const decodeAuthToken = (
    authToken: string
  ): JwtPayload | null => {
    try {
      const decoded = jwtDecode<JwtPayload>(authToken);

      if (!decoded.exp) {
        return null;
      }

      const isExpired =
        decoded.exp * 1000 <= Date.now();

      if (isExpired) {
        return null;
      }

      return decoded;
    } catch (error) {
      console.error("Cannot decode token:", error);
      return null;
    }
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const login = (newToken: string): boolean => {
    const decodedUser = decodeAuthToken(newToken);

    if (!decodedUser) {
      clearAuth();
      return false;
    }

    localStorage.setItem("token", newToken);

    setToken(newToken);
    setUser(decodedUser);

    return true;
  };

  const logout = () => {
    clearAuth();
  };

  useEffect(() => {
    try {
      if (!token) {
        setUser(null);
        return;
      }

      const decodedUser = decodeAuthToken(token);

      if (!decodedUser) {
        clearAuth();
        return;
      }

      setUser(decodedUser);
    } finally {
      setIsAuthLoading(false);
    }
  }, [token]);

  const value: AuthContextValue = {
    token,
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    isAuthLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}