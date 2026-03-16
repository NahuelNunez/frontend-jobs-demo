import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  postulacionesService,
  type ProviderSearchParams,
} from "../services/postulaciones.service";
import { toast } from "sonner";

// Query keys
export const postulacionesKeys = {
  all: ["postulaciones"] as const,
  detail: (id: string) => [...postulacionesKeys.all, id] as const,
  providers: (params: ProviderSearchParams) =>
    [...postulacionesKeys.all, "providers", params] as const,
};

// Hook para obtener todas las postulaciones
export const usePostulaciones = () => {
  return useQuery({
    queryKey: postulacionesKeys.all,
    queryFn: postulacionesService.getPostulaciones,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para obtener proveedores con paginación y filtros
export const useProvidersPaginated = (params: ProviderSearchParams) => {
  return useQuery({
    queryKey: postulacionesKeys.providers(params),
    queryFn: () => postulacionesService.getProvidersPaginated(params),
    placeholderData: keepPreviousData,
  });
};

// Hook para crear una postulación
export const useCreatePostulacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postulacionesService.postPostulacion,
    onSuccess: () => {
      toast.success("Postulación creada exitosamente");
      // Invalidar la lista de postulaciones para que se recargue
      queryClient.invalidateQueries({ queryKey: postulacionesKeys.all });
    },
    onError: (error) => {
      toast.error("Error al crear la postulación");
      console.error(error);
    },
  });
};
