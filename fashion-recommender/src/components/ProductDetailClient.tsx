'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Leaf, 
  Truck, 
  ShieldCheck, 
  Ruler, 
  Plus, 
  ArrowRight,
  Check
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';

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

import OutfitGeneratorModal from './OutfitGeneratorModal';

export default function ProductDetailClient({ product }: { product: ProductDetail }) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Ivory');
  const [isOutfitModalOpen, setIsOutfitModalOpen] = useState(false);
  const [outfitData, setOutfitData] = useState<OutfitRecommendation | null>(null);
  const [isLoadingOutfit, setIsLoadingOutfit] = useState(false);
  const { addToCart } = useCart();

  const handleOpenOutfitModal = async () => {
    setIsOutfitModalOpen(true);
    setIsLoadingOutfit(true);
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product })
      });
      const rawData = await response.json();
      
      // Transform Python backend response to frontend format
      const data: OutfitRecommendation = {
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
    } catch (error) {
      console.error('Failed to fetch recommendation:', error);
    } finally {
      setIsLoadingOutfit(false);
    }
  };

  const handleRegenerate = async (occasion: string, gender: string) => {
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
    } catch (error) {
      console.error('Failed to regenerate recommendation:', error);
    } finally {
      setIsLoadingOutfit(false);
    }
  };

  // Static options (since these aren't in the DB yet)
  const colors = [
    { name: 'Ivory', hex: '#F5F5DC' },
    { name: 'Navy', hex: '#2F3E46' },
    { name: 'Olive', hex: '#556B2F' }
  ];

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

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      size: selectedSize,
      color: selectedColor,
      brand: product.brand || "Fashion Brand"
    });
  };

  const recommendations = [
    {
      name: "Tailored Chinos",
      price: 110.00,
      color: "Sand",
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Leather Loafers",
      price: 145.00,
      color: "Tan",
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e0605df?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Minimalist Silver Watch",
      price: 180.00,
      color: "Stainless",
      image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Aviator Frames",
      price: 85.00,
      color: "Tortoise",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 pb-12">
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="text-xs font-medium text-gray-400">
          <ol className="list-none p-0 inline-flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            </li>
            <span className="text-gray-300">›</span>
            <li>
              <Link href="/shop" className="hover:text-green-600 transition-colors">Shop</Link>
            </li>
            <span className="text-gray-300">›</span>
            <li className="text-gray-900 font-semibold">{product.category || 'Product'}</li>
          </ol>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Gallery + Main Image */}
          <div className="lg:col-span-5 flex flex-col-reverse lg:flex-row gap-3">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  className={`relative w-14 h-16 lg:w-14 lg:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${idx === 0 ? 'border-green-600 ring-1 ring-green-600 ring-offset-1' : 'border-transparent hover:border-gray-200'}`}
                >
                  <Image src={img} alt={`View ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1 aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden relative group">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:col-span-7 mt-6 lg:mt-0 space-y-6">
            
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-serif">{product.name}</h1>
              <div className="mt-2 flex items-center gap-4">
                <p className="text-xl font-semibold text-gray-900">₹{product.price.toFixed(2)}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 uppercase tracking-wide">
                  In Stock
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                Color: <span className="text-gray-500 font-normal capitalize">{selectedColor}</span>
              </h3>
              <div className="flex items-center gap-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-offset-2 transition-all ${selectedColor === color.name ? 'ring-green-600 scale-110' : 'ring-transparent hover:ring-gray-200'}`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name}
                  >
                    {selectedColor === color.name && <Check className={`w-3 h-3 ${color.name === 'Ivory' ? 'text-gray-900' : 'text-white'}`} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Select Size</h3>
                <button className="text-[10px] font-medium text-green-600 hover:text-green-700 underline underline-offset-2">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 rounded-lg text-xs font-medium transition-all border-2 flex items-center justify-center ${
                      selectedSize === size 
                        ? 'border-green-600 text-green-700 bg-green-50' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button 
                onClick={handleOpenOutfitModal}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg font-bold text-base shadow-md shadow-green-100 transition-all flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                Generate AI Outfit
              </button>
              <button 
                onClick={handleAddToCart}
                className="w-full h-12 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-900 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2"
              >
                Add to Cart
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-gray-100">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-500">
                  <feature.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-[10px] font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Styling Intelligence Section */}
        <div className="mt-8 lg:mt-12 bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3 h-3 text-green-600" />
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Styling Intelligence</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Complete the Look — <span className="text-gray-500 italic">Styled by AI</span>
              </h2>
            </div>
            <a href="#" className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700 transition-colors">
              See All Pairings <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-2.5 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-green-600 hover:text-white transition-colors z-10">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="px-1">
                  <h3 className="font-bold text-gray-900 text-xs leading-tight mb-0.5">{item.name}</h3>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-500">{item.color}</span>
                    <span className="font-medium text-green-600">₹{item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
