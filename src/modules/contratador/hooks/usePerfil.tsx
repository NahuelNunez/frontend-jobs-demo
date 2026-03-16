import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  perfilService,
  type UpdateProfileData,
  type PerfilContratador,
  type ProfileResponse,
} from "../services/perfil.service";

import { useForm } from "react-hook-form";
import { perfilServiceAuto } from "@/modules/proveedor/services/autocomplete.service";

// Re-export types for backward compatibility
export type { PerfilContratador, ProfileResponse, UpdateProfileData };

// Query keys
export const perfilKeys = {
  all: ["perfil"] as const,
  detail: () => [...perfilKeys.all, "detail"] as const,
};

export interface SubmitHandlerInputs {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export const usePerfil = () => {
  const queryClient = useQueryClient();
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [suggestions, setSuggestions] = useState<any>([]);
  const {
    register,
    handleSubmit: handlerSubmiter,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SubmitHandlerInputs>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      username: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });
  const address = watch("address");

  const city = watch("city");
  const state = watch("state");
  const zipCode = watch("zipCode");
  // Query para obtener el perfil
  const { data, isLoading } = useQuery<ProfileResponse>({
    queryKey: perfilKeys.detail(),
    queryFn: perfilService.getPerfil,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Actualizar formData cuando los datos cambien
  useEffect(() => {
    if (data?.success && data.data) {
      const { user, profile } = data.data;

      reset({
        fullName: profile?.fullName || "",
        email: user?.email || "",
        phone: profile?.phone || "",
        username: profile?.username || "",
        address: profile?.address || "",
        city: profile?.city || "",
        state: profile?.state || "",
        zipCode: profile?.zipCode || "",
      });
    }
  }, [data, reset]);

  useEffect(() => {
    if (!address || address.length < 5) {
      setSuggestions([]);
      return;
    }

    if (!!city && !!state && !!zipCode) {
      setSuggestions([]);
      return;
    }

    const timeOutId = setTimeout(async () => {
      setIsLoadingAddress(true);
      try {
        const response = await perfilServiceAuto.getAutocompleteAdress(address);

        if (response.features && response.features.length > 0) {
          setSuggestions(response.features.slice(0, 2));
          return;
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching address data:", error);
        setSuggestions([]);
      } finally {
        setIsLoadingAddress(false);
      }
    }, 800);

    return () => clearTimeout(timeOutId);
  }, [address, city, state, zipCode]);

  const selectSuggestion = (data: any) => {
    const properties = data.properties;

    if (properties.address_line1) {
      setValue("address", properties.address_line1);
    }

    const city = properties.city || properties.town || properties.county;
    if (city) {
      setValue("city", city);
    }
    if (properties.state) {
      setValue("state", properties.state);
    }
    if (properties.postcode) {
      setValue("zipCode", properties.postcode);
    }
    setIsLoadingAddress(false);
    setSuggestions([]);
    toast.success("Address Selected");
  };
  // Mutation para actualizar el perfil
  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => perfilService.updatePerfil(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Update profile succesfully");
        // Invalidar la query para refrescar los datos
        queryClient.invalidateQueries({ queryKey: perfilKeys.detail() });
      }
    },
    onError: (error) => {
      toast.error("Error update profile");
      console.error(error);
    },
  });

  const onSubmit = async (formData: SubmitHandlerInputs) => {
    updateMutation.mutate({
      fullName: formData.fullName,
      phone: formData.phone,
      username: formData.username,
      address: formData.address,
      city: formData.city,
      zipCode: formData.zipCode,
      state: formData.state,
    });
  };

  return {
    isLoading: isLoading || updateMutation.isPending,
    watch,
    register,
    handleSubmit: handlerSubmiter(onSubmit),
    data,
    errors,
    isLoadingAddress,
    suggestions,
    selectSuggestion,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    setValue,
  };
};
