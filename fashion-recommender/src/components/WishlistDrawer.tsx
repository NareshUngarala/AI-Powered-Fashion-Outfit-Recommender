'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  X, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function WishlistDrawer() {
  const { 
    items, 
    removeFromWishlist, 
    wishlistCount, 
    isWishlistOpen, 
    setIsWishlistOpen 
  } = useWishlist();

  const { addToCart, setIsCartOpen } = useCart();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isWishlistOpen]);

  if (!mounted) return null;

  const handleMoveToCart = async (item: any) => {
    await addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.images[0],
      brand: item.brand,
      size: 'M', // Default size, user might need to select later
      color: 'Default' // Default color
    });
    await removeFromWishlist(item._id);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  return (
    <>
      {/* Backdrop & Drawer Container */}
      <div 
        className={`fixed inset-0 z-[60] flex justify-end transition-visibility duration-300 ${
          isWishlistOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
            isWishlistOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsWishlistOpen(false)}
        />

        {/* Drawer Panel */}
        <div 
          className={`relative w-full max-w-[420px] bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
            isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-gray-900 fill-gray-900" />
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Wishlist</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">
                {wishlistCount} items
              </span>
              <button 
                onClick={() => setIsWishlistOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Wishlist Items (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 text-gray-300" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">Your wishlist is empty</p>
                  <p className="text-sm text-gray-500 mt-1">Start saving your favorite items!</p>
                </div>
                <button 
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4 group">
                    {/* Product Image */}
                    <div className="relative w-24 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            {item.brand && (
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                {item.brand}
                              </p>
                            )}
                            <h3 className="font-medium text-gray-900 line-clamp-2 leading-snug">
                              <Link href={`/shop/${item._id}`} onClick={() => setIsWishlistOpen(false)}>
                                {item.name}
                              </Link>
                            </h3>
                          </div>
                          <button 
                            onClick={() => removeFromWishlist(item._id)}
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 mt-2">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Move to Cart Button */}
                      <button 
                        onClick={() => handleMoveToCart(item)}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Move to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
