export interface LoginParams {
  admin: {
    email: string;
    password: string;
  };
}

export interface LoginResponse {
  name: string;
  email: string;
  roles: string[];
}

export interface AdminState {
  name: string;
  email: string;
  roles: string[];
}
