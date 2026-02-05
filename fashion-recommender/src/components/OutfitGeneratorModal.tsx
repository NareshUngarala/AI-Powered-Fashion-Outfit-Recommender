'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, ShoppingBag, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useCart } from '@/context/CartContext';

interface OutfitItem {
  id: string;
  name: string;
  category: string;
  color: string;
  price: number;
  image: string;
}

interface OutfitGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recommendation?: any;
  isLoading?: boolean;
  onRegenerate?: (occasion: string, gender: string) => void;
}

export default function OutfitGeneratorModal({ isOpen, onClose, product, recommendation, isLoading, onRegenerate }: OutfitGeneratorModalProps) {
  const [activeTab, setActiveTab] = useState<'Casual' | 'Office' | 'Evening'>('Casual');
  const [activeGender, setActiveGender] = useState<'Men' | 'Women' | 'Unisex'>('Unisex');
  const [isSaving, setIsSaving] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { addToCart, items: cartItems, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setIsAddedToCart(false);
    }
  }, [isOpen, recommendation]);

  if (!isOpen) return null;

  const handleTabChange = (tab: 'Casual' | 'Office' | 'Evening') => {
    setActiveTab(tab);
    onRegenerate?.(tab, activeGender);
  };

  const handleGenderChange = (gender: 'Men' | 'Women' | 'Unisex') => {
    setActiveGender(gender);
    onRegenerate?.(activeTab, gender);
  };

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    // In a real app, this would call addToCart context
  };

  // Use recommendation items if available, otherwise fallback to empty or static
  const items: OutfitItem[] = recommendation?.items || [];
  const styleAdvice = recommendation?.styleAdvice || "Select a style to generate an outfit.";


  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const discount = totalPrice * 0.10;
  const discountedPrice = totalPrice - discount;

  const getCartItem = (itemId: string, itemColor: string) => {
    return cartItems.find(item => item.id === itemId && item.size === 'M' && item.color === itemColor);
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

  // Full body generated image placeholder
  const generatedLookImage = "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=600"; 

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainProductId: product._id,
          name: `${activeTab} Outfit for ${product.name}`,
          items: items.map(item => ({
             category: item.category,
             name: item.name,
             color: item.color,
             price: item.price,
             image: item.image,
             reason: "Matched by AI"
          })),
          styleAdvice: "This look is perfect for a " + activeTab.toLowerCase() + " setting."
        })
      });
      
      if (response.ok) {
        alert('Outfit saved successfully!');
      } else {
        const data = await response.json();
        alert('Failed to save: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error(error);
      alert('Error saving outfit');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 relative">
          <div className="flex-1 flex justify-center">
             <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Your AI-Generated Look</h2>
             </div>
          </div>
          
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-medium">Styling your outfit...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Body */}
            <div className="flex-1 overflow-hidden">
              <div className="flex flex-col lg:flex-row h-full">
                
                {/* Left Column: Main Product Image */}
                <div className="hidden lg:block w-[45%] bg-gray-50 p-6">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm">
                    <Image 
                      src={product?.imageUrl || product?.image} 
                      alt={product?.name || "Product"} 
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl flex items-center justify-between text-xs border border-white/50 shadow-sm z-10">
                      <span className="font-bold text-gray-700">Main Product</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Individual Pieces */}
                <div className="w-full lg:w-[55%] p-6 lg:p-8 flex flex-col h-full">
                  
                  <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                    {items.length > 0 ? (
                      items.map((item, idx) => (
                        <div key={item.id || idx} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:border-green-100 hover:shadow-md transition-all group bg-white">
                          <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                            {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0 py-1">
                            <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.category} • <span className="text-gray-700 font-medium">{item.color}</span>
                            </p>
                            <p className="font-bold text-green-700 text-sm mt-1">₹{item.price ? item.price.toFixed(2) : 'N/A'}</p>
                          </div>
                          {(() => {
                              const cartItem = getCartItem(item.id, item.color);
                              return cartItem ? (
                                  <div className="flex items-center gap-3 bg-green-50 rounded-full px-2 py-1 border border-green-100">
                                      <button 
                                          onClick={() => handleUpdateCart(item, -1)}
                                          className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm hover:text-green-700 hover:shadow transition-all"
                                      >
                                          <Minus className="w-4 h-4" />
                                      </button>
                                      <span className="text-sm font-bold text-green-700 w-4 text-center">{cartItem.quantity}</span>
                                      <button 
                                          onClick={() => handleUpdateCart(item, 1)}
                                          className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white shadow-sm hover:bg-green-700 hover:shadow transition-all"
                                      >
                                          <Plus className="w-4 h-4" />
                                      </button>
                                  </div>
                              ) : (
                                  <button 
                                      onClick={() => handleUpdateCart(item, 1)}
                                      className="w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm hover:shadow"
                                  >
                                      <Plus className="w-5 h-5" />
                                  </button>
                              );
                          })()}
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p className="text-xs">No items found for this style.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-white flex items-center justify-end gap-4">
              
              <div className="flex gap-3">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Look'}
                </button>
                <button className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all transform active:scale-95">
                  <ShoppingBag className="w-5 h-5" />
                  Buy All
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
