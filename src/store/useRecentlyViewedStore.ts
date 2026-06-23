import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ViewedProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  viewedAt: number;
}

interface RecentlyViewedStore {
  viewedItems: ViewedProduct[];
  addViewedItem: (product: Omit<ViewedProduct, 'viewedAt'>) => void;
  clearHistory: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      viewedItems: [],
      
      addViewedItem: (product) => {
        const currentItems = get().viewedItems;
        // Remove it if it already exists to move it to the front
        const filteredItems = currentItems.filter(item => item.id !== product.id);
        
        const newItem = {
          ...product,
          viewedAt: Date.now()
        };
        
        // Add to front, keep max 12 items
        set({ viewedItems: [newItem, ...filteredItems].slice(0, 12) });
      },
      
      clearHistory: () => set({ viewedItems: [] }),
    }),
    {
      name: 'besa-recently-viewed',
    }
  )
);
