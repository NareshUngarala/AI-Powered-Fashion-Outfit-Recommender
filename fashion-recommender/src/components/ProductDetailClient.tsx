'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Leaf, 
  Truck, 
  ShieldCheck, 
  Ruler, 
  Plus, 
  Minus,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';
import OutfitGeneratorModal from './OutfitGeneratorModal';

// Interface for Outfit Item used in the modal
interface OutfitItem {
  id: string;
  name: string;
  category: string;
  color: string;
  price: number;
  image: string;
}

// Interface for the Recommendation object expected by the frontend
export interface OutfitRecommendation {
  items: OutfitItem[];
  styleAdvice: string;
}

// Extend Product interface if needed for frontend specific props not in data file
interface ProductDetail extends Product {
  tags?: string[];
}

export default function ProductDetailClient({ product }: { product: ProductDetail }) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [isOutfitModalOpen, setIsOutfitModalOpen] = useState(false);
  const [showOutfitCard, setShowOutfitCard] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 }); // Start center
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Image Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    // Calculate percentage position (0-100)
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [outfitData, setOutfitData] = useState<OutfitRecommendation | null>(null);
  const [isLoadingOutfit, setIsLoadingOutfit] = useState(false);
  const { addToCart, items: cartItems, updateQuantity, removeFromCart } = useCart();

  const generateOutfit = async (occasion: string = 'Casual', gender: string = 'Unisex') => {
    setIsLoadingOutfit(true);
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, occasion, gender })
      });
      const rawData = await response.json();
      
      // Transform Python backend response to frontend format
      const data: OutfitRecommendation = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: (rawData.items || []).map((item: any) => ({
              id: item._id || item.id,
              name: item.name,
              category: item.category,
              color: item.colors?.[0] || 'Standard',
              price: item.price,
              image: item.imageUrl || item.image
          })),
          styleAdvice: rawData.style_tips ? rawData.style_tips.join(' ') : (rawData.description || '')
      };
      
      setOutfitData(data);
      return data;
    } catch (error) {
      console.error('Failed to generate recommendation:', error);
      return null;
    } finally {
      setIsLoadingOutfit(false);
    }
  };

  const handleOpenOutfitModal = () => {
    setIsOutfitModalOpen(true);
    if (!outfitData) {
      generateOutfit();
    }
  };

  const handleRegenerate = (occasion: string, gender: string) => {
    generateOutfit(occasion, gender);
  };

  const handleGenerateInCard = async () => {
    setShowOutfitCard(true);
    setIsLoadingOutfit(true);
    setOutfitData(null); // Clear previous data
    
    try {
      const data = await generateOutfit();
      setOutfitData(data);
      // Automatically select the first category if available
      if (data && data.items.length > 0) {
        const cats = Array.from(new Set(data.items.map((item) => item.category)));
        if (cats.length > 0) {
          setSelectedCategory(cats[0] as string);
        } else {
          setSelectedCategory('All');
        }
      }
    } catch (error) {
      console.error('Failed to generate outfit:', error);
      setSelectedCategory('All');
    } finally {
      setIsLoadingOutfit(false);
    }
  };

  const filteredItems = outfitData?.items.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  const categories = outfitData ? Array.from(new Set(outfitData.items.map(item => item.category))) : [];

  // Static options (since these aren't in the DB yet)
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const features = [
    { icon: Leaf, text: "Premium Material" },
    { icon: Ruler, text: "True to Size" },
    { icon: Truck, text: "Free Express Shipping" },
    { icon: ShieldCheck, text: "Quality Guaranteed" }
  ];

  // Use product images if available, otherwise fallback to mock duplicates
  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : [
        product.imageUrl,
        product.imageUrl, // Duplicating for gallery effect
        product.imageUrl,
        product.imageUrl
      ];

  // Auto-play effect
  useEffect(() => {
    // Stop auto-play if manually stopped or if user is zooming/hovering
    if (!isAutoPlaying || isZoomed) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length, isZoomed]);

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      size: selectedSize,
      color: product.colors?.[0] || 'Standard',
      brand: product.brand || "Fashion Brand"
    });
  };

  const getCartItem = (itemId: string) => {
    return cartItems.find(item => item.id === itemId && item.size === 'M' && item.color === (outfitData?.items.find(i => i.id === itemId)?.color || 'Standard'));
  };

  const handleUpdateCart = async (item: OutfitItem, change: number) => {
      const cartItem = cartItems.find(i => i.id === item.id && i.size === 'M' && i.color === item.color);
      
      if (cartItem) {
          const newQuantity = cartItem.quantity + change;
          if (newQuantity > 0) {
              await updateQuantity(cartItem.cartId, newQuantity);
          } else {
              await removeFromCart(cartItem.cartId);
          }
      } else if (change > 0) {
          await addToCart({
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              size: 'M',
              color: item.color,
              brand: 'Fashion Brand'
          });
      }
  };

  return (
    <div className="bg-white lg:h-[calc(100vh-64px)] lg:overflow-hidden h-auto min-h-[calc(100vh-64px)] overflow-y-auto font-sans text-gray-900 pt-4 lg:pt-8">
      
      <div className="w-full h-full pl-4 pr-4 lg:pr-12 pb-4">
        <div className={`lg:grid ${showOutfitCard ? 'lg:grid-cols-[72fr_28fr]' : 'lg:grid-cols-1'} gap-6 lg:gap-4 lg:h-full h-auto flex flex-col`}>
          
          {/* Left Column: Product Details (72% width) - Scrollable */}
          <div className="w-full lg:h-full lg:overflow-y-auto h-auto overflow-visible hide-scrollbar pr-0 lg:pr-2">
              
              <div className="flex flex-col md:flex-row gap-6 lg:gap-8 pb-8">
                {/* Gallery */}
                <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-3">
                  {/* Thumbnails */}
                  <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar ml-1 mt-1">
                    {images.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setCurrentImageIndex(idx);
                          setIsAutoPlaying(false);
                        }}
                        className={`relative w-20 h-24 md:w-24 md:h-32 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 bg-white ${
                          idx === currentImageIndex 
                            ? 'scale-105 shadow-lg ' + (!isAutoPlaying ? 'border border-green-600 ring-1 ring-green-600 ring-offset-1' : 'border-2 border-green-400/50')
                            : 'border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <Image src={img} alt={`View ${idx}`} fill className="object-contain p-1" />
                      </button>
                    ))}
                  </div>
                  
                  {/* Main Image */}
                  <div 
                    ref={imageContainerRef}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                    className="flex-1 lg:h-[calc(100vh-160px)] md:h-[600px] h-[500px] bg-white rounded-xl overflow-hidden relative group shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-crosshair"
                  >
                    <div key={currentImageIndex} className="absolute inset-0 animate-in fade-in duration-700">
                    <Image 
                      src={images[currentImageIndex]} 
                      alt={product.name} 
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain object-center will-change-transform"
                      style={{
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                        transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform-origin 0.1s ease-out'
                      }}
                    />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="w-full md:w-1/2 flex flex-col space-y-4 md:space-y-6">
                  
                  {/* Header */}
                  <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 font-serif leading-tight">{product.name}</h1>
                    <div className="flex items-center gap-3">
                      <p className="text-xl md:text-2xl font-medium text-gray-900">₹{product.price.toFixed(2)}</p>
                      <div className="h-6 w-px bg-gray-200"></div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 uppercase tracking-wide">
                        In Stock
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Select Size</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full text-sm font-medium transition-all border flex items-center justify-center ${
                            selectedSize === size 
                              ? 'border-green-600 text-green-700 bg-green-50 ring-1 ring-green-600 ring-offset-1' 
                              : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-2">
                    <button 
                      onClick={handleGenerateInCard}
                      className="w-full h-11 md:h-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-bold text-sm md:text-base shadow-md shadow-green-100/50 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
                    >
                      <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                      Generate AI Outfit
                    </button>
                    <button 
                      onClick={handleAddToCart}
                      className="w-full h-11 md:h-12 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 rounded-xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 hover:bg-gray-50"
                    >
                      Add to Cart
                    </button>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-600">
                        <div className="p-1.5 bg-gray-50 rounded-full">
                          <feature.icon className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <span className="text-xs md:text-sm font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

          </div>

          {/* Right Column: Outfit Card (28% width) - Fixed Height */}
          {showOutfitCard && (
          <div className="mt-8 lg:mt-0 lg:h-full h-[600px] w-full">
             <div className="h-full bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-2 md:p-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div className="flex-1 min-w-0 pr-2 flex gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <div className="text-xs font-bold text-green-600 uppercase tracking-widest mb-0.5 leading-none">AI Stylist</div>
                            {outfitData ? (
                                <p className="text-sm text-gray-600 italic line-clamp-2 leading-tight">
                                    {outfitData.styleAdvice}
                                </p>
                            ) : (
                                <h2 className="text-base font-bold text-gray-900 leading-tight">Complete Outfit</h2>
                            )}
                        </div>
                    </div>
                    {outfitData && (
                        <button 
                            onClick={handleGenerateInCard}
                            className="p-1.5 rounded-full hover:bg-white hover:shadow-sm text-gray-500 hover:text-green-600 transition-all flex-shrink-0"
                            title="Regenerate Outfit"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    )}
                </div>
                
                <div className="flex-1 p-2 md:p-3 overflow-hidden flex flex-col">
                    {isLoadingOutfit ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-gray-500">
                             <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                             <p className="text-xs font-medium">Creating your look...</p>
                        </div>
                    ) : outfitData ? (
                        <div className="flex flex-col h-full">
                            {/* Category Filter */}
                            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar mb-1 flex-shrink-0">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors border ${
                                            selectedCategory === cat 
                                            ? 'bg-green-600 text-white border-green-600' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
                                {filteredItems?.map((item) => (
                                    <div key={item.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
                                        <div className="relative w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                                            <p className="text-xs text-gray-500 mb-1">{item.category} • {item.color}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-green-600">₹{item.price.toFixed(2)}</span>
                                                {(() => {
                                                    const cartItem = getCartItem(item.id);
                                                    return cartItem ? (
                                                        <div className="flex items-center gap-2 bg-green-50 rounded-full px-1.5 py-0.5 border border-green-100">
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleUpdateCart(item, -1);
                                                                }}
                                                                className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm hover:text-green-700"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="text-xs font-bold text-green-700 w-3 text-center">{cartItem.quantity}</span>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleUpdateCart(item, 1);
                                                                }}
                                                                className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white shadow-sm hover:bg-green-700"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUpdateCart(item, 1);
                                                            }}
                                                            className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-200 transition-colors shadow-sm"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredItems?.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                        <p className="text-xs">No matching items found.</p>
                                    </div>
                                )}
                            </div>
                            <div className="pt-3 mt-auto border-t border-gray-100 flex gap-2">
                                <button 
                                    onClick={() => setSelectedCategory('All')}
                                    className="flex-1 py-2 bg-white border border-green-200 hover:bg-green-50 text-green-700 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Full Outfit
                                </button>
                                <button 
                                    onClick={handleOpenOutfitModal}
                                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-green-100 flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Get Look
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-gray-500">
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-1">
                                <Sparkles className="w-6 h-6 text-green-600 opacity-50" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-0.5">No Outfit Generated Yet</h3>
                                <p className="text-xs max-w-[200px] mx-auto">
                                    Let our AI create a perfect look tailored just for you.
                                </p>
                            </div>
                            <button 
                                onClick={handleGenerateInCard}
                                className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors shadow-sm"
                            >
                                Generate Now
                            </button>
                        </div>
                    )}
                </div>
             </div>
          </div>
          )}

        </div>
      </div>
      <OutfitGeneratorModal 
        isOpen={isOutfitModalOpen} 
        onClose={() => setIsOutfitModalOpen(false)}
        product={product}
        recommendation={outfitData}
        isLoading={isLoadingOutfit}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
}
