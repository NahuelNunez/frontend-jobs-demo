import axios from "axios";
import { api } from "@/lib/api";

const API_URL = import.meta.env.VITE_URL || "http://localhost:3000/api/v1";

export interface RegisterData {
  email: string;
  password: string;
  role: "CONTRACTOR" | "PROVIDER" | "ADMIN";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  creadoEn?: string;
  actualizadoEn?: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
      refreshToken,
    });
    return response.data;
  },

  async verifyEmail(token: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/verify-email`, {
      token,
    });
    return response.data;
  },

  async resendVerifyEmail(email: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/resend-verification`, {
      email,
    });
    return response.data;
  },

  async getCurrentUser(): Promise<{ success: boolean; data: User }> {
    // Usa la instancia api que tiene el interceptor para agregar el token automáticamente
    // y manejar el refresh token si es necesario
    const response = await api.get("/auth/me");
    return response.data;
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean }> {
    // Usa la instancia api que tiene el interceptor para agregar el token automáticamente
    const response = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
    return response.data;
  },
};
