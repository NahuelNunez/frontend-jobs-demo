import { DashboardLayout } from "@/components/layout/DashboardLayout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { StarRating } from "@/components/ui/star-rating";
import { useQuery } from "@tanstack/react-query";
import { ratingService } from "../services/rating.service";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";

export const ProviderRatingsPage = () => {
  const { providerId } = useParams<{ providerId: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["provider-ratings", providerId],
    queryFn: () => ratingService.getProviderRatings(providerId!),
    enabled: !!providerId,
  });

  const { data: summaryData } = useQuery({
    queryKey: ["rating-summary", providerId],
    queryFn: () => ratingService.getRatingSummary(providerId!),
    enabled: !!providerId,
  });

  if (isLoading) {
    return (
      <DashboardLayout userType="CONTRACTOR">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data?.data) {
    return (
      <DashboardLayout userType="CONTRACTOR">
        <div className="text-center py-12">
          <p className="text-destructive">Error al cargar las calificaciones</p>
        </div>
      </DashboardLayout>
    );
  }

  const { provider, ratings } = data.data;
  const summary = summaryData?.data;

  return (
    <DashboardLayout userType="CONTRACTOR">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Calificaciones de {provider.fullName}
          </h1>
          <p className="text-muted-foreground">
            Opiniones de contratadores que trabajaron con este proveedor
          </p>
        </div>

        {/* Summary Card */}
        {summary && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Average Rating */}
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {summary.averageRating.toFixed(1)}
                  </div>
                  <StarRating
                    rating={summary.averageRating}
                    size="lg"
                    showNumber={false}
                    className="justify-center mb-2"
                  />
                  <p className="text-muted-foreground">
                    {summary.totalRatings} calificaciones
                  </p>
                </div>

                {/* Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count =
                      summary.distribution[
                        stars as keyof typeof summary.distribution
                      ];
                    const percentage =
                      summary.totalRatings > 0
                        ? (count / summary.totalRatings) * 100
                        : 0;

                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm font-medium">{stars}</span>
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ratings List */}
        <div className="space-y-4">
          {ratings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Este proveedor aún no tiene calificaciones
              </CardContent>
            </Card>
          ) : (
            ratings.map((rating) => (
              <Card key={rating.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {rating.contractor.fullName ||
                          rating.contractor.username}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(rating.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      <StarRating
                        rating={rating.rating}
                        showNumber={true}
                        size="sm"
                        className="gap-1"
                      />
                    </Badge>
                  </div>
                </CardHeader>
                {rating.comment && (
                  <CardContent>
                    <p className="text-muted-foreground">{rating.comment}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
