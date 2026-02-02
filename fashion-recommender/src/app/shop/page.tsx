'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { 
  SlidersHorizontal, 
  Search, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function ShopPage() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { items, removeFromCart, cartTotal, cartCount } = useCart();
  const [products, setProducts] = useState(PRODUCTS);
  const [isLoading, setIsLoading] = useState(false); // Changed to false initially to show mock data immediately

  // Attempt to fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.length > 0) {
            setProducts(data.data);
          }
        }
      } catch (error) {
        console.log('Using local mock data due to API error');
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-gray-50 font-sans text-gray-900 selection:bg-green-100 selection:text-green-900 lg:overflow-hidden">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 lg:overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-8 lg:h-full pt-6">
          
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Left Sidebar - Filters */}
          <aside className={`w-full lg:w-64 flex-shrink-0 space-y-8 pb-8 lg:h-full lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            isMobileFiltersOpen ? 'block' : 'hidden lg:block'
          }`}>
            
            {/* AI Personalization Toggle */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Personalization</h3>
              <button 
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  aiEnabled 
                    ? 'bg-green-50 border-green-200 shadow-sm' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <span className={`text-sm font-semibold ${aiEnabled ? 'text-green-800' : 'text-gray-600'}`}>
                  Match Confidence
                </span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${aiEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow-sm transition-transform ${aiEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </button>
            </div>

            {/* Occasion */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Occasion</h3>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-2">
                {['Date Night', 'Sunday Brunch', 'Corporate Office'].map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      item === 'Sunday Brunch' 
                        ? 'bg-green-600 border-green-600' 
                        : 'bg-white border-gray-300 group-hover:border-green-400'
                    }`}>
                      {item === 'Sunday Brunch' && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm ${item === 'Sunday Brunch' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Vibe */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vibe</h3>
              <div className="flex flex-wrap gap-2">
                {['Minimalist', 'Gen-Z', 'Vintage', 'Professional'].map((vibe) => (
                  <button
                    key={vibe}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      vibe === 'Minimalist'
                        ? 'bg-green-600 text-white shadow-md shadow-green-200'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-green-200 hover:text-green-700'
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>

            {/* Sustainability */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sustainability</h3>
              <div className="space-y-2">
                {['Recycled Materials', 'Carbon Neutral'].map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      item === 'Recycled Materials'
                        ? 'bg-green-600 border-green-600' 
                        : 'bg-white border-gray-300 group-hover:border-green-400'
                    }`}>
                      {item === 'Recycled Materials' && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      {item === 'Recycled Materials' && <span className="text-green-600 text-[10px]">♻</span>}
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content - Product Grid */}
          <section className="flex-1 min-w-0 lg:h-full lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommended for Sunday Brunch</h1>
                <p className="text-gray-500 text-sm">Based on your style profile and current weather in New York.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Sort: AI Match
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {PRODUCTS.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>

          {/* Right Sidebar - Cart Preview */}
          <aside className="w-full lg:w-80 flex-shrink-0 lg:h-full lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gray-900" />
                  <h2 className="text-lg font-bold text-gray-900">Cart Preview</h2>
                </div>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">{cartCount} items</span>
              </div>

              {/* Cart Items */}
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Your cart is empty.
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 group">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">{item.brand || 'BRAND'}</p>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 mb-1">
                          Size: {item.size} • Color: {item.color}
                          {item.quantity > 1 && ` • Qty: ${item.quantity}`}
                        </p>
                        <p className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upsell */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-green-600" />
                  <h4 className="text-xs font-bold text-green-800 uppercase">Complete the Outfit</h4>
                </div>
                <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                     <Image src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=200" alt="Belt" width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">Gold Chain Belt</p>
                    <p className="text-xs font-bold text-green-600">+ $24.00</p>
                  </div>
                  <button className="w-6 h-6 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center text-green-700 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Shipping Discount
                  </span>
                  <span className="font-bold text-green-600">-$5.00</span>
                </div>
              </div>

              <button className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-green-200 hover:shadow-green-300 transition-all flex items-center justify-center gap-2">
                Checkout Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}