export interface LoginRequest {
    userNameOrEmail: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    token: string;
}