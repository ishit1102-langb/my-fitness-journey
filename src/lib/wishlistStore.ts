// Wishlist store using localStorage for persistence
const WISHLIST_KEY = "fittrack_wishlist";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  sport: string;
  addedAt: string;
}

export const wishlistStore = {
  getWishlist: (): WishlistItem[] => {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addItem: (item: Omit<WishlistItem, "addedAt">): WishlistItem[] => {
    const wishlist = wishlistStore.getWishlist();
    const exists = wishlist.some((i) => i.id === item.id);
    
    if (!exists) {
      wishlist.push({ ...item, addedAt: new Date().toISOString() });
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
    
    return wishlist;
  },

  removeItem: (id: string): WishlistItem[] => {
    const wishlist = wishlistStore.getWishlist().filter((i) => i.id !== id);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    return wishlist;
  },

  isInWishlist: (id: string): boolean => {
    return wishlistStore.getWishlist().some((i) => i.id === id);
  },

  toggleItem: (item: Omit<WishlistItem, "addedAt">): { wishlist: WishlistItem[]; added: boolean } => {
    const isIn = wishlistStore.isInWishlist(item.id);
    if (isIn) {
      return { wishlist: wishlistStore.removeItem(item.id), added: false };
    } else {
      return { wishlist: wishlistStore.addItem(item), added: true };
    }
  },
};
