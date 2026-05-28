import { create } from 'zustand';
import { Product } from '../lib/data';

type CartItem = Product & {
  quantity: number;
  selectedFlavor: string;
  selectedSize: string;
};

interface AppState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, flavor: string, size: string) => void;
  updateQuantity: (id: string, flavor: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
}

export const useStore = create<AppState>((set, get) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find(
        (i) => i.id === item.id && i.selectedFlavor === item.selectedFlavor && i.selectedSize === item.selectedSize
      );
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),
  removeFromCart: (id, flavor, size) =>
    set((state) => ({
      cart: state.cart.filter(
        (i) => !(i.id === id && i.selectedFlavor === flavor && i.selectedSize === size)
      ),
    })),
  updateQuantity: (id, flavor, size, quantity) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.id === id && i.selectedFlavor === flavor && i.selectedSize === size
          ? { ...i, quantity }
          : i
      ),
    })),
  clearCart: () => set({ cart: [] }),
  cartTotal: () => {
    return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
