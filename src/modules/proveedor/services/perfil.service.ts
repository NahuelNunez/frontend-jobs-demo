import { api } from "@/lib/api";
import type { User } from "@/modules/auth/services/auth.service";

export interface PerfilProveedor {
  id: string;
  usuarioId: string;
  fullName: string;
  username: string | null;
  trade: string | null;
  experience: number | null;
  description: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  zipCode: string | null;
  state: string | null;
  profileComplete: boolean;
  title: string;
  category: string;
  videoUrl: string | null;
  videoKey: string;
  videoMimeType: string;
  videoThumbnailUrl: string;
  averageRating: string;
  totalRatings: string;
}
export interface updateProfilePost {
  title: string;
  category: string;

  estimatedPrice?: number;
}

export interface updateVideoPost {
  video: [];
}
export interface profileResponseVideo {
  videoUrl?: string;
  videoKey?: string;
  videoThumbnailUrl?: string;
  videoMimeType?: string;
  videoDurationSeconds?: number;
}
export interface ProfileResponse {
  success: boolean;
  data: {
    user: User;
    profile: PerfilProveedor | null;
  };
}

export interface UpdateProfileData {
  fullName?: string;
  username: string;
  Email: string;
  trade: string;
  address?: string;
  phone: string;
  zipCode?: string;
  state?: string;
  city?: string;
  description: string;
  experience: string;
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

  updateApliccation: async (
    data: updateProfilePost
  ): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>(
      "/profile/proveedor/postulacion",
      {
        title: data.title,
        category: data.category,
        estimatedPrice: data.estimatedPrice,
      }
    );
    return response.data;
  },
  updateVideo: async (data: any) => {
    const response = await api.put<ProfileResponse>(
      "/profile/proveedor/postulacion/video",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
