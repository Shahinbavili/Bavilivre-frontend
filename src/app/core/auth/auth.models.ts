export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
}

export interface UserDto {
  id: number;
  displayName: string;
  email: string;
}
