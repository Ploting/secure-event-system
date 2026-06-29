export type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};