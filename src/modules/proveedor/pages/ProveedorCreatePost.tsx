import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MapPin, MessageCircle, Save, Star } from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout/DashboardLayout";
import { useProveedorPost } from "../hooks/useProveedorPost";
import { Controller } from "react-hook-form";
import { StarRating } from "@/components/ui/star-rating";

import { toast } from "sonner";

import {
  type PerfilProveedor,
  perfilService,
} from "../services/perfil.service";

export const ProveedorCreatePost = () => {
  const {
    isLoading,

    videoPreview,

    register,
    handleSubmit,
    errors,
    data,
    watch,

    VALIDATION_PATTERNS,

    handleVideoChange,
    control,
    handleDeleteFile,
  } = useProveedorPost();

  const [dataProvider, setDataProvider] = useState<PerfilProveedor>();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await perfilService.getPerfil();

        if (response.data && response.data.profile) {
          setDataProvider(response.data.profile);
        }
      } catch (error: any) {
        const msg =
          error.response?.data?.error || error.response?.data?.message;
        console.error(error);
        toast.error(msg);
      }
    };

    getProfile();
  }, []);

  console.log(dataProvider);

  return (
    <DashboardLayout userType="PROVIDER">
      <div className=" mx-auto  w-full">
        <div className="flex items-center justify-around flex-wrap gap-20 ">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Service Title *</Label>
                  <Input
                    id="titulo"
                    placeholder="Ex: Residential Plumbing"
                    {...register("title", {
                      required: "Service title is required",
                      pattern: {
                        value: VALIDATION_PATTERNS.title.pattern,
                        message: VALIDATION_PATTERNS.title.message,
                      },
                    })}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Controller
                    control={control}
                    name="category"
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <>
                        <Select
                          value={field.value || data?.data.profile?.category}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className={errors.category ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plumbing">Plumbing</SelectItem>
                            <SelectItem value="electrical">
                              Electrical
                            </SelectItem>
                            <SelectItem value="carpentry">Carpentry</SelectItem>
                            <SelectItem value="painting">Painting</SelectItem>
                            <SelectItem value="masonry">Masonry</SelectItem>
                            <SelectItem value="gardening">Gardening</SelectItem>
                            <SelectItem value="cleaning">Cleaning</SelectItem>
                            <SelectItem value="hvac">HVAC</SelectItem>
                            <SelectItem value="roofing">Roofing</SelectItem>
                            <SelectItem value="landscaping">
                              Landscaping
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <p className="text-sm text-red-500">
                            {errors.category.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>

                {/* 
              <div className="space-y-2">
                <Label htmlFor="descripcion">Service Description *</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe in detail the services you offer, your experience, certifications, etc."
                  rows={5}
                  {...register("descripcion", {
                    required: "Service description is required",
                    pattern: {
                      value: VALIDATION_PATTERNS.descripcion.pattern,
                      message: VALIDATION_PATTERNS.descripcion.message,
                    },
                  })}
                  className={errors.descripcion ? "border-red-500" : ""}
                />
                {errors.descripcion && (
                  <p className="text-sm text-red-500">
                    {errors.descripcion.message}
                  </p>
                )}
              </div> */}

                {/* <div className="grid gap-4 md:grid-cols-2"> */}
                {/* <div className="space-y-2">
                  <Label htmlFor="precioEstimado">Estimated Price ($) *</Label>
                  <Input
                    id="precioEstimado"
                    type="number"
                    placeholder="Ex: 150"
                    {...register("precioEstimado", {
                      required: "Estimated price is required",
                      min: {
                        value: 1,
                        message: "Price must be greater than 0",
                      },
                    })}
                    className={errors.precioEstimado ? "border-red-500" : ""}
                  />
                  {errors.precioEstimado && (
                    <p className="text-sm text-red-500">
                      {errors.precioEstimado.message}
                    </p>
                  )}
                </div> */}

                {/* <div className="space-y-2">
                  <Label htmlFor="ubicacion">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Ex: New York City"
                    {...register("location", {
                      required: "Location is required",
                      pattern: {
                        value: VALIDATION_PATTERNS.location.pattern,
                        message: VALIDATION_PATTERNS.location.message,
                      },
                    })}
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500">    
                      {errors.location.message}
                    </p>
                  )}
                </div> */}

                {/* <div className="space-y-2">
                  <Label htmlFor="disponibilidad">Availability</Label>
                  <Controller
                    name="availability"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || "immediate"}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="1-week">In 1 week</SelectItem>
                          <SelectItem value="2-weeks">In 2 weeks</SelectItem>
                          <SelectItem value="upon-request">
                            Upon request
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div> */}
                {/* </div> */}

                <div className="space-y-2">
                  <Label htmlFor="Video">Upload Video </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="videoInput"
                      type="file"
                      accept="video/*"
                      placeholder="Upload your video"
                      {...register("videoUrl", {
                        required: "Video is required",
                        onChange: (e) => {
                          const file = e.target.files[0] || null;
                          handleVideoChange(file);
                        },
                      })}
                      className={errors.videoUrl ? "border-red-500" : ""}
                    />
                    {errors.videoUrl && (
                      <p className="text-sm text-red-500">
                        {errors.videoUrl.message}
                      </p>
                    )}
                    <Button
                      type="button"
                      onClick={() => handleDeleteFile()}
                      className=""
                    >
                      Delete file
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Creating..." : "Publish Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg lg:w-3xl py-2 flex justify-center items-center transition-shadow ">
            <CardContent className="p-2 ">
              <div className="flex flex-col gap-5 ">
                {videoPreview ? (
                  <div className="relative rounded-2xl w-full  max-w-sm   mx-auto lg:mb-0   shadow-2xl bg-black cursor-pointer">
                    <iframe
                      className="w-full  object-cover aspect-9/16 overflow-hidden   rounded-2xl"
                      src={videoPreview}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />

                    <div className="absolute top-0 left-0 right-0 bg-linear-to-b rounded-2xl from-black/70 to-transparent p-4 lg:p-6 pointer-events-none">
                      <div className="text-white">
                        <h4
                          className={`font-bold text-sm  lg:text-lg xl:text-xl mb-1 lg:mb-2`}
                        >
                          {watch("title") || "Title"}
                        </h4>
                        <p className="text-xs lg:text-sm xl:text-base opacity-90">
                          @{dataProvider?.username || "User"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-background rounded-2xl p-8 md:w-[550px] md:h-[550px] flex justify-center items-center text-center">
                    <div className="flex flex-col p-10 gap-2">
                      <h1 className="text-2xl"> Preview your post</h1>
                      <span className="text-lg text-gray-400">
                        As you create your Post, you'll be able to see what it
                        will look like in VideoJobs.
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col justify-center items-center gap-2 lg:flex-1 lg:py-4">
                  <div className="flex items-center justify-center gap-4 ">
                    <div className="w-16 h-16 lg:w-15 lg:h-15 hidden rounded-full bg-gradient-primary sm:flex items-center justify-center text-primary-foreground text-xl lg:text-2xl font-bold shrink-0">
                      {dataProvider?.username?.charAt(0) || "?"}
                    </div>
                    <div className="flex items-center min-w-0">
                      <div className="flex flex-col">
                        <p className="text-black text-[14px] font-medium mb-2 lg:text-lg">
                          {dataProvider?.fullName || "Name not available"}{" "}
                        </p>
                        <p className="text-[14px] text-muted-foreground font-medium mb-2 lg:text-lg">
                          {" "}
                          {watch("category") || "Speciality not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-col lg:items-center lg:justify-between gap-5">
                    <div className="flex  gap-4 lg:gap-6">
                      <div className="flex items-center gap-2 text-sm lg:text-base">
                        <StarRating
                          rating={Number(dataProvider?.averageRating) || 0}
                          totalRatings={Number(dataProvider?.totalRatings) || 0}
                          size="sm"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-sm lg:text-base text-muted-foreground">
                        <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                        {dataProvider?.city || "City not specified"}
                      </div>
                    </div>

                    <div className="flex gap-3 lg:gap-4 lg:shrink-0">
                      <Button className="w-full lg:w-auto lg:px-8 lg:py-3 lg:text-base">
                        <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Contact
                      </Button>

                      <Button
                        variant="outline"
                        className="flex-1 lg:flex-none lg:px-8 lg:py-3 lg:text-base"
                      >
                        <Star className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                        Rate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
