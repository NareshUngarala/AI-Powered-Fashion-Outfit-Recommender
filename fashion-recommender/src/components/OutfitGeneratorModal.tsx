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
}

export default function OutfitGeneratorModal({ isOpen, onClose }: OutfitGeneratorModalProps) {
  const [activeTab, setActiveTab] = useState<'Casual' | 'Office' | 'Evening'>('Casual');

  if (!isOpen) return null;

  // Static Data for the "Casual" Look (matching the image)
  const items: OutfitItem[] = [
    {
      id: '1',
      name: 'Linen Blend Overshirt',
      category: 'Tops',
      color: 'Moss Green',
      price: 89.00,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: '2',
      name: 'Slim Fit Chinos',
      category: 'Bottoms',
      color: 'Sand',
      price: 110.00,
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: '3',
      name: 'Premium Court Sneaker',
      category: 'Footwear',
      color: 'White',
      price: 150.00,
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: '4',
      name: 'Utility Field Jacket',
      category: 'Outerwear',
      color: 'Navy',
      price: 175.00,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=200'
    }
  ];

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const discount = totalPrice * 0.10;
  const discountedPrice = totalPrice - discount;

  // Full body generated image placeholder
  const generatedLookImage = "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=600"; 

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

        {/* Tabs */}
        <div className="flex justify-center py-2 bg-white border-b border-gray-50">
          <div className="flex p-1 bg-gray-100 rounded-full scale-90">
            {(['Casual', 'Office', 'Evening'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
              <h3 className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-3">Individual Pieces</h3>
              
              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 border border-gray-100 rounded-xl hover:border-green-100 hover:shadow-sm transition-all group bg-white">
                    <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-xs truncate">{item.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {item.category} • <span className="text-gray-700">{item.color}</span>
                      </p>
                      <p className="font-bold text-gray-900 text-xs mt-0.5">${item.price.toFixed(2)}</p>
                    </div>
                    <button className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-white flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Total</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">${discountedPrice.toFixed(0)}</span>
              <span className="text-sm text-gray-400 line-through decoration-gray-300">${totalPrice.toFixed(0)}</span>
              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">-10%</span>
            </div>
          </div>
          
          <button className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all transform active:scale-95">
            <ShoppingBag className="w-4 h-4" />
            Buy All
          </button>
        </div>

      </div>
    </div>
  );
}
