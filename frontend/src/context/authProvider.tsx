import { useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./authContext";
import type { JwtPayload } from "../model/authModel";

type AuthProviderProps = {
  children: ReactNode;
};

type AuthState = {
  token: string | null;
  user: JwtPayload | null;
};

function decodeValidToken(token: string): JwtPayload | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      return null;
    }

    const isExpired = decoded.exp * 1000 <= Date.now();

    if (isExpired) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

function getInitialAuthState(): AuthState {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    return {
      token: null,
      user: null,
    };
  }

  const decodedUser = decodeValidToken(storedToken);

  if (!decodedUser) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return {
      token: null,
      user: null,
    };
  }

  return {
    token: storedToken,
    user: decodedUser,
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<AuthState>(getInitialAuthState);

  const login = (newToken: string): boolean => {
    const decodedUser = decodeValidToken(newToken);

    if (!decodedUser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setAuth({
        token: null,
        user: null,
      });

      return false;
    }

    localStorage.setItem("token", newToken);

    setAuth({
      token: newToken,
      user: decodedUser,
    });

    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setAuth({
      token: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        isAuthenticated: auth.user !== null,
        isAdmin: auth.user?.role === "admin",
        isAuthLoading: false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}