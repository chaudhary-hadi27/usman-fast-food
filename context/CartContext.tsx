'use client';
import { createContext, useContext, useReducer, ReactNode } from 'react';

interface Item { _id: string; name: string; price: number; image: string; }
interface CartState { items: Item[]; total: number; }
type CartAction = { type: 'ADD_ITEM'; payload: Item } | { type: 'REMOVE_ITEM'; payload: string } | { type: 'CLEAR_CART' };

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload], total: state.total + action.payload.price };
    case 'REMOVE_ITEM':
      const filtered = state.items.filter(item => item._id !== action.payload);
      return { ...state, items: filtered, total: filtered.reduce((sum, item) => sum + item.price, 0) };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};