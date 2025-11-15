'use client';
import { useState, useEffect } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity?: number;
}

const CART_STORAGE_KEY = 'usman_fast_food_cart';
const MAX_ITEM_QUANTITY = 20;

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveCart(cart);
    }
  }, [cart, isLoading]);

  const loadCart = () => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCart(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCart = (cartData: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
      
      // Dispatch event for cross-tab sync
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cartData }));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number = 1): boolean => {
    const existingIndex = cart.findIndex(i => i._id === item._id);
    
    if (existingIndex >= 0) {
      const existing = cart[existingIndex];
      const newQuantity = existing.quantity + quantity;
      
      if (newQuantity > MAX_ITEM_QUANTITY) {
        return false; // Max quantity reached
      }
      
      const newCart = [...cart];
      newCart[existingIndex] = { ...existing, quantity: newQuantity };
      setCart(newCart);
    } else {
      if (quantity > MAX_ITEM_QUANTITY) {
        return false;
      }
      setCart([...cart, { ...item, quantity }]);
    }
    
    return true;
  };

  const removeItem = (itemId: string) => {
    setCart(cart.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number): boolean => {
    if (quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
      return false;
    }
    
    setCart(cart.map(item => 
      item._id === itemId ? { ...item, quantity } : item
    ));
    
    return true;
  };

  const incrementQuantity = (itemId: string): boolean => {
    const item = cart.find(i => i._id === itemId);
    if (!item || item.quantity >= MAX_ITEM_QUANTITY) {
      return false;
    }
    
    return updateQuantity(itemId, item.quantity + 1);
  };

  const decrementQuantity = (itemId: string): boolean => {
    const item = cart.find(i => i._id === itemId);
    if (!item) return false;
    
    if (item.quantity <= 1) {
      removeItem(itemId);
      return true;
    }
    
    return updateQuantity(itemId, item.quantity - 1);
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemCount = (): number => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotal = (): number => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const isInCart = (itemId: string): boolean => {
    return cart.some(item => item._id === itemId);
  };

  const getItemQuantity = (itemId: string): number => {
    const item = cart.find(i => i._id === itemId);
    return item?.quantity || 0;
  };

  return {
    cart,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getItemCount,
    getTotal,
    isInCart,
    getItemQuantity,
  };
}