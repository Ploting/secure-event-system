export interface RegisterForm {
  name: string;
  email: string;
  password: string;
};

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};