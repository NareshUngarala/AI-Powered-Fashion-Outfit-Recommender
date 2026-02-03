'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ShoppingBag, RefreshCw, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface RecommendationItem {
  category: string;
  name: string;
  color: string;
  reason: string;
}

interface OutfitRecommendation {
  items: RecommendationItem[];
  styleAdvice: string;
}

interface StylistClientProps {
  initialProduct: Product;
}

type ContextType = 'Casual' | 'Office' | 'Party' | 'Street';

export default function StylistClient({ initialProduct }: StylistClientProps) {
  const [activeContext, setActiveContext] = useState<ContextType>('Office');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const { addToCart } = useCart();

  // Mock recent generations for the footer
  const recentGenerations = [
    'bg-teal-200', 'bg-yellow-200', 'bg-emerald-200', 'bg-cyan-200'
  ];

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: initialProduct,
          occasion: activeContext,
          gender: 'Unisex' // Default for now, could be dynamic
        }),
      });
      const data = await res.json();
      setRecommendation(data);
    } catch (error) {
      console.error('Failed to generate outfit:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeContext, initialProduct]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    // Add main product
    addToCart({
      id: initialProduct._id,
      name: initialProduct.name,
      price: initialProduct.price,
      image: initialProduct.imageUrl,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-2">
          <div className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold tracking-wider mb-4">
            AI PERSONAL STYLIST
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            AI STYLED OUTFIT <span className="text-blue-500 italic">FOR YOU</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mt-4">
            Our neural network analyzed 5,000+ trends to match your aesthetic preferences and current climate.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#1a1d2d] rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative group">
          
          {/* Tag */}
          <div className="absolute top-6 left-6 z-10">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-xs font-bold tracking-wide text-white">PERFECT MATCH</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
             {/* Image Section */}
            <div className="relative h-[500px] md:h-auto bg-gray-800">
               <Image 
                 src={initialProduct.imageUrl} 
                 alt={initialProduct.name}
                 fill
                 className="object-cover"
                 priority
               />
               {/* Overlay Gradient */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d2d] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#1a1d2d]"></div>
            </div>

            {/* Controls Section */}
            <div className="p-8 md:p-12 flex flex-col justify-end relative">
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{initialProduct.name}</h2>
                <p className="text-gray-400 italic text-sm mb-4">
                  Vibe: {recommendation?.styleAdvice ? recommendation.styleAdvice.slice(0, 40) + '...' : 'Analyzing...'}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">₹{initialProduct.price}</span>
                  <span className="text-blue-400 text-xs font-bold">SAVE 15% AS BUNDLE</span>
                </div>
              </div>

              {/* Context Selector */}
              <div className="mb-8">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Select Context</p>
                <div className="flex flex-wrap gap-3">
                  {(['Casual', 'Office', 'Party', 'Street'] as ContextType[]).map((ctx) => (
                    <button
                      key={ctx}
                      onClick={() => setActiveContext(ctx)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                        activeContext === ctx 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                          : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {activeContext === ctx && <Check className="w-3 h-3" />}
                        {ctx}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="px-6 py-4 rounded-xl border border-gray-700 text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2 font-medium group"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  {isLoading ? 'Styling...' : 'Try Another Style'}
                </button>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`px-6 py-4 rounded-xl text-white transition-all shadow-[0_4px_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 font-bold ${
                    isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Add All to Cart
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Footer: Recently Generated */}
        <div className="mt-16">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Recently Generated</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentGenerations.map((color, i) => (
              <div key={i} className={`aspect-square rounded-3xl ${color} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}></div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
