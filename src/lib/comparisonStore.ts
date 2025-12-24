// Product comparison store using localStorage
const COMPARISON_KEY = "fittrack_comparison";
const MAX_COMPARE_ITEMS = 4;

export const comparisonStore = {
  getItems: (): string[] => {
    const stored = localStorage.getItem(COMPARISON_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addItem: (productId: string): { items: string[]; added: boolean; error?: string } => {
    const items = comparisonStore.getItems();
    
    if (items.includes(productId)) {
      return { items, added: false, error: "Already in comparison" };
    }
    
    if (items.length >= MAX_COMPARE_ITEMS) {
      return { items, added: false, error: `Maximum ${MAX_COMPARE_ITEMS} items allowed` };
    }
    
    items.push(productId);
    localStorage.setItem(COMPARISON_KEY, JSON.stringify(items));
    return { items, added: true };
  },

  removeItem: (productId: string): string[] => {
    const items = comparisonStore.getItems().filter((id) => id !== productId);
    localStorage.setItem(COMPARISON_KEY, JSON.stringify(items));
    return items;
  },

  clearAll: (): void => {
    localStorage.removeItem(COMPARISON_KEY);
  },

  isInComparison: (productId: string): boolean => {
    return comparisonStore.getItems().includes(productId);
  },

  getCount: (): number => {
    return comparisonStore.getItems().length;
  },
};
