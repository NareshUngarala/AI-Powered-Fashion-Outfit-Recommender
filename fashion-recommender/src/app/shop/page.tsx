'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { 
  SlidersHorizontal, 
  Check,
  ChevronDown,
  X
} from 'lucide-react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';

// Extract unique categories from products
const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category))).sort()];

const getCategoryImage = (category: string) => {
  if (category === 'All') return null;
  const product = PRODUCTS.find(p => p.category === category);
  return product ? product.imageUrl : null;
};

export default function ShopPage() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState(PRODUCTS);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch products from API with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
        
        const response = await fetch(`/api/products?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            let fetchedProducts = data.data.length > 0 ? data.data : [];
            
            // Client-side filtering for Style
            if (selectedStyle) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fetchedProducts = fetchedProducts.filter((p: any) => p.style === selectedStyle);
            }

            // Client-side filtering for Price
            if (selectedPriceRange) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fetchedProducts = fetchedProducts.filter((p: any) => {
                    if (selectedPriceRange === 'Under ₹1000') return p.price < 1000;
                    if (selectedPriceRange === '₹1000 - ₹2500') return p.price >= 1000 && p.price <= 2500;
                    if (selectedPriceRange === 'Above ₹2500') return p.price > 2500;
                    return true;
                });
            }

            setProducts(fetchedProducts); 
          }
        }
      } catch (error) {
        console.log('Using local mock data due to API error', error);
        // Fallback to local filtering if API fails
        const filtered = [...PRODUCTS].filter(p => {
            const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
            const matchStyle = !selectedStyle || p.style === selectedStyle;
            let matchPrice = true;
            if (selectedPriceRange) {
                if (selectedPriceRange === 'Under ₹1000') matchPrice = p.price < 1000;
                else if (selectedPriceRange === '₹1000 - ₹2500') matchPrice = p.price >= 1000 && p.price <= 2500;
                else if (selectedPriceRange === 'Above ₹2500') matchPrice = p.price > 2500;
            }
            return matchCategory && matchStyle && matchPrice;
        });
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
  }, [selectedStyle, selectedPriceRange, selectedCategory]);

  // AI Recommendation Logic for New York Weather (Cold/Winter)
  const recommendedProducts = PRODUCTS.filter(p => {
    const searchString = (
      (p.tags?.join(' ') || '') + ' ' + 
      p.description + ' ' + 
      p.name + ' ' + 
      (p.material || '') + ' ' +
      p.category
    ).toLowerCase();
    
    // Filter for Winter/Cold weather items (Jackets, Denim, Wool, Suits, Thick materials)
    const isWinterAppropriate = /jacket|coat|blazer|wool|denim|suit|sweatshirt|hoodie|thick/i.test(searchString);
    
    // Filter for "Style Profile" (Simulated as Trendy/Casual/Formal mix, excluding pure traditional unless fusion)
    // For this demo, let's prioritize high match scores if they exist, or just general style
    const isStyleMatch = p.match > 90; // Simulate "User Profile" match
    
    return isWinterAppropriate && isStyleMatch;
  }).slice(0, 4); // Show top 4

  const toggleFilter = (setter: (val: string) => void, current: string, value: string) => {
    setter(current === value ? '' : value);
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-gray-50 font-sans text-gray-900 selection:bg-green-100 selection:text-green-900 lg:overflow-hidden overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 lg:overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-0 lg:gap-8 lg:h-full pt-6 md:pt-2">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-end md:mb-1">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 md:w-10 md:h-10 md:rounded-full md:justify-center md:p-0 md:shadow-md md:border-gray-200"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              {isMobileFiltersOpen ? (
                <X className="w-4 h-4 md:w-4 md:h-4" />
              ) : (
                <SlidersHorizontal className="w-4 h-4 md:w-4 md:h-4" />
              )}
              <span className="md:hidden">
                  {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
              </span>
            </button>
          </div>

          {/* Left Sidebar - Filters */}
          <aside className={`w-full lg:w-64 flex-shrink-0 space-y-8 pb-8 lg:h-full lg:overflow-y-auto hide-scrollbar ${
            isMobileFiltersOpen ? 'block' : 'hidden lg:block'
          }`}>
            
            {/* AI Personalization Toggle */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Personalization</h3>
              <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setAiEnabled(!aiEnabled)}>
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ease-in-out ${
                  aiEnabled ? 'bg-green-600' : 'bg-gray-300 group-hover:bg-gray-400'
                }`}>
                  <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                    aiEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
                <span className={`text-sm ${aiEnabled ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                  Smart Recommendations
                </span>
              </label>
            </div>

            {/* Style */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Style</h3>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-2">
                {['Traditional Wear', 'Casual Wear', 'Formal Wear', 'Party Wear'].map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(setSelectedStyle, selectedStyle, item)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      selectedStyle === item 
                        ? 'bg-green-600 border-green-600' 
                        : 'bg-white border-gray-300 group-hover:border-green-400'
                    }`}>
                      {selectedStyle === item && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm ${selectedStyle === item ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price Range</h3>
              <div className="space-y-2">
                {['Under ₹1000', '₹1000 - ₹2500', 'Above ₹2500'].map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(setSelectedPriceRange, selectedPriceRange, item)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      selectedPriceRange === item 
                        ? 'bg-green-600 border-green-600' 
                        : 'bg-white border-gray-300 group-hover:border-green-400'
                    }`}>
                      {selectedPriceRange === item && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm ${selectedPriceRange === item ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content - Product Grid */}
          <section className="flex-1 min-w-0 lg:h-full flex flex-col">
            {/* Sticky Header Container */}
            <div className="flex-shrink-0 z-10 bg-gray-50 pb-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-1">
                <div>
                  {selectedStyle && (
                    <h1 className="text-3xl font-bold text-gray-900 mb-0">
                        Filtered by {selectedStyle}
                    </h1>
                  )}
                </div>
              </div>

              {/* Category Buttons Scroll */}
              <div className="relative group">
                {/* Scroll Container */}
                <div 
                  ref={scrollContainerRef}
                  className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth px-1 pt-4 pb-4"
                >
                  {CATEGORIES.map((category) => {
                    const categoryImage = getCategoryImage(category);
                    const isSelected = selectedCategory === category;
                    
                    return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="flex flex-col items-center gap-3 flex-shrink-0 group/item"
                    >
                      {/* Circle Container */}
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border relative overflow-hidden transition-all duration-300 transform ${
                        isSelected 
                          ? category === 'All' 
                            ? 'bg-gray-900 border-gray-900 text-white shadow-xl scale-110 ring-1 ring-offset-2 ring-gray-900'
                            : 'bg-white border-green-600 text-green-600 shadow-xl scale-110 ring-1 ring-offset-2 ring-green-600'
                          : 'bg-white border-gray-200 text-gray-400 shadow-sm group-hover/item:border-green-400 group-hover/item:text-green-600 group-hover/item:shadow-lg group-hover/item:scale-105'
                      }`}>
                        {category === 'All' ? (
                          <span className="text-xs font-bold z-10">ALL</span>
                        ) : (
                          categoryImage && (
                            <Image 
                              src={categoryImage} 
                              alt={category} 
                              fill 
                              className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                              sizes="64px"
                            />
                          )
                        )}
                      </div>
                      
                      {/* Label */}
                      <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                        isSelected 
                          ? category === 'All' ? 'text-gray-900' : 'text-green-700'
                          : 'text-gray-400 group-hover/item:text-gray-600'
                      }`}>
                        {category === 'All' ? 'Everything' : category}
                      </span>
                    </button>
                  )})}
                </div>
              </div>
            </div>

            {/* Scrollable Grid */}
            <div className="flex-1 overflow-y-auto hide-scrollbar pb-20">
              {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <div key={i} className="aspect-[4/5] bg-gray-200 rounded-lg animate-pulse" />
                      ))}
                  </div>
              ) : (
                  <>
                    {/* Combined Grid for Mobile/Tablet (to fix flow issues) */}
                    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {(aiEnabled && recommendedProducts.length > 0 && !selectedStyle && !selectedPriceRange && selectedCategory === 'All') && 
                            recommendedProducts.map((product) => (
                                <ProductCard key={`rec-${product._id}`} product={product} />
                            ))
                        }
                        {products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        ) : (
                            !((aiEnabled && recommendedProducts.length > 0 && !selectedStyle && !selectedPriceRange && selectedCategory === 'All')) && (
                                <div className="col-span-full text-center py-12 text-gray-500">
                                    No products found matching your filters.
                                </div>
                            )
                        )}
                    </div>

                    {/* Separate Grids for Desktop (to maintain specific column counts) */}
                    <div className="hidden lg:block">
                        {aiEnabled && recommendedProducts.length > 0 && !selectedStyle && !selectedPriceRange && selectedCategory === 'All' && (
                        <div className="mb-6">
                            <div className="grid grid-cols-4 gap-6">
                            {recommendedProducts.map((product) => (
                                <ProductCard key={`rec-${product._id}`} product={product} />
                            ))}
                            </div>
                        </div>
                        )}

                        <div className="grid grid-cols-3 xl:grid-cols-4 gap-6">
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
                    </div>
                  </>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}