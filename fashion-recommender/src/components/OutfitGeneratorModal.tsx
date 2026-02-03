'use client';

import { useState } from 'react';
import { X, Sparkles, ShoppingBag, Plus } from 'lucide-react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

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

  if (!isOpen) return null;

  const handleTabChange = (tab: 'Casual' | 'Office' | 'Evening') => {
    setActiveTab(tab);
    onRegenerate?.(tab, activeGender);
  };

  const handleGenderChange = (gender: 'Men' | 'Women' | 'Unisex') => {
    setActiveGender(gender);
    onRegenerate?.(activeTab, gender);
  };

  // Use recommendation items if available, otherwise fallback to empty or static
  const items: OutfitItem[] = recommendation?.items || [];
  const styleAdvice = recommendation?.styleAdvice || "Select a style to generate an outfit.";


  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const discount = totalPrice * 0.10;
  const discountedPrice = totalPrice - discount;

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
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex-1 flex justify-center">
             <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-600" />
                <h2 className="text-lg font-bold text-gray-900">Your AI-Generated Look</h2>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
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
            {/* Tabs & Gender */}
            <div className="flex flex-col gap-1 items-center justify-center py-3 bg-white border-b border-gray-50">
              {/* Occasion */}
              <div className="flex p-1 bg-gray-100 rounded-full scale-90">
                {(['Casual', 'Office', 'Evening'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={twMerge(
                      "px-4 py-1 rounded-full text-xs font-medium transition-all",
                      activeTab === tab 
                        ? "bg-white text-gray-900 shadow-sm" 
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Gender */}
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">For:</span>
                 <div className="flex p-0.5 bg-gray-100 rounded-full scale-90">
                    {(['Men', 'Women', 'Unisex'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => handleGenderChange(g)}
                        className={twMerge(
                          "px-3 py-0.5 rounded-full text-[10px] font-medium transition-all",
                          activeGender === g 
                            ? "bg-white text-gray-900 shadow-sm" 
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                 </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden">
              <div className="flex flex-col lg:flex-row h-full">
                
                {/* Left Column: Generated Image */}
                <div className="hidden lg:block w-[40%] bg-gray-50 p-4">
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm">
                    <Image 
                      src={generatedLookImage} 
                      alt="AI Generated Look" 
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg flex items-center justify-between text-[10px] border border-white/50 shadow-sm z-10">
                      <span className="font-medium text-gray-600">AI-Generated</span>
                      <span className="text-gray-400">#FA-2940</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Individual Pieces */}
                <div className="w-full lg:w-[60%] p-4 lg:p-5 flex flex-col h-full">
                  <div className="bg-green-50 p-3 rounded-xl mb-4 border border-green-100">
                     <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-700 italic">{styleAdvice}</p>
                     </div>
                  </div>

                  <h3 className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-3">Individual Pieces</h3>
                  
                  <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                    {items.length > 0 ? (
                      items.map((item, idx) => (
                        <div key={item.id || idx} className="flex items-center gap-3 p-2 border border-gray-100 rounded-xl hover:border-green-100 hover:shadow-sm transition-all group bg-white">
                          <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-xs truncate">{item.name}</h4>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {item.category} • <span className="text-gray-700">{item.color}</span>
                            </p>
                            <p className="font-bold text-gray-900 text-xs mt-0.5">₹{item.price ? item.price.toFixed(2) : 'N/A'}</p>
                          </div>
                          <button className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all">
                            <Plus className="w-3 h-3" />
                          </button>
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
            <div className="px-5 py-3 border-t border-gray-100 bg-white flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Total</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">₹{discountedPrice.toFixed(0)}</span>
                  <span className="text-sm text-gray-400 line-through decoration-gray-300">₹{totalPrice.toFixed(0)}</span>
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">-10%</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Look'}
                </button>
                <button className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all transform active:scale-95">
                  <ShoppingBag className="w-4 h-4" />
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
