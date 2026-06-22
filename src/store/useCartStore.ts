import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToastStore } from './useToastStore';

export interface Product {
  id: number | string;
  title: string;
  price: number;
  image: string;
  brand: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  wishlist: Product[];
  addItemToCart: (product: Product) => void;
  removeItemFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getWishlistCount: () => number;
  setWishlist: (wishlist: Product[]) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      isCartOpen: false,
      
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      
      addItemToCart: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          useToastStore.getState().addToast(`${product.title} added to cart`, 'success');
          return { items: [...state.items, { ...product, quantity: 1 }], isCartOpen: true };
        });
      },
      
      removeItemFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => 
            item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          )
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      toggleWishlist: (product) => {
        set((state) => {
          const exists = state.wishlist.find((item) => item.id === product.id);
          
          // Fire and forget API call if authenticated. 
          // We check if we're in the browser to avoid SSR issues.
          if (typeof window !== 'undefined') {
            fetch('/api/auth/session').then(res => res.json()).then(session => {
              if (session && Object.keys(session).length > 0) {
                fetch('/api/wishlist', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ productId: product.id })
                });
              }
            }).catch(() => {});
          }

          if (exists) {
            useToastStore.getState().addToast(`${product.title} removed from wishlist`, 'info');
            return { wishlist: state.wishlist.filter((item) => item.id !== product.id) };
          }
          useToastStore.getState().addToast(`${product.title} added to wishlist`, 'success');
          return { wishlist: [...state.wishlist, product] };
        });
      },
      
      setWishlist: (wishlist) => set({ wishlist }),
      
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      
      getWishlistCount: () => {
        return get().wishlist.length;
      },
    }),
    {
      name: 'besa-cart-storage',
    }
  )
);
