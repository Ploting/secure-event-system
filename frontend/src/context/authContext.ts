import { createContext } from "react";
import type { JwtPayload } from "../model/authModel";

export const AuthContext = createContext<{
  token: string | null;
  user: JwtPayload | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthLoading: boolean;
  login: (token: string) => boolean;
  logout: () => void;
} | undefined>(undefined);