'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface CartItem {
  id: string; // Product ID
  cartId: string; // Unique ID for this cart entry (product + variant)
  name: string;
  brand?: string;
  price: number;
  size?: string;
  color?: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'cartId'>) => Promise<void>;
  removeFromCart: (cartId: string) => Promise<void>;
  updateQuantity: (cartId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate deterministic cartId
  const getCartId = (item: { id: string, size?: string, color?: string }) => {
    return `${item.id}-${item.size || ''}-${item.color || ''}`;
  };

  // Fetch cart from API
  const fetchCart = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.success && data.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const serverItems = data.data.items.map((item: any) => ({
          id: item.productId,
          cartId: getCartId({ id: item.productId, size: item.size, color: item.color }),
          name: item.name,
          price: item.price,
          size: item.size,
          color: item.color,
          image: item.image,
          quantity: item.quantity,
          brand: item.brand // optional
        }));
        setItems(serverItems);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array as it relies on stable setters and getCartId (which is pure-ish)

  // Initial Load
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated') {
      fetchCart();
    } else {
      // Load from local storage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e);
        }
      }
    }
    setIsInitialized(true);
  }, [status, fetchCart]);

  // Sync to LocalStorage (only for guests)
  useEffect(() => {
    if (isInitialized && status === 'unauthenticated') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, status, isInitialized]);

  const addToCart = async (newItem: Omit<CartItem, 'quantity' | 'cartId'>) => {
    const cartId = getCartId(newItem);
    
    // Optimistic update
    const existingItemIndex = items.findIndex((item) => item.cartId === cartId);
    const newItems = [...items];
    
    if (existingItemIndex > -1) {
      newItems[existingItemIndex].quantity += 1;
    } else {
      newItems.push({ ...newItem, quantity: 1, cartId });
    }
    setItems(newItems);

    if (status === 'authenticated') {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: newItem.id,
            quantity: 1,
            size: newItem.size,
            color: newItem.color,
            name: newItem.name,
            price: newItem.price,
            image: newItem.image
          }),
        });
      } catch (error) {
        console.error('Failed to add to cart API:', error);
        // Revert? For now, keep optimistic
      }
    }
  };

  const updateQuantity = async (cartId: string, quantity: number) => {
    if (quantity < 1) return;

    // Optimistic
    setItems(prev => prev.map(item => 
      item.cartId === cartId ? { ...item, quantity } : item
    ));

    if (status === 'authenticated') {
      const item = items.find(i => i.cartId === cartId);
      if (!item) return;

      try {
        await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.id,
            size: item.size,
            color: item.color,
            quantity
          }),
        });
      } catch (error) {
        console.error('Failed to update quantity API:', error);
      }
    }
  };

  const removeFromCart = async (cartId: string) => {
    const itemToRemove = items.find(i => i.cartId === cartId);
    setItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));

    if (status === 'authenticated' && itemToRemove) {
      try {
        const params = new URLSearchParams({
          productId: itemToRemove.id,
          size: itemToRemove.size || '',
          color: itemToRemove.color || ''
        });
        await fetch(`/api/cart?${params.toString()}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to remove from cart API:', error);
      }
    }
  };

  const clearCart = () => {
    setItems([]);
    if (status === 'unauthenticated') {
      localStorage.removeItem('cart');
    }
    // If authenticated, we might want to call an API to clear, 
    // but for now local clear is visual. 
    // Ideally: await fetch('/api/cart', { method: 'DELETE' }) (bulk delete)
  };

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
