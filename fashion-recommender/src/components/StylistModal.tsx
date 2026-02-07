'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  ShoppingBag, 
  RefreshCw, 
  Check, 
  Sparkles, 
  Shuffle, 
  AlertCircle,
  ArrowRight,
  Lock,
  X
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStylist } from '@/context/StylistContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

interface RecommendationItem {
  _id?: string;
  id?: string;
  category: string;
  name: string;
  color: string;
  reason: string;
  price?: number;
  image?: string;
  imageUrl?: string;
}

interface OutfitRecommendation {
  items: RecommendationItem[];
  styleAdvice: string;
  style_tips?: string[];
  description?: string;
}

type ContextType = 'Casual' | 'Office' | 'Party' | 'Street';

export default function StylistModal() {
  const { isStylistOpen, setIsStylistOpen } = useStylist();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeContext, setActiveContext] = useState<ContextType>('Casual');
  const [isLoading, setIsLoading] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState(false);
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [error, setError] = useState('');
  const [userGender, setUserGender] = useState('Unisex');
  const [userStyle, setUserStyle] = useState('');
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isStylistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isStylistOpen]);

  // Fetch initial product when modal opens
  useEffect(() => {
    if (isStylistOpen && !product && status === 'authenticated') {
      fetchRandomProduct();
    }
  }, [isStylistOpen, status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch user profile
  useEffect(() => {
    if (isStylistOpen && status === 'authenticated') {
      const fetchProfile = async () => {
        try {
          const res = await fetch('/api/user/profile');
          const data = await res.json();
          if (data.success && data.data) {
            if (data.data.gender) setUserGender(data.data.gender);
            if (data.data.preferredStyle) setUserStyle(data.data.preferredStyle);
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        }
      };
      fetchProfile();
    }
  }, [isStylistOpen, status]);

  const fetchRandomProduct = async () => {
    setIsFetchingProduct(true);
    setError('');
    try {
      const res = await fetch('/api/products/random');
      if (!res.ok) throw new Error('Failed to fetch product');
      const newProduct = await res.json();
      if (newProduct && newProduct._id) {
        setProduct(newProduct);
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Failed to load product. Please try again.');
    } finally {
      setIsFetchingProduct(false);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!product) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          occasion: activeContext,
          gender: userGender,
          preferredStyle: userStyle
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await res.json();
      
      const normalized: OutfitRecommendation = {
        items: (data.items || []).map((item: RecommendationItem) => ({
          ...item,
          id: item._id || item.id,
          image: item.imageUrl || item.image,
          price: item.price || 0,
        })),
        styleAdvice: data.style_tips 
          ? data.style_tips.join(' ') 
          : (data.styleAdvice || data.description || ''),
      };

      setRecommendation(normalized);
    } catch (err) {
      console.error('Failed to generate outfit:', err);
      setError('Failed to generate outfit recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [activeContext, product, userGender, userStyle]);

  // Auto-generate when product or context changes
  useEffect(() => {
    if (isStylistOpen && product && status === 'authenticated') {
      handleGenerate();
    }
  }, [handleGenerate, isStylistOpen, status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Shuffle to a different random product
  const handleShuffle = async () => {
    setIsShuffling(true);
    setError('');
    setRecommendation(null);
    try {
      const res = await fetch('/api/products/random');
      if (!res.ok) throw new Error('Failed to fetch new product');
      const newProduct = await res.json();
      if (newProduct && newProduct._id) {
        setProduct(newProduct);
      }
    } catch (err) {
      console.error('Failed to shuffle product:', err);
      setError('Failed to load a new product. Please try again.');
    } finally {
      setIsShuffling(false);
    }
  };

  // Add ALL items to cart
  const handleAddAllToCart = () => {
    if (!product) return;
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      size: 'M',
      color: 'Standard',
      brand: 'Fashion Brand',
    });

    if (recommendation?.items) {
      recommendation.items.forEach((item) => {
        if (item.id && item.price && item.price > 0) {
          addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image || item.imageUrl || '',
            size: 'M',
            color: item.color || 'Standard',
            brand: 'Fashion Brand',
          });
        }
      });
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleClose = () => {
    setIsStylistOpen(false);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Full-screen Modal */}
      <div 
        className={`fixed inset-0 z-[70] transition-all duration-300 ${
          isStylistOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isStylistOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        />

        {/* Modal Panel - Full screen slide up */}
        <div 
          className={`absolute inset-0 bg-gray-950 text-white transition-transform duration-500 ease-out ${
            isStylistOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Not signed in */}
          {status === 'unauthenticated' ? (
            <div className="h-full flex flex-col">
              {/* Close button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full inline-flex items-center justify-center mb-5">
                    <Lock className="w-7 h-7 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
                  <p className="text-gray-400 text-sm mb-6">Please sign in to access the AI Stylist and get personalized outfit recommendations.</p>
                  <button
                    onClick={() => { handleClose(); router.push('/auth/signin'); }}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold text-sm transition-all shadow-lg shadow-green-600/20"
                  >
                    Sign In to Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : status === 'loading' || isFetchingProduct ? (
            <div className="h-full flex flex-col">
              {/* Close button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          ) : product ? (
            /* Main Stylist Content */
            <div className="h-full flex flex-col overflow-hidden">
              
              {/* Header with close button */}
              <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 flex-shrink-0 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-600/20 rounded-full">
                    <Sparkles className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">AI Personal Stylist</span>
                  </div>
                  <h1 className="text-base font-bold tracking-tight hidden sm:block">Your AI-Curated Outfit</h1>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShuffle}
                    disabled={isShuffling}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium rounded-full transition-all disabled:opacity-50"
                  >
                    <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
                    {isShuffling ? 'Loading...' : 'Try Different Product'}
                  </button>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors ml-2"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mx-4 sm:mx-6 lg:mx-8 mt-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400 flex-shrink-0">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Main Content */}
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 min-h-0 flex flex-col">
                <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
                  {/* Left: Product Card */}
                  <div className="w-full lg:w-[55%] min-h-0">
                    <div className="bg-white/[0.04] rounded-2xl border border-white/[0.08] overflow-hidden h-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
                        {/* Image */}
                        <div className="relative aspect-[4/3] md:aspect-auto bg-gray-800">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-gray-950/80" />
                          {/* Tag */}
                          <div className="absolute top-3 left-3 z-10">
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                              <span className="text-[9px] font-bold tracking-wide">AI MATCH</span>
                            </div>
                          </div>
                        </div>

                        {/* Product Info + Controls */}
                        <div className="p-4 flex flex-col justify-between">
                          <div>
                            <p className="text-[9px] font-bold text-green-400 uppercase tracking-widest mb-0.5">{product.category}</p>
                            <h2 className="text-base font-bold mb-1 leading-tight">{product.name}</h2>
                            <p className="text-gray-400 text-[11px] leading-relaxed mb-2 line-clamp-2">{product.description}</p>
                            <p className="text-lg font-bold text-white">₹{product.price.toFixed(2)}</p>
                          </div>

                          <div className="mt-3 space-y-3">
                            {/* Occasion Selector */}
                            <div>
                              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Select Occasion</p>
                              <div className="flex flex-wrap gap-1.5">
                                {(['Casual', 'Office', 'Party', 'Street'] as ContextType[]).map((ctx) => (
                                  <button
                                    key={ctx}
                                    onClick={() => setActiveContext(ctx)}
                                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all border ${
                                      activeContext === ctx
                                        ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/20'
                                        : 'bg-transparent border-white/10 text-gray-400 hover:border-white/25'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1">
                                      {activeContext === ctx && <Check className="w-2.5 h-2.5" />}
                                      {ctx}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* User preferences indicator */}
                            {(userGender !== 'Unisex' || userStyle) && (
                              <div className="flex items-center gap-1.5 text-[9px] text-gray-500">
                                <Sparkles className="w-2.5 h-2.5 text-green-500" />
                                <span>Personalized for: {userGender}{userStyle ? ` · ${userStyle}` : ''}</span>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="px-3 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-1.5 text-xs font-medium"
                              >
                                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                                {isLoading ? 'Styling...' : 'Regenerate'}
                              </button>
                              <button
                                onClick={handleAddAllToCart}
                                disabled={isAdded}
                                className={`px-3 py-2 rounded-xl text-white transition-all flex items-center justify-center gap-1.5 text-xs font-bold ${
                                  isAdded
                                    ? 'bg-green-600'
                                    : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    Added!
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="w-3 h-3" />
                                    Add All to Cart
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: AI Recommendations */}
                  <div className="w-full lg:w-[45%] flex flex-col gap-3 min-h-0">
                    {/* Style Advice Card */}
                    {recommendation?.styleAdvice && (
                      <div className="bg-green-500/[0.06] border border-green-500/15 rounded-2xl p-3 flex-shrink-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-green-400" />
                          <h3 className="text-[10px] font-bold text-green-400 uppercase tracking-wider">AI Style Advice</h3>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed italic line-clamp-3">
                          &ldquo;{recommendation.styleAdvice}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Recommended Items */}
                    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3 flex-1 min-h-0 flex flex-col">
                      <div className="flex items-center justify-between mb-2 flex-shrink-0">
                        <h3 className="text-xs font-bold text-white">Complete Your Look</h3>
                        {recommendation?.items && recommendation.items.length > 0 && (
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{recommendation.items.length} pieces</span>
                        )}
                      </div>

                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
                          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-2" />
                          <p className="text-[11px] font-medium">AI is creating your outfit...</p>
                        </div>
                      ) : recommendation?.items && recommendation.items.length > 0 ? (
                        <div className="space-y-2 flex-1 overflow-y-auto pr-1 hide-scrollbar">
                          {recommendation.items.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              className="flex gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all group"
                            >
                              {/* Item image */}
                              {item.image ? (
                                <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 relative bg-gray-800">
                                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                              ) : (
                                <div className="w-11 h-11 rounded-lg flex-shrink-0 bg-white/[0.05] flex items-center justify-center">
                                  <ShoppingBag className="w-4 h-4 text-gray-600" />
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="text-[9px] font-bold text-green-400 uppercase tracking-wider">{item.category}</p>
                                    <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                                  </div>
                                  {item.price && item.price > 0 && (
                                    <span className="text-xs font-bold text-white flex-shrink-0">₹{item.price.toFixed(2)}</span>
                                  )}
                                </div>
                                {item.color && (
                                  <p className="text-[10px] text-gray-500">Color: {item.color}</p>
                                )}
                                {item.reason && (
                                  <p className="text-[10px] text-gray-400 mt-0.5 leading-snug line-clamp-1 italic">{item.reason}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : !error ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
                          <Sparkles className="w-6 h-6 text-gray-600 mb-2" />
                          <p className="text-[11px] font-medium">No recommendations yet</p>
                          <p className="text-[10px] text-gray-600 mt-0.5">Select an occasion and click Regenerate</p>
                        </div>
                      ) : null}
                    </div>

                    {/* Quick tip */}
                    <div className="flex items-center gap-1.5 px-1 text-[9px] text-gray-600 flex-shrink-0">
                      <Sparkles className="w-2.5 h-2.5 text-green-600 flex-shrink-0" />
                      <span>Recommendations powered by Google Gemini AI based on your preferences and selected occasion.</span>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          ) : (
            /* Error state - no product */
            <div className="h-full flex flex-col">
              <div className="flex justify-end p-4">
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Error Loading Stylist</h1>
                  <p className="text-gray-400 mb-6">Could not load product data. Please try again.</p>
                  <button
                    onClick={fetchRandomProduct}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold text-sm transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
