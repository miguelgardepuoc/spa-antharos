export interface AuthResponse {
  token: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
