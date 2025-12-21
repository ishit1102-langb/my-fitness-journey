// Order history store using localStorage for persistence
const ORDERS_KEY = "fittrack_orders";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: "processing" | "shipped" | "delivered";
  createdAt: string;
  estimatedDelivery: string;
}

export const orderStore = {
  getOrders: (): Order[] => {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addOrder: (order: Omit<Order, "id" | "createdAt" | "estimatedDelivery" | "status">): Order => {
    const orders = orderStore.getOrders();
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}`,
      status: "processing",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    orders.unshift(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return newOrder;
  },

  getOrderById: (id: string): Order | undefined => {
    return orderStore.getOrders().find((o) => o.id === id);
  },

  // Simulate order status progression
  updateOrderStatus: (id: string): void => {
    const orders = orderStore.getOrders();
    const index = orders.findIndex((o) => o.id === id);
    
    if (index >= 0) {
      const currentStatus = orders[index].status;
      if (currentStatus === "processing") {
        orders[index].status = "shipped";
      } else if (currentStatus === "shipped") {
        orders[index].status = "delivered";
      }
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  },
};
