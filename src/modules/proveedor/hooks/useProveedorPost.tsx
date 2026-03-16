import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  perfilService,
  type ProfileResponse,
} from "../services/perfil.service";
import { perfilProveedorKeys } from "./useProveedorPerfil";

// Query keys
export const postProveedorKeys = {
  all: ["post-proveedor"] as const,
  list: () => [...postProveedorKeys.all, "list"] as const,
  detail: (id: string) => [...postProveedorKeys.all, "detail", id] as const,
};

export interface ProviderUploadVideo {
  title: string;
  category: string;
  videoUrl: File | null;
  estimatedPrice: number;
}

export const useProveedorPost = () => {
  const queryClient = useQueryClient();

  // Video states
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<ProviderUploadVideo>({
    defaultValues: {
      title: "",
      category: "",
      videoUrl: null,
      estimatedPrice: 0,
    },
  });

  const { data } = useQuery<ProfileResponse>({
    queryKey: perfilProveedorKeys.detail(),
    queryFn: perfilService.getPerfil,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  useEffect(() => {
    if (data?.success && data.data) {
      const { profile } = data.data;
      setVideoPreview(profile?.videoUrl ?? "");
      reset({
        title: profile?.title,
        category: profile?.category,

        estimatedPrice: 0,
      });
    }
  }, [data, reset]);

  useEffect(() => {
    // This effect will run when videoFile changes
    return () => {
      // Cleanup previous video preview URL when component unmounts or videoFile changes
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview, videoFile]);

  // Validation patterns
  const VALIDATION_PATTERNS = {
    title: {
      pattern: /^[a-zA-Z0-9\s\-.,&()]{5,100}$/,
      message:
        "Title must be between 5-100 characters and contain only letters, numbers, and basic punctuation",
    },
    description: {
      pattern: /^[a-zA-Z0-9\s\-.,&()!?'"]{20,1000}$/,
      message: "Description must be between 20-1000 characters",
    },
    video: {
      maxSize: 500 * 1024 * 1024, // 500MB
      maxSizeMessage: "Video must be smaller than 500MB",
      allowedFormats: ["video/mp4", "video/webm", "video/quicktime"],
      allowedFormatsMessage: "Only MP4, WebM, and MOV formats are allowed",
      minDuration: 5, // seconds
      minDurationMessage: "Video must be at least 5 seconds long",
      maxDuration: 60, // seconds (1 minute)
      maxDurationMessage: "Video cannot exceed 1 minute",
    },
  };

  // Mutation for creating post
  const createPostMutation = useMutation({
    mutationFn: async ({
      postData,
      videoUrl,
    }: {
      postData: ProviderUploadVideo;
      videoUrl: FormData;
    }) => {
      // uploadData es el FormData con el video
      // Step 1: Upload post information with video
      const postInformation = await perfilService.updateApliccation(postData);

      if (!postInformation.success) {
        throw new Error("Failed to create post information");
      }

      // Step 2: Upload to video endpoint if needed
      if (videoUrl) {
        const finalVideoResponse = await perfilService.updateVideo(videoUrl);

        if (!finalVideoResponse.success) {
          throw new Error("Failed to upload video");
        }

        return finalVideoResponse;
      }

      return postInformation;
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Post created successfully!", {
          description: "Your service is now visible to contractors.",
        });
        // Invalidate queries to refresh list
        queryClient.invalidateQueries({
          queryKey: postProveedorKeys.list(),
        });
        resetForm();
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      toast.error(errorMessage ? `${errorMessage}` : "Error creating post", {
        description: "Please try again later.",
      });
      console.error(error);
    },
    onSettled: () => {
      setIsLoadingVideo(false);
    },
  });

  const resetForm = () => {
    reset({
      title: "",
      category: "",
      estimatedPrice: 0,
    });
    setVideoPreview("");
    setVideoFile(null);
  };

  const handleVideoChange = (file: File | null) => {
    if (videoPreview) {
      setVideoPreview("");
    }
    if (!file) {
      setVideoFile(null);
      setVideoPreview("");

      return;
    }

    setVideoFile(file);
    const preview = URL.createObjectURL(file);
    setVideoPreview(preview);
  };

  const handleDeleteFile = () => {
    setVideoPreview("");
    setVideoFile(null);
  };
  const onSubmit = async (formData: ProviderUploadVideo) => {
    const videoFormData = new FormData();

    if (!videoFile) {
      toast.error("Please upload a video");
      return;
    }
    videoFormData.append("videoUrl", videoFile);

    // Validate video file
    const videoValidation = VALIDATION_PATTERNS.video;

    // Check file size
    if (videoFile.size > videoValidation.maxSize) {
      toast.error(videoValidation.maxSizeMessage);
      return;
    }

    // Check file format
    if (!videoValidation.allowedFormats.includes(videoFile.type)) {
      toast.error(videoValidation.allowedFormatsMessage);
      return;
    }

    // Append the actual File object

    // Pass FormData to mutation
    createPostMutation.mutate({ postData: formData, videoUrl: videoFormData });
  };

  return {
    isLoading: createPostMutation.isPending || isLoadingVideo,
    isLoadingVideo,
    videoPreview,
    videoFile,
    register,
    handleSubmit: handleFormSubmit(onSubmit),
    errors,
    watch,
    setValue,
    data,
    control,
    resetForm,
    VALIDATION_PATTERNS,
    handleVideoChange,
    handleDeleteFile,
    isCreating: createPostMutation.isPending,
  };
};
