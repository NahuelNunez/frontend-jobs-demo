import { api } from "@/lib/api";
import type { User } from "@/modules/auth/services/auth.service";

export interface PerfilContratador {
  id: string;
  usuarioId: string;
  fullName: string | null;
  username: string | null;
  cuit: string | null;
  address: string | null;
  city: string | null;
  zipCode: string | null;
  phone: string | null;
  state: string | null;
}

export interface ProfileResponse {
  success: boolean;
  data: {
    user: User;
    profile: PerfilContratador | null;
  };
}

export interface UpdateProfileData {
  fullName?: string;
  username?: string;
  cuit?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  state?: string;
  phone?: string;
  rubro?: string;
  experiencia?: number;
  descripcion?: string;
}

export const perfilService = {
  getPerfil: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>("/profile");
    return response.data;
  },

  updatePerfil: async (data: UpdateProfileData): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>("/profile", data);
    return response.data;
  },
};
