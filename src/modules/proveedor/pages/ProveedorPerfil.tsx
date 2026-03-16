import { DashboardLayout } from "@/components/layout/DashboardLayout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Mail,
  Phone,
  MapPin,
  Save,
  Briefcase,
  IdCard,
  IdCardLanyard,
  Share2,
  MessageSquare,
  User,
  CheckCircle2,
  Play,
  ChevronLeft,
  StarIcon,
} from "lucide-react";
import { useProveedorPerfil } from "../hooks/useProveedorPerfil";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { US_STATES } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";

export const ProveedorPerfil = () => {
  const {
    isLoading,
    isLoadingAddress,
    suggestions,
    selectSuggestion,
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    data,
  } = useProveedorPerfil();
  console.log(data);
  const fullName = watch("fullName");
  const state = watch("state");

  const states = US_STATES.find((states) => states.name === state);

  const shortTerm = states?.shortName;

  if (isLoading) {
    return (
      <DashboardLayout userType="PROVIDER">
        <Spinner />
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout userType="PROVIDER">
      <div className="w-full  space-y-6">
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your professional information
          </p>
        </div>

        <div className="flex gap-40 justify-evenly w-full flex-wrap  ">
          {/* Avatar card */}
          {/* <Card className="lg:h-1/2 xl:w-xs lg:w-[280px]">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                      {fullName?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="font-semibold text-lg">{fullName}</h3>
                <Badge className="mt-1 text-[#2563EB] bg-[#EFF6FF]">
                  {watch("trade") || "No specialty"}
                </Badge>
                <div className=" border-b border-border w-full mt-3"></div>
                {/* Rating */}
          {/* <div className="w-full flex items-center justify-between mt-4">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <StarRating
                      rating={Number(data?.data.profile?.averageRating) || 0}
                      totalRatings={Number(data?.data.profile?.totalRatings) || 0}
                      size="md"
                    />
                  </div>

                  <div className="w-full mt-2 space-y-3">
                    <div className="flex items-center gap-2 text-sm justify-between font-semibold">
                      <div className="flex items-center gap-2  text-muted-foreground">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>Email</span>
                      </div>
                      {watch("email")}
                    </div>
                    <div className="flex items-center gap-2 text-sm justify-between font-semibold">
                      <div className="flex items-center gap-2  text-muted-foreground">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>Phone</span>
                      </div>
                      {watch("phone") || "Not specified"}
                    </div>
                    <div className="flex items-center gap-2 justify-between text-sm font-semibold">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>Location</span>
                      </div>
                      {watch("city") || "Not specified"}
                    </div>
                    <div className="flex items-center gap-2 justify-between text-sm font-semibold">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="w-4 h-4 " /> <span>Experience</span>
                      </div>
                      {watch("experience") || "Not specified"} years
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

          {/* Form card */}
          <Card className="md:col-span-2 max-w-2xl md:max-h-[950px] lg:max-h-[950px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold">
                <IdCard className="text-[#2563EB]"></IdCard>
                Professional Information
              </CardTitle>
            </CardHeader>
            <div className="border-border border-b w-full"></div>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 text-end">
                <div className="flex flex-col w-full gap-5">
                  <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="nombreCompleto" className="font-bold">
                        Full name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombreCompleto"
                        {...register("fullName", {
                          required: "Full name is required",
                          minLength: {
                            value: 3,
                            message: "Name must be at least 3 characters",
                          },
                          pattern: {
                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                            message: "Name can only contain letters",
                          },
                        })}
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-500">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="nombreUsuario" className="font-bold">
                        Username
                      </Label>
                      <Input
                        id="nombreUsuario"
                        {...register("username", {
                          minLength: {
                            value: 3,
                            message: "Minimum 3 characters",
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message: "Only letters, numbers and underscores",
                          },
                        })}
                        className={errors.username ? "border-red-500" : ""}
                      />
                      {errors.username && (
                        <p className="text-sm text-red-500">
                          {errors.username.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="border-border border-b w-full"></div>
                  <div className="flex items-center gap-2 text-sm">
                    <IdCardLanyard className="text-[#2563EB]"></IdCardLanyard>{" "}
                    <p className="uppercase font-bold">Contact Details</p>
                  </div>
                  <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="email" className="font-bold">
                        Email address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        disabled
                      />
                    </div>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="telefono" className="font-bold">
                        Phone <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="telefono"
                        {...register("phone", {
                          required: "Phone is required",
                          pattern: {
                            value: /^[0-9+\-\s()]+$/,
                            message: "Invalid phone format",
                          },
                          minLength: {
                            value: 8,
                            message: "Minimum 8 characters",
                          },
                        })}
                        placeholder="+54 11 1234-5678"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="border-border border-b w-full"></div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-[#2563EB]"></Briefcase>
                    <p className="uppercase text-sm font-bold">
                      work experience
                    </p>
                  </div>
                  <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="rubro" className="font-bold">
                        Trade/Specialty <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="rubro"
                        {...register("trade", {
                          required: "Trade is required",
                          minLength: {
                            value: 3,
                            message: "Minimum 3 characters",
                          },
                        })}
                        placeholder="E.g: Plumbing, Electrical, Carpentry"
                        className={errors.trade ? "border-red-500" : ""}
                      />
                      {errors.trade && (
                        <p className="text-sm text-red-500">
                          {errors.trade.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="experiencia" className="font-bold">
                        Years of experience{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="experiencia"
                        type="number"
                        {...register("experience", {
                          required: "Experience is required",
                          min: {
                            value: 0,
                            message: "Cannot be negative",
                          },
                          max: {
                            value: 80,
                            message: "Maximum 80 years",
                          },
                        })}
                        placeholder="5"
                        className={errors.experience ? "border-red-500" : ""}
                      />
                      {errors.experience && (
                        <p className="text-sm text-red-500">
                          {errors.experience.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="border-border border-b w-full"></div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-[#2563EB]"></MapPin>
                    <p className="uppercase font-bold text-sm"> address</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="direccion" className="font-bold">
                      Street Address
                      {isLoadingAddress && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (searching...)
                        </span>
                      )}
                    </Label>
                    <Input
                      id="direccion"
                      {...register("address", {
                        minLength: {
                          value: 5,
                          message: "Minimum 5 characters",
                        },
                      })}
                      placeholder="123 Main St"
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">
                        {errors.address.message}
                      </p>
                    )}
                    {isLoadingAddress && (
                      <p className="text-xs text-blue-500">
                        Searching for address details...
                      </p>
                    )}
                    {/* Sugerencias de autocompletado */}
                    {suggestions.length > 0 && (
                      <div className="border rounded-md mt-2 bg-white shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => selectSuggestion(suggestion)}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors"
                          >
                            <p className="font-medium text-sm">
                              {suggestion.properties.formatted}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {suggestion.properties.city &&
                                `${suggestion.properties.city}, `}
                              {suggestion.properties.postcode &&
                                `${suggestion.properties.postcode}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="ciudad" className="font-bold">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="ciudad"
                        {...register("city", {
                          required: "City is required",
                          minLength: {
                            value: 2,
                            message: "Minimum 2 characters",
                          },
                        })}
                        placeholder="New York"
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="codigoPostal" className="font-bold">
                        Postal Code
                      </Label>
                      <Input
                        id="codigoPostal"
                        {...register("zipCode", {
                          pattern: {
                            value: /^[0-9]{4,10}$/,
                            message: "Invalid postal code (4-10 digits)",
                          },
                        })}
                        placeholder="1234"
                        className={errors.zipCode ? "border-red-500" : ""}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-red-500">
                          {errors.zipCode.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="state" className="font-bold">
                        State
                      </Label>
                      <Select
                        value={state || data?.data.profile?.state}
                        onValueChange={(value) => {
                          setValue("state", value);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          side="bottom"
                          className="h-[300px] bg-[#F5F7FA]"
                        >
                          <SelectGroup>
                            <SelectLabel className="font-semibold">
                              States
                            </SelectLabel>
                            {US_STATES.map((states) => (
                              <SelectItem key={states.id} value={states.name}>
                                {states.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="border-border border-b w-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-full flex justify-between items-center">
                    <Label htmlFor="descripcion" className="font-bold">
                      Professional description{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {watch("description")?.length || 0}/500 characters
                    </p>
                  </div>
                  <Textarea
                    id="descripcion"
                    rows={4}
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 20,
                        message: "Description must be at least 20 characters",
                      },
                      maxLength: {
                        value: 500,
                        message: "Maximum 500 characters",
                      },
                    })}
                    placeholder="Describe your experience, services you offer, certifications, etc."
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Save changes
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="p-4 space-y-4 md:w-2xl xl:w-2xl">
            {/* Video Introduction Card */}
            <Card className="overflow-hidden bg-gray-900 border-0">
              <div className="relative aspect-video">
                {data?.data.profile.videoUrl ? (
                  <iframe
                    className="w-full h-full object-cover"
                    src={data.data.profile.videoUrl}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <span className="text-white text-sm font-medium">
                    Video Introduction
                  </span>
                </div>
              </div>
            </Card>

            {/* Profile Info Card */}
            <Card className="py-6">
              <CardContent className="flex flex-col items-center text-center">
                {/* Share button */}
                <div className="w-full flex justify-end -mt-2 mb-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full hover:cursor-pointer transition-colors">
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Avatar */}
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 ">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-3xl font-bold text-white bg-gradient-primary">
                      {fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white"></div>
                </div>

                {/* Name and Username */}
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {fullName}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  @{watch("username") || fullName.replace(/\s+/g, "")}
                </p>

                {/* Tags Row */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  {watch("trade") && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1"
                    >
                      {watch("trade")}
                    </Badge>
                  )}
                  {data?.data.profile?.averageRating ? (
                    <Badge
                      variant="outline"
                      className="bg-white border-gray-200 px-3 py-1"
                    >
                      <StarIcon className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-medium">
                        {data.data.profile.averageRating || 0}
                      </span>
                      <span className="text-gray-500 ml-1">
                        ({Number(data.data.profile.totalRatings)}{" "}
                        {Number(data.data.profile.totalRatings) === 1
                          ? "review"
                          : "reviews"}
                        )
                      </span>
                    </Badge>
                  ) : (
                    ""
                  )}
                  {state && (
                    <Badge
                      variant="outline"
                      className="bg-white border-gray-200 px-3 py-1"
                    >
                      <MapPin className="w-3.5 h-3.5 text-gray-500 mr-1" />
                      {state}
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button className="flex-1 bg-green-500 hover:bg-green-600">
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Professional Summary Card */}
            <Card className="py-4">
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    Professional Summary
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {watch("description") || "No description available."}
                </p>
              </CardContent>
            </Card>

            {/* Experience & Location Row */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="py-4">
                <CardContent>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Experience
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {watch("experience") || 0} Years
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="py-4">
                <CardContent>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Location
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {watch("city") && watch("state")
                      ? `${watch("city")}, ${shortTerm}`
                      : "Not specified"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Details Card */}
            <Card className="py-4">
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    Contact Details
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Phone */}
                  {watch("phone") && (
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">
                            {watch("phone")}
                          </p>
                        </div>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
                    </div>
                  )}

                  {/* Email - Using username as placeholder since email isn't in profile */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">
                          {watch("username")
                            ? `${watch("email")}`
                            : "Not available"}
                        </p>
                      </div>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
                  </div>

                  {/* Address */}
                  {watch("address") && (
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="font-medium text-gray-900">
                            {watch("address")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {watch("city")}, {state} {watch("zipCode")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
