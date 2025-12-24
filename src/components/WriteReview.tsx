import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reviewStore } from "@/lib/reviewStore";
import { toast } from "@/hooks/use-toast";
import { sounds } from "@/lib/sounds";
import { haptics } from "@/lib/haptics";

interface WriteReviewProps {
  productId: string;
  productName: string;
  onReviewSubmitted: () => void;
}

export function WriteReview({ productId, productName, onReviewSubmitted }: WriteReviewProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userData = localStorage.getItem("fittrack_user");
  const user = userData ? JSON.parse(userData) : null;
  const hasPurchased = reviewStore.hasPurchased(productId);
  const hasReviewed = user ? reviewStore.hasReviewed(productId, user.name) : false;

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to write a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating.",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please write at least 10 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    reviewStore.addReview({
      productId,
      userName: user.name,
      rating,
      comment: comment.trim(),
      verified: hasPurchased,
    });

    sounds.success();
    haptics.success();
    toast({
      title: "Review submitted!",
      description: "Thank you for your feedback.",
    });

    setRating(0);
    setComment("");
    setIsSubmitting(false);
    onReviewSubmitted();
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Please log in to write a review.</p>
        </CardContent>
      </Card>
    );
  }

  if (hasReviewed) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">You have already reviewed this product.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Write a Review
          {hasPurchased && (
            <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasPurchased && (
          <p className="text-sm text-muted-foreground">
            Note: Reviews from verified purchasers are marked as such.
          </p>
        )}

        {/* Star Rating */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Your Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-warning text-warning"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Your Review</p>
          <Textarea
            placeholder={`Share your experience with ${productName}...`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">
            {comment.length}/500 characters
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </CardContent>
    </Card>
  );
}
