import { api } from "@/lib/api";

export interface PostulacionesResponse {
  id: string;
  proveedorId: string;
  title: string;

  category: string;
  estimatedPrice?: number;
  applicationCreatedAt: string;
  status: string;
  totalRatings: number;
  averageRating: number;

  usuarioId: string;
  fullName: string;
  username: string;
  trade: string;
  experience: number;
  description: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  videoUrl: string;
  videoThumbnailUrl: string;
  profileComplete: boolean;
  state: string;
  usuario: {
    id: string;
    email: string;
    rol: string;
  };
}

export interface PostulacionRequest {
  titulo: string;
  descripcion: string;
  categoria: string;
  precioEstimado: number;
  experiencia: string;
  location: string;
  availability: string;
  videos?: string[];
  chats?: string[];
}

export interface PostulacionResponse {
  data: PostulacionesResponse[];
}

export interface PaginatedPostulacionResponse {
  data: PostulacionesResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ProviderSearchParams {
  search?: string;
  category?: string;
  status?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export const postulacionesService = {
  getPostulaciones: async (): Promise<PostulacionResponse> => {
    const response = await api.get<PostulacionResponse>("/profile/providers");
    return response.data;
  },

  getPostulacionesByquery: async (
    search: string,
    category: string,
    status: string,
    location: string,
  ): Promise<PostulacionResponse> => {
    const response = await api.get<PostulacionResponse>("/profile/providers", {
      params: {
        search: search,
        category: category,
        status: status,
        location: location,
      },
    });
    return response.data;
  },

  getProvidersPaginated: async (
    params: ProviderSearchParams,
  ): Promise<PaginatedPostulacionResponse> => {
    const response = await api.get<PaginatedPostulacionResponse>(
      "/profile/providers",
      {
        params: {
          search: params.search || undefined,
          category: params.category || undefined,
          status: params.status || undefined,
          location: params.location || undefined,
          page: params.page || 1,
          limit: params.limit || 10,
        },
      },
    );
    return response.data;
  },

  postPostulacion: async (
    data: PostulacionRequest,
  ): Promise<PostulacionesResponse> => {
    const response = await api.post<PostulacionesResponse>(
      "/postulaciones/",
      data,
    );
    return response.data;
  },
};
