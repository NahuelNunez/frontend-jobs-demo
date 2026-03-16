import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

import {
  Search,
  Star,
  MapPin,
  MessageCircle,
  Wrench,
  List,
  CircleSmall,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  usePostulaciones,
  useProvidersPaginated,
} from "../hooks/usePostulaciones";
import { StarRating } from "@/components/ui/star-rating";
import { RatingDialog } from "@/modules/rating/components/RatingDialog";

import {
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Drawer,
  DrawerClose,
} from "@/components/ui/drawer";
import type { ProviderSearchParams } from "../services/postulaciones.service";
import { Skeleton } from "@/components/ui/skeleton";
import {
  perfilServiceAuto,
  type Feature,
} from "@/modules/proveedor/services/autocomplete.service";
import { Pagination } from "@/components/ui/pagination";

const STATUS_OPTIONS = ["ACTIVE", "BUSY"] as const;
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "rating_desc", label: "Highest Rating" },
  { value: "rating_asc", label: "Lowest Rating" },
] as const;

const ITEMS_PER_PAGE = 10;

export const ContratadorPostulaciones = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filter values from URL
  const searchTerm = searchParams.get("search") || "";
  const categoriaFilter = searchParams.get("category") || "";
  const statusFilter = searchParams.get("status") || "";
  const locationFilter = searchParams.get("location") || "";
  const sortBy = searchParams.get("sort") || "default";
  const currentPage = Number(searchParams.get("page")) || 1;

  // Local state for input fields (pushed to URL on Enter/Apply)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localLocationFilter, setLocalLocationFilter] =
    useState(locationFilter);

  // Local-only state
  const [distance, setDistance] = useState([20]);
  const [suggestions, setSuggestions] = useState<Feature[]>([]);
  const [isLoadingAdress, setIsLoadingAddress] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Sync local inputs when URL changes (e.g. browser back/forward)
  useEffect(() => {
    setLocalSearchTerm(searchParams.get("search") || "");
    setLocalLocationFilter(searchParams.get("location") || "");
  }, [searchParams]);

  // Helper to update URL params (merges with existing)
  const updateSearchParams = (updates: Record<string, string>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
      }
      return next;
    });
  };

  // Build params for the paginated query
  const providerParams: ProviderSearchParams = {
    search: searchTerm || undefined,
    category: categoriaFilter || undefined,
    status: statusFilter || undefined,
    location: locationFilter || undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  };

  const {
    data: paginatedData,
    isLoading,
    isPlaceholderData,
    error: paginatedError,
  } = useProvidersPaginated(providerParams);

  // Fetch all providers for category list extraction
  const { data: allProvidersData } = usePostulaciones();

  const providers = paginatedData?.data ?? [];
  const totalItems = paginatedData?.total ?? 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Client-side sort on current page
  const sortedProviders = [...providers].sort((a, b) => {
    if (sortBy === "rating_desc") {
      return (b.averageRating || 0) - (a.averageRating || 0);
    }
    if (sortBy === "rating_asc") {
      return (a.averageRating || 0) - (b.averageRating || 0);
    }
    return 0;
  });

  // Handlers
  const handleSearch = () => {
    updateSearchParams({ search: localSearchTerm, page: "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenRatingDialog = (providerId: string, providerName: string) => {
    setSelectedProvider({ id: providerId, name: providerName });
    setRatingDialogOpen(true);
  };

  // Get available categories from all provider posts
  const getAvailableCategories = () => {
    if (!allProvidersData?.data) return [];
    const uniqueCategories = [
      ...new Set(
        allProvidersData.data.filter((p) => p.trade).map((p) => p.trade),
      ),
    ];
    return uniqueCategories;
  };

  const categorias = getAvailableCategories();

  // Address autocomplete debounce
  useEffect(() => {
    if (!localLocationFilter || localLocationFilter.length < 5) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoadingAddress(true);
      try {
        const data =
          await perfilServiceAuto.getAutocompleteAdress(localLocationFilter);

        if (data?.features && data.features.length > 0) {
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
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [localLocationFilter]);

  const selectedSuggestion = (feature: Feature) => {
    const selectedSuggest = feature.properties.formatted;
    setLocalLocationFilter(selectedSuggest);
    setSuggestions([]);
  };

  if (paginatedError) {
    return (
      <DashboardLayout userType="CONTRACTOR">
        <div className="text-center py-12">
          <p className="text-destructive">Error loading applications</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="CONTRACTOR">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Provider Applications</h1>
          <p className="text-muted-foreground">
            Explore all available provider service offers ({totalItems} total)
          </p>
        </div>

        <div className="flex flex-col  gap-4 ">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, service or description..."
                className="pl-10"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button onClick={handleSearch}>Search Posts</Button>
          </div>
          <div className="flex items-center gap-2">
            {/* Category*/}
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="flex items-center gap-2" variant="outline">
                  <Wrench />
                  <h2>Category</h2>
                  <ChevronDown />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="md:mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Categories</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4">
                    <RadioGroup
                      value={categoriaFilter}
                      onValueChange={(value) =>
                        updateSearchParams({ category: value, page: "" })
                      }
                      className="space-y-3"
                    >
                      <label className="flex items-center justify-between gap-2 text-sm cursor-pointer">
                        <span className="font-semibold md:text-lg">
                          All categories
                        </span>
                        <RadioGroupItem
                          value=""
                          className="data-[state=checked]:bg-gradient-hero data-[state=checked]:border-transparent data-[state=checked]:text-white"
                        />
                      </label>

                      {categorias.map((category) => (
                        <label
                          key={category}
                          className="flex items-center justify-between text-sm cursor-pointer"
                        >
                          <span className="font-semibold md:text-lg">
                            {category}
                          </span>
                          <RadioGroupItem
                            value={category}
                            className="data-[state=checked]:bg-gradient-primary data-[state=checked]:border-transparent data-[state=checked]:text-white"
                          />
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button>Apply</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
            {/* Status*/}
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="flex items-center gap-2" variant="outline">
                  <CircleSmall className="w-4 h-4" />
                  <h2>Status</h2>
                  <ChevronDown />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="md:mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Status</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4">
                    <RadioGroup
                      value={statusFilter}
                      onValueChange={(value) =>
                        updateSearchParams({ status: value, page: "" })
                      }
                      className="space-y-3"
                    >
                      <label className="flex items-center justify-between gap-2 text-sm cursor-pointer">
                        <span className="font-semibold md:text-lg">
                          All status
                        </span>
                        <RadioGroupItem
                          value=""
                          className="data-[state=checked]:bg-gradient-hero data-[state=checked]:border-transparent data-[state=checked]:text-white"
                        />
                      </label>

                      {STATUS_OPTIONS.map((status) => (
                        <label
                          key={status}
                          className="flex items-center justify-between text-sm cursor-pointer"
                        >
                          <span className="font-semibold md:text-lg">
                            {status}
                          </span>
                          <RadioGroupItem
                            value={status}
                            className="data-[state=checked]:bg-gradient-primary data-[state=checked]:border-transparent data-[state=checked]:text-white"
                          />
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button>Apply</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort by */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="flex items-center gap-2" variant="outline">
                  <List className="w-4 h-4" />
                  <h2>Sort by</h2>
                  <ChevronDown />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="md:mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Sort by</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4">
                    <RadioGroup
                      value={sortBy}
                      onValueChange={(value) =>
                        updateSearchParams({ sort: value })
                      }
                      className="space-y-3"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center justify-between text-sm cursor-pointer"
                        >
                          <span className="font-semibold md:text-lg">
                            {option.label}
                          </span>
                          <RadioGroupItem
                            value={option.value}
                            className="data-[state=checked]:bg-gradient-primary data-[state=checked]:border-transparent data-[state=checked]:text-white"
                          />
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button>Apply</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>

            {/* More filters*/}

            <Drawer>
              <DrawerTrigger asChild>
                <Button className="flex items-center gap-2" variant="outline">
                  <SlidersHorizontal className="w-4 h-4" />
                  <h2>More filters</h2>
                  <ChevronDown />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="md:mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>More Filters</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 space-y-6">
                    {/* Location Section */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Location</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter a location"
                          className="pl-10"
                          value={localLocationFilter}
                          onChange={(e) =>
                            setLocalLocationFilter(e.target.value)
                          }
                        />
                      </div>
                      {isLoadingAdress && (
                        <p>Searching for adress details...</p>
                      )}
                      {suggestions.length > 0 && (
                        <div className="border rounded-md mt-2 bg-white shadow-lg max-h-60 overflow-y-auto">
                          {suggestions.map((suggestions, index) => (
                            <div
                              key={index}
                              onClick={() => selectedSuggestion(suggestions)}
                              className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-0 transition-colors"
                            >
                              <p className="font-medium text-sm">
                                {suggestions.properties.formatted}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {suggestions.properties.city &&
                                  `${suggestions.properties.city}, `}
                                {suggestions.properties.postcode &&
                                  `${suggestions.properties.postcode}`}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Distance Section */}
                    <div className="space-y-4">
                      <label className="text-sm font-medium">Distance</label>
                      <Slider
                        value={distance}
                        onValueChange={setDistance}
                        min={5}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>5 miles</span>
                        <span className="font-semibold text-foreground">
                          {distance[0]} miles
                        </span>
                        <span>50 miles</span>
                      </div>
                    </div>
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button
                        onClick={() =>
                          updateSearchParams({
                            location: localLocationFilter,
                            page: "",
                          })
                        }
                      >
                        Apply
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {isLoading && !isPlaceholderData && (
          <div className="flex flex-col lg:flex-row items-center gap-5 justify-center">
            <Card className="hover:shadow-lg py-0 transition-shadow max-w-sm w-full">
              <CardContent className="p-2">
                <div className="flex flex-col gap-5">
                  {/* Video skeleton */}
                  <div className="relative rounded-2xl w-full max-w-sm mx-auto  bg-[#F8F8F8]">
                    <Skeleton className="w-[50%] aspect-9/16 rounded-2xl bg-[#F8F8F8]" />
                    <div className="absolute top-0 left-0 right-0 p-4 lg:p-6">
                      <Skeleton className="h-5 w-3/4 mb-2 bg-[#D8D8D8]" />
                      <Skeleton className="h-4 w-1/2 bg-[#D8D8D8]" />
                    </div>
                  </div>

                  {/* Profile section skeleton */}
                  <div className="flex flex-col justify-center items-center gap-2 lg:flex-1 lg:py-4">
                    <div className="flex items-center justify-center gap-4">
                      {/* Avatar skeleton */}
                      <Skeleton className="w-16 h-16 rounded-full bg-[#D8D8D8] hidden sm:flex" />
                      <div className="flex items-center min-w-0">
                        <div className="flex flex-col">
                          <Skeleton className="h-4 w-32 mb-2 bg-[#D8D8D8]" />
                          <Skeleton className="h-4 w-24 mb-2 bg-[#D8D8D8]" />
                        </div>
                        <div className="flex items-center ml-2 mb-17 lg:mb-17">
                          <Skeleton className="h-5 w-16 rounded-full bg-[#D8D8D8]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg hidden lg:flex py-0 transition-shadow max-w-sm w-full">
              <CardContent className="p-2">
                <div className="flex flex-col gap-5">
                  <div className="relative rounded-2xl w-full max-w-sm mx-auto  bg-[#F8F8F8]">
                    <Skeleton className="w-[50%] aspect-9/16 rounded-2xl bg-[#F8F8F8]" />
                    <div className="absolute top-0 left-0 right-0 p-4 lg:p-6">
                      <Skeleton className="h-5 w-3/4 mb-2 bg-[#D8D8D8]" />
                      <Skeleton className="h-4 w-1/2 bg-[#D8D8D8]" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-2 lg:flex-1 lg:py-4">
                    <div className="flex items-center justify-center gap-4">
                      <Skeleton className="w-16 h-16 rounded-full bg-[#D8D8D8] hidden sm:flex" />
                      <div className="flex items-center min-w-0">
                        <div className="flex flex-col">
                          <Skeleton className="h-4 w-32 mb-2 bg-[#D8D8D8]" />
                          <Skeleton className="h-4 w-24 mb-2 bg-[#D8D8D8]" />
                        </div>
                        <div className="flex items-center ml-2 mb-17 lg:mb-17">
                          <Skeleton className="h-5 w-16 rounded-full bg-[#D8D8D8]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg hidden xl:flex py-0 transition-shadow max-w-sm w-full">
              <CardContent className="p-2">
                <div className="flex flex-col gap-5">
                  <div className="relative rounded-2xl w-full max-w-sm mx-auto  bg-[#F8F8F8]">
                    <Skeleton className="w-[50%] aspect-9/16 rounded-2xl bg-[#F8F8F8]" />
                    <div className="absolute top-0 left-0 right-0 p-4 lg:p-6">
                      <Skeleton className="h-5 w-3/4 mb-2 bg-[#D8D8D8]" />
                      <Skeleton className="h-4 w-1/2 bg-[#D8D8D8]" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-2 lg:flex-1 lg:py-4">
                    <div className="flex items-center justify-center gap-4">
                      <Skeleton className="w-16 h-16 rounded-full bg-[#D8D8D8] hidden sm:flex" />
                      <div className="flex items-center min-w-0">
                        <div className="flex flex-col">
                          <Skeleton className="h-4 w-32 mb-2 bg-[#D8D8D8]" />
                          <Skeleton className="h-4 w-24 mb-2 bg-[#D8D8D8]" />
                        </div>
                        <div className="flex items-center ml-2 mb-17 lg:mb-17">
                          <Skeleton className="h-5 w-16 rounded-full bg-[#D8D8D8]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg hidden lg:flex py-0 transition-shadow max-w-sm w-full">
              <CardContent className="p-2">
                <div className="flex flex-col gap-5">
                  <div className="relative rounded-2xl w-full max-w-sm mx-auto  bg-[#F8F8F8]">
                    <Skeleton className="w-[50%] aspect-9/16 rounded-2xl bg-[#F8F8F8]" />
                    <div className="absolute top-0 left-0 right-0 p-4 lg:p-6">
                      <Skeleton className="h-5 w-3/4 mb-2 bg-[#D8D8D8]" />
                      <Skeleton className="h-4 w-1/2 bg-[#D8D8D8]" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-2 lg:flex-1 lg:py-4">
                    <div className="flex items-center justify-center gap-4">
                      <Skeleton className="w-16 h-16 rounded-full bg-[#D8D8D8] hidden sm:flex" />
                      <div className="flex items-center min-w-0">
                        <div className="flex flex-col">
                          <Skeleton className="h-4 w-32 mb-2 bg-[#D8D8D8]" />
                          <Skeleton className="h-4 w-24 mb-2 bg-[#D8D8D8]" />
                        </div>
                        <div className="flex items-center ml-2 mb-17 lg:mb-17">
                          <Skeleton className="h-5 w-16 rounded-full bg-[#D8D8D8]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!isLoading && sortedProviders.length > 0 && (
          <div
            className={
              isPlaceholderData
                ? "opacity-60 pointer-events-none transition-opacity"
                : ""
            }
          >
            {sortedProviders.map((postulacion) => (
              <Card
                key={postulacion.id}
                className="hover:shadow-lg py-0 transition-shadow max-w-sm mb-6"
              >
                <CardContent className="p-2">
                  <div className="flex flex-col  gap-5">
                    {postulacion.videoUrl && (
                      <div className="relative rounded-2xl w-full  max-w-sm   mx-auto lg:mb-0   shadow-2xl bg-black cursor-pointer">
                        <iframe
                          className="w-full h-full  object-cover aspect-9/16 lg:aspect-9/16 xl:aspect-9/16 overflow-hidden   rounded-2xl"
                          src={postulacion.videoUrl}
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />

                        <div className="absolute top-0 left-0 right-0 bg-linear-to-b rounded-2xl from-black/70 to-transparent p-4 lg:p-6 pointer-events-none">
                          <div className="text-white">
                            <h4 className="font-bold text-sm lg:text-lg xl:text-xl mb-1 lg:mb-2">
                              {postulacion.title}
                            </h4>
                            <p className="text-xs lg:text-sm xl:text-base opacity-90">
                              @{postulacion.username || postulacion.fullName}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col justify-center items-center gap-2 lg:flex-1 lg:py-4">
                      <div className="flex items-center justify-center gap-4 ">
                        <div className="w-16 h-16 lg:w-15 lg:h-15  rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xl lg:text-2xl font-bold shrink-0">
                          {postulacion?.fullName?.charAt(0) || "?"}
                        </div>
                        <div className="flex items-center min-w-0">
                          <div className="flex flex-col">
                            <p className="text-black text-[14px] font-medium mb-2 lg:text-lg">
                              {postulacion.fullName ||
                                "Name not available"}{" "}
                            </p>
                            <p className="text-[14px] text-muted-foreground font-medium mb-2 lg:text-lg">
                              {" "}
                              {postulacion.trade || "Specialty not specified"}
                            </p>
                          </div>
                          <div className="flex items-center ml-2  mb-17 lg:mb-17">
                            <Badge
                              variant={
                                postulacion.status === "ACTIVE"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-[12px]"
                            >
                              {postulacion.status === "ACTIVE"
                                ? "Available"
                                : "Busy"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-col lg:items-center lg:justify-between gap-5">
                        <div className="flex  gap-4 lg:gap-6">
                          <div className="flex items-center gap-2 text-sm lg:text-base">
                            <StarRating
                              rating={postulacion.averageRating || 0}
                              totalRatings={postulacion.totalRatings || 0}
                              size="sm"
                            />
                          </div>

                          <div className="flex items-center gap-2 text-sm lg:text-base text-muted-foreground">
                            <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                            {postulacion.city || "City not specified"}
                          </div>
                        </div>

                        <div className="flex gap-3 lg:gap-4 lg:shrink-0">
                          <Link
                            to={`/contractor/chats?postulacion=${postulacion.id}`}
                            className="flex-1 lg:flex-none"
                          >
                            <Button className="w-full lg:w-auto lg:px-8 lg:py-3 lg:text-base">
                              <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                              Contact
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            className="flex-1 lg:flex-none lg:px-8 lg:py-3 lg:text-base"
                            onClick={() =>
                              handleOpenRatingDialog(
                                postulacion.id || "",
                                postulacion.fullName || "Provider",
                              )
                            }
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
            ))}
          </div>
        )}

        {!isLoading && sortedProviders.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              No provider service offers found with the selected filters
            </p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Rating Dialog */}
        {selectedProvider && (
          <RatingDialog
            open={ratingDialogOpen}
            onOpenChange={setRatingDialogOpen}
            providerId={selectedProvider.id}
            providerName={selectedProvider.name}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
