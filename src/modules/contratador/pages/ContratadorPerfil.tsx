import { DashboardLayout } from "@/components/layout/DashboardLayout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Mail, Phone, MapPin, Save } from "lucide-react";

import { usePerfil } from "../hooks/usePerfil";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { US_STATES } from "@/lib/utils";

export const ContratadorPerfil = () => {
  const {
    isLoading,
    register,
    watch,
    setValue,
    errors,
    handleSubmit,
    isLoadingAddress,
    suggestions,
    selectSuggestion,
    data,
  } = usePerfil();

  const Fullname = watch("fullName");
  const state = watch("state");
  if (isLoading) {
    return (
      <DashboardLayout userType="CONTRACTOR">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div>
            <Skeleton className="h-9 w-48 mb-2 bg-[#D8D8D8]" />
            <Skeleton className="h-5 w-64 bg-[#D8D8D8]" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Avatar card skeleton */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Skeleton className="w-24 h-24 rounded-full bg-[#F8F8F8]" />
                    <Skeleton className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#D8D8D8]" />
                  </div>
                  <Skeleton className="h-6 w-32 mb-1 bg-[#D8D8D8]" />
                  <Skeleton className="h-4 w-20 mb-6 bg-[#D8D8D8]" />
                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 bg-[#D8D8D8]" />
                      <Skeleton className="h-4 w-40 bg-[#D8D8D8]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 bg-[#D8D8D8]" />
                      <Skeleton className="h-4 w-32 bg-[#D8D8D8]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 bg-[#D8D8D8]" />
                      <Skeleton className="h-4 w-36 bg-[#D8D8D8]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form card skeleton */}
            <Card className="md:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-40 bg-[#D8D8D8]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Form field skeletons */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-[#D8D8D8]" />
                        <Skeleton className="h-10 w-full bg-[#F8F8F8]" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-10 w-32 bg-[#F8F8F8]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="CONTRACTOR">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Avatar card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                      {Fullname?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="font-semibold text-lg">
                  {watch("username") || "User"}
                </h3>
                <p className="text-sm text-muted-foreground">Contractor</p>
                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {watch("email") || "Not specified"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {watch("phone") || "Not specified"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {watch("city") || "Not specified"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={watch("fullName")}
                      pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                      placeholder="Enter your full name"
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
                      <p className="text-red-500 text-sm">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={watch("username")}
                      pattern="[a-zA-Z0-9_\-]{3,20}"
                      placeholder="Enter your username"
                      {...register("username", {
                        required: "Username is required",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters",
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9_-]{3,20}$/,
                          message:
                            "Username can only contain letters, numbers, underscore and dash",
                        },
                      })}
                      className={errors.username ? "border-red-500" : ""}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={watch("email")}
                      pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                      placeholder="your@email.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                      disabled
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={watch("phone")}
                      pattern="[0-9]{10,15}"
                      placeholder="(555) 123-4567"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message:
                            "Please enter a valid phone number (10-15 digits)",
                        },
                      })}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={watch("address")}
                      pattern="[a-zA-Z0-9\\s,.-]+"
                      placeholder="123 Main Street"
                      {...register("address", {
                        required: "Address is required",
                        minLength: {
                          value: 5,
                          message: "Address must be at least 5 characters",
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9\s,.-]+$/,
                          message: "Address contains invalid characters",
                        },
                      })}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">
                        {errors.address.message}
                      </p>
                    )}
                    {isLoadingAddress && <span>searching...</span>}

                    {suggestions.length > 0 && (
                      <div className="border rounded-md mt-2 bg-white shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((suggest, index) => (
                          <div
                            className="text-sm hover:bg-gray-100 border-b last:border-0 p-3 cursor-pointer"
                            key={index}
                            onClick={() => selectSuggestion(suggest)}
                          >
                            <p>{suggest.properties.formatted}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {suggest.properties.city},
                              {suggest.properties.postcode}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      value={watch("city")}
                      pattern="[a-zA-Z\\s'-]+"
                      placeholder="Enter city name"
                      {...register("city", {
                        required: "City is required",
                        minLength: {
                          value: 2,
                          message: "City must be at least 2 characters",
                        },
                        pattern: {
                          value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.-]+$/,
                          message:
                            "City can only contain letters, spaces, dots and dashes",
                        },
                      })}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={watch("zipCode")}
                      pattern="[0-9]{5}(\-[0-9]{4})?"
                      placeholder="12345 or 12345-6789"
                      {...register("zipCode", {
                        required: "Zip code is required",
                        pattern: {
                          value: /^[0-9]{5}(-[0-9]{4})?$/,
                          message:
                            "Please enter a valid zip code (12345 or 12345-6789)",
                        },
                      })}
                      className={errors.zipCode ? "border-red-500" : ""}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
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
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
