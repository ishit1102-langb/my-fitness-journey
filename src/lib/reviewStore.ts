// User-submitted reviews store using localStorage
const REVIEWS_KEY = "fittrack_user_reviews";

export interface UserReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean; // Indicates if the user purchased this product
}

export const reviewStore = {
  getReviews: (): UserReview[] => {
    const stored = localStorage.getItem(REVIEWS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getProductReviews: (productId: string): UserReview[] => {
    return reviewStore.getReviews().filter((r) => r.productId === productId);
  },

  addReview: (review: Omit<UserReview, "id" | "date" | "helpful">): UserReview => {
    const reviews = reviewStore.getReviews();
    const newReview: UserReview = {
      ...review,
      id: `user-review-${Date.now()}`,
      date: new Date().toISOString(),
      helpful: 0,
    };
    reviews.unshift(newReview);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return newReview;
  },

  hasReviewed: (productId: string, userName: string): boolean => {
    return reviewStore.getReviews().some(
      (r) => r.productId === productId && r.userName === userName
    );
  },

  hasPurchased: (productId: string): boolean => {
    const ordersKey = "fittrack_orders";
    const stored = localStorage.getItem(ordersKey);
    if (!stored) return false;
    
    const orders = JSON.parse(stored);
    return orders.some((order: { items: { id: string }[] }) =>
      order.items.some((item) => item.id === productId)
    );
  },

  markHelpful: (reviewId: string): void => {
    const reviews = reviewStore.getReviews();
    const index = reviews.findIndex((r) => r.id === reviewId);
    if (index >= 0) {
      reviews[index].helpful += 1;
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    }
  },
};
