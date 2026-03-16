import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  perfilService,
  type UpdateProfileData,
  type PerfilProveedor,
  type ProfileResponse,
} from "../services/perfil.service";
import { perfilServiceAuto } from "../services/autocomplete.service";

// Query keys
export const perfilProveedorKeys = {
  all: ["perfil-proveedor"] as const,
  detail: () => [...perfilProveedorKeys.all, "detail"] as const,
};

export interface ProveedorPerfilFormData {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  trade: string;
  experience: string;
  description: string;
  address: string;
  city: string;
  zipCode: string;
  state: string;
}

export const useProveedorPerfil = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ProveedorPerfilFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      username: "",
      trade: "",
      experience: "",
      description: "",
      address: "",
      city: "",
      zipCode: "",
      state: "",
    },
  });

  // Query para obtener el perfil
  const { data, isLoading } = useQuery<ProfileResponse>({
    queryKey: perfilProveedorKeys.detail(),
    queryFn: perfilService.getPerfil,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Actualizar form cuando los datos cambien
  useEffect(() => {
    if (data?.success && data.data) {
      const { user, profile } = data.data;

      const proveedorPerfil = profile as PerfilProveedor;

      localStorage.setItem("username", proveedorPerfil.username || "");

      reset({
        fullName: proveedorPerfil?.fullName || "",
        email: user?.email || "",
        phone: proveedorPerfil?.phone || "",
        username: proveedorPerfil?.username || "",
        trade: proveedorPerfil?.trade || "",
        experience: proveedorPerfil?.experience?.toString() || "",
        description: proveedorPerfil?.description || "",
        address: proveedorPerfil?.address || "",
        city: proveedorPerfil?.city || "",
        state: proveedorPerfil?.state || "",
        zipCode: proveedorPerfil?.zipCode || "",
      });
    }
  }, [data, reset]);

  // Debounce para autocomplete de dirección
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const direccion = watch("address");
  const city = watch("city");
  const state = watch("state");
  const zipCode = watch("zipCode");

  useEffect(() => {
    // Solo ejecutar si hay una dirección con al menos 10 caracteres
    if (!direccion || direccion.length < 5) {
      setSuggestions([]);
      return;
    }

    if (!!city && !!zipCode && !!state) {
      setSuggestions([]);
      return;
    }

    // Debounce: esperar 800ms después de que el usuario deje de escribir
    const timeoutId = setTimeout(async () => {
      setIsLoadingAddress(true);
      try {
        const data = await perfilServiceAuto.getAutocompleteAdress(direccion);

        if (data?.features && data.features.length > 0) {
          // Guardar las primeras 2 sugerencias
          setSuggestions(data.features.slice(0, 2));
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching address data:", error);
        setSuggestions([]);
      } finally {
        setIsLoadingAddress(false);
      }
    }, 800); // 800ms de debounce

    // Cleanup: cancelar el timeout si el usuario sigue escribiendo
    return () => clearTimeout(timeoutId);
  }, [direccion]);

  // Función para seleccionar una sugerencia
  const selectSuggestion = (feature: any) => {
    const properties = feature.properties;

    // Autocompletar todos los campos
    if (properties.address_line1) {
      setValue("address", properties.address_line1);
    }

    if (properties.postcode) {
      setValue("zipCode", properties.postcode);
    }
    if (properties.state) {
      setValue("state", properties.state);
    }

    const city = properties.city || properties.town || properties.county;
    if (city) {
      setValue("city", city);
    }

    // Limpiar sugerencias
    setSuggestions([]);
    setIsLoadingAddress(false);
    toast.success("Address selected");
  };

  // Actualizar form cuando los datos cambien
  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => perfilService.updatePerfil(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Update profile succesfully");
        // Invalidar la query para refrescar los datos
        queryClient.invalidateQueries({
          queryKey: perfilProveedorKeys.detail(),
        });
      }
    },
    onError: (error) => {
      toast.error("Error update profile");
      console.error(error);
    },
  });

  const onSubmit = async (formData: ProveedorPerfilFormData) => {
    updateMutation.mutate({
      fullName: formData.fullName,
      username: formData.username,
      Email: formData.email,
      trade: formData.trade,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      address: formData.address,
      description: formData.description,
      experience: formData.experience,
    });
  };

  return {
    isLoading: isLoading || updateMutation.isPending,
    isLoadingAddress,
    suggestions,
    selectSuggestion,
    register,
    handleSubmit: handleFormSubmit(onSubmit),
    errors,
    watch,
    setValue,
    data,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
