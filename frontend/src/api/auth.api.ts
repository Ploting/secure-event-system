import api from "../api/axios"
import type { RegisterForm, RegisterResponse } from "../types/auth"

export const userRegister = async (form: RegisterForm) => {
    const response = await api.post<RegisterResponse>(
        "/api/auth/register", form
    );

    return response.data;
}