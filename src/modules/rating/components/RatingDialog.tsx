import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RatingInput } from "@/components/ui/rating-input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ratingService } from "../services/rating.service";
import { toast } from "sonner";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerId: string;
  providerName: string;
  existingRating?: {
    rating: number;
    comment?: string;
  };
}

export function RatingDialog({
  open,
  onOpenChange,
  providerId,
  providerName,
  existingRating,
}: RatingDialogProps) {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [comment, setComment] = useState(existingRating?.comment || "");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      ratingService.createOrUpdateRating(providerId, rating, comment),
    onSuccess: () => {
      toast.success(
        existingRating ? "Calificación actualizada" : "Calificación enviada"
      );
      queryClient.invalidateQueries({ queryKey: ["provider-ratings", providerId] });
      queryClient.invalidateQueries({ queryKey: ["my-rating", providerId] });
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Error al enviar la calificación"
      );
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingRating ? "Editar" : "Calificar"} a {providerName}
          </DialogTitle>
          <DialogDescription>
            {existingRating
              ? "Actualiza tu calificación para este proveedor"
              : "Comparte tu experiencia con este proveedor"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Calificación *</Label>
            <RatingInput
              value={rating}
              onChange={setRating}
              size="lg"
              disabled={mutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comentario (opcional)</Label>
            <Textarea
              id="comment"
              placeholder="Cuéntanos sobre tu experiencia con este proveedor..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
              disabled={mutation.isPending}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/500 caracteres
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending
              ? "Enviando..."
              : existingRating
              ? "Actualizar"
              : "Enviar calificación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

