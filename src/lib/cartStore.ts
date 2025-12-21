// Simple cart store using localStorage for persistence
export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  sport: string;
  quantity: number;
}

const CART_KEY = "fittrack_cart";

export const cartStore = {
  getCart: (): CartItem[] => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addItem: (item: Omit<CartItem, "quantity">): CartItem[] => {
    const cart = cartStore.getCart();
    const existingIndex = cart.findIndex((i) => i.id === item.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  },

  updateQuantity: (id: string, quantity: number): CartItem[] => {
    const cart = cartStore.getCart();
    const index = cart.findIndex((i) => i.id === id);
    
    if (index >= 0) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = quantity;
      }
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  },

  removeItem: (id: string): CartItem[] => {
    const cart = cartStore.getCart().filter((i) => i.id !== id);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
  },

  clearCart: (): void => {
    localStorage.removeItem(CART_KEY);
  },

  getTotal: (): number => {
    return cartStore.getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: (): number => {
    return cartStore.getCart().reduce((sum, item) => sum + item.quantity, 0);
  },
};
