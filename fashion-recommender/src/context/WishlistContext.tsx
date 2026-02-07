'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
  brand?: string;
  category?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (isOpen: boolean) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Fetch wishlist from API
  const fetchWishlist = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      if (data.success && data.data) {
        setItems(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated') {
      fetchWishlist();
    } else {
      // Load from local storage for guests
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          setItems(JSON.parse(savedWishlist));
        } catch (e) {
          console.error('Failed to parse wishlist from localStorage', e);
        }
      }
    }
    setIsInitialized(true);
  }, [status, fetchWishlist]);

  // Sync to LocalStorage (only for guests)
  useEffect(() => {
    if (isInitialized && status === 'unauthenticated') {
      localStorage.setItem('wishlist', JSON.stringify(items));
    }
  }, [items, status, isInitialized]);

  const addToWishlist = async (newItem: WishlistItem) => {
    // Check if already in wishlist
    if (items.some(item => item._id === newItem._id)) return;
    
    // Optimistic update
    setItems(prev => [...prev, newItem]);
    // setIsWishlistOpen(true); // Open drawer on add - Disabled per user request

    if (status === 'authenticated') {
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: newItem._id }),
        });
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
        // Revert on failure
        setItems(prev => prev.filter(item => item._id !== newItem._id));
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    // Optimistic update
    const previousItems = [...items];
    setItems(prev => prev.filter(item => item._id !== productId));

    if (status === 'authenticated') {
      try {
        await fetch(`/api/wishlist/${productId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        // Revert
        setItems(previousItems);
      }
    }
  };

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item._id === productId);
  }, [items]);

  const wishlistCount = useMemo(() => items.length, [items]);

  const contextValue = useMemo(() => ({
    items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isLoading,
    isWishlistOpen,
    setIsWishlistOpen,
    wishlistCount
  }), [items, addToWishlist, removeFromWishlist, isInWishlist, isLoading, isWishlistOpen, setIsWishlistOpen, wishlistCount]);

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
