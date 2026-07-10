import api from "./axios"
import type { RegisterForm, RegisterResponse } from "../model/registerModel"

export const userRegister = async (form: RegisterForm) => {
    const response = await api.post<RegisterResponse>(
        "/api/auth/register", form
    );

    return response.data;
}