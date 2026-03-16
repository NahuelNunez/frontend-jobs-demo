import { api } from "@/lib/api";

export interface Rating {
  id: string;
  providerId: string;
  contractorProfileId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  contractor: {
    id: string;
    fullName: string;
    username: string;
  };
}

export interface RatingSummary {
  averageRating: number;
  totalRatings: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ProviderRatingsResponse {
  provider: {
    id: string;
    fullName: string;
    averageRating: number;
    totalRatings: number;
  };
  ratings: Rating[];
}

export const ratingService = {
  /**
   * Crear o actualizar una calificación
   */
  async createOrUpdateRating(
    providerId: string,
    rating: number,
    comment?: string
  ) {
    const response = await api.post("/ratings", {
      providerId,
      rating,
      comment,
    });
    return response.data;
  },

  /**
   * Obtener todas las calificaciones de un proveedor
   */
  async getProviderRatings(providerId: string) {
    const response = await api.get<{
      success: boolean;
      data: ProviderRatingsResponse;
    }>(`/ratings/${providerId}`);
    return response.data;
  },

  /**
   * Obtener mi calificación para un proveedor
   */
  async getMyRatingForProvider(providerId: string) {
    const response = await api.get<{ success: boolean; data: Rating | null }>(
      `/ratings/${providerId}/my-rating`
    );
    return response.data;
  },

  /**
   * Obtener resumen de calificaciones
   */
  async getRatingSummary(providerId: string) {
    const response = await api.get<{ success: boolean; data: RatingSummary }>(
      `/ratings/${providerId}/summary`
    );
    return response.data;
  },

  /**
   * Eliminar una calificación
   */
  async deleteRating(providerId: string) {
    const response = await api.delete(`/ratings/${providerId}`);
    return response.data;
  },
};
