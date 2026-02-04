'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Plus, Heart } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, setIsCartOpen } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [showScore, setShowScore] = useState(false);
  const isLiked = isInWishlist(product._id);

  useEffect(() => {
    if (!product.match) return;
    const interval = setInterval(() => {
      setShowScore((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, [product.match]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product details
    e.stopPropagation();
    
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      size: 'M', // Default size for quick add
      color: 'Standard' // Default color
    });
    
    // setIsCartOpen(true); // Removed to keep user on page without opening drawer
  };

  return (
    <Link href={`/products/${product._id}`} className="group cursor-pointer block h-full">
      <div className="relative flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-green-100">
        
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-white">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* AI Match Badge */}
          {product.match && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md w-9 h-9 rounded-full shadow-md border border-green-100 flex items-center justify-center overflow-hidden z-10">
                {/* Icon State */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${showScore ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
                    <Sparkles className="w-4 h-4 text-green-600 fill-green-100" />
                </div>
                {/* Score State */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${showScore ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    <span className="text-[10px] font-bold text-green-600">{product.match}%</span>
                </div>
            </div>
          )}

          {/* Like/Wishlist Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isLiked) {
                removeFromWishlist(product._id);
              } else {
                addToWishlist({
                  _id: product._id,
                  name: product.name,
                  price: product.price,
                  images: product.images || [product.imageUrl],
                  brand: product.brand,
                  category: product.category
                });
              }
            }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-md w-9 h-9 rounded-full shadow-md border border-gray-100 flex items-center justify-center z-10 group/like transition-transform active:scale-95"
          >
            <Heart 
              className={`w-4 h-4 transition-colors duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/like:text-gray-600'}`} 
            />
          </button>

          {/* Quick Add Button (Visual) */}
          <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button 
              onClick={handleQuickAdd}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-900 hover:bg-green-600 hover:text-white transition-colors cursor-pointer z-10"
              aria-label="Add to cart"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-3 flex flex-col flex-1 gap-1">
          {product.brand && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              {product.brand}
            </p>
          )}
          <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-auto pt-2 flex items-center justify-between">
            <p className="text-sm font-bold text-green-700">₹{product.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
