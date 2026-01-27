// hooks/useCart.ts - FIXED VERSION (No infinite loops!)
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  category?: string;
}

const CART_STORAGE_KEY = 'cart';
const MAX_ITEM_QUANTITY = 20;

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialMount = useRef(true);

  // Load cart from localStorage on mount ONLY
  useEffect(() => {
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
  }, []); // Empty dependency - runs once on mount

  // Save cart to localStorage whenever it changes (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        
        // Dispatch custom event for cross-component sync
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { cart, count: cart.reduce((sum, item) => sum + item.quantity, 0) }
        }));
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    }
  }, [cart, isLoading]);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setCart(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error('Failed to sync cart from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); // Empty dependency - event listener doesn't need updates

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1): boolean => {
    setCart(currentCart => {
      const existingIndex = currentCart.findIndex(i => i._id === item._id);
      
      if (existingIndex >= 0) {
        const existing = currentCart[existingIndex];
        const newQuantity = existing.quantity + quantity;
        
        if (newQuantity > MAX_ITEM_QUANTITY) {
          return currentCart; // Don't update if exceeds max
        }
        
        const newCart = [...currentCart];
        newCart[existingIndex] = { ...existing, quantity: newQuantity };
        return newCart;
      } else {
        if (quantity > MAX_ITEM_QUANTITY) {
          return currentCart; // Don't add if exceeds max
        }
        return [...currentCart, { ...item, quantity }];
      }
    });
    
    return true;
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setCart(currentCart => currentCart.filter(item => item._id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number): boolean => {
    if (quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
      return false;
    }
    
    setCart(currentCart => 
      currentCart.map(item => 
        item._id === itemId ? { ...item, quantity } : item
      )
    );
    
    return true;
  }, []);

  const incrementQuantity = useCallback((itemId: string): boolean => {
    let success = false;
    setCart(currentCart => {
      const item = currentCart.find(i => i._id === itemId);
      if (!item || item.quantity >= MAX_ITEM_QUANTITY) {
        success = false;
        return currentCart;
      }
      
      success = true;
      return currentCart.map(i => 
        i._id === itemId ? { ...i, quantity: i.quantity + 1 } : i
      );
    });
    return success;
  }, []);

  const decrementQuantity = useCallback((itemId: string): boolean => {
    setCart(currentCart => {
      const item = currentCart.find(i => i._id === itemId);
      if (!item) return currentCart;
      
      if (item.quantity <= 1) {
        return currentCart.filter(i => i._id !== itemId);
      }
      
      return currentCart.map(i => 
        i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
    return true;
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getItemCount = useCallback((): number => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const getTotal = useCallback((): number => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const isInCart = useCallback((itemId: string): boolean => {
    return cart.some(item => item._id === itemId);
  }, [cart]);

  const getItemQuantity = useCallback((itemId: string): number => {
    const item = cart.find(i => i._id === itemId);
    return item?.quantity || 0;
  }, [cart]);

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