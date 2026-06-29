import type { LoginRequest, LoginResponse } from "../model/loginModel";
import api from "./axios";

export const userLogin = async (form: LoginRequest) => {
  const response = await api.post<LoginResponse>(
    "/api/auth/login",
    form
  );

  return response.data;
};