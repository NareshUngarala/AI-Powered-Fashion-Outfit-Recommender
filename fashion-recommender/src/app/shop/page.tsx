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
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [selectedSustainability, setSelectedSustainability] = useState<string>('');

  // Fetch products from API with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        const tags = [selectedOccasion, selectedVibe, selectedSustainability].filter(Boolean).join(',');
        
        if (tags) params.append('tags', tags);
        
        const response = await fetch(`/api/products?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProducts(data.data.length > 0 ? data.data : []); 
          }
        }
      } catch (error) {
        console.log('Using local mock data due to API error');
        // Fallback to local filtering if API fails
        let filtered = [...PRODUCTS];
        const activeTags = [selectedOccasion, selectedVibe, selectedSustainability].filter(Boolean);
        // Simple client-side mock filter if tags match any property or just random for demo
        if (activeTags.length > 0) {
           // This is just a fallback, logic can be simple
        }
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    // Debounce slightly
    const timeoutId = setTimeout(() => {
        fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedOccasion, selectedVibe, selectedSustainability]);

  const toggleFilter = (setter: (val: string) => void, current: string, value: string) => {
    setter(current === value ? '' : value);
  };

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
                  <label key={item} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(setSelectedOccasion, selectedOccasion, item)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      selectedOccasion === item 
                        ? 'bg-green-600 border-green-600' 
                        : 'bg-white border-gray-300 group-hover:border-green-400'
                    }`}>
                      {selectedOccasion === item && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm ${selectedOccasion === item ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
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
                    onClick={() => toggleFilter(setSelectedVibe, selectedVibe, vibe)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedVibe === vibe
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
                  <label key={item} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(setSelectedSustainability, selectedSustainability, item)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      selectedSustainability === item
                        ? 'bg-green-600 border-green-600' 
                        : 'bg-white border-gray-300 group-hover:border-green-400'
                    }`}>
                      {selectedSustainability === item && <Check className="w-3.5 h-3.5 text-white" />}
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedOccasion ? `Recommended for ${selectedOccasion}` : 'All Products'}
                </h1>
                <p className="text-gray-500 text-sm">Based on your style profile and current weather in New York.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Sort: AI Match
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Grid */}
            {loading ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                 </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No products found matching your filters.
                    </div>
                )}
                </div>
            )}
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
                        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.size} • {item.color}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-semibold text-gray-900">${item.price}</span>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size, item.color)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total & Checkout */}
              {items.length > 0 && (
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Total</span>
                    <span className="text-xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <Link 
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all shadow-lg shadow-gray-200"
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}