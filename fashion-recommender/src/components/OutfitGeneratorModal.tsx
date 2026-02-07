'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, ShoppingBag, Plus, Minus, Check, Download, RotateCcw, Wand2 } from 'lucide-react';
import Image from 'next/image';
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
  const [isGeneratingLook, setIsGeneratingLook] = useState(false);
  const [generatedLookUrl, setGeneratedLookUrl] = useState<string | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [showLookPopup, setShowLookPopup] = useState(false);
  const { addToCart, items: cartItems, updateQuantity, removeFromCart } = useCart();

  // Initialize selected items when recommendation changes
  useEffect(() => {
    if (recommendation?.items) {
      const allIds = new Set(recommendation.items.map((item: OutfitItem) => item.id));
      setSelectedItemIds(allIds);
    }
  }, [recommendation]);

  useEffect(() => {
    if (isOpen) {
      setGeneratedLookUrl(null);
      setGeneratedMessage('');
      setShowLookPopup(false);
    }
  }, [isOpen, recommendation]);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItemIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const selectAllItems = () => {
    if (recommendation?.items) {
      setSelectedItemIds(new Set(recommendation.items.map((item: OutfitItem) => item.id)));
    }
  };

  const deselectAllItems = () => {
    setSelectedItemIds(new Set());
  };

  if (!isOpen) return null;

  const handleGetLook = async () => {
    const selectedItems = items.filter(item => selectedItemIds.has(item.id));
    
    if (selectedItems.length === 0) {
      alert("Please select at least one item for the look");
      return;
    }
    
    setIsGeneratingLook(true);
    setGeneratedMessage('');
    try {
      const response = await fetch('/api/generate-look', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainProductId: product._id,
          items: selectedItems
        })
      });
      
      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedLookUrl(data.imageUrl);
        setGeneratedMessage(data.message || 'Your AI-generated look is ready!');
        setShowLookPopup(true);
      } else {
         console.warn("API returned no image");
         alert("Could not generate image. Please try again.");
      }
    } catch (error) {
      console.error('Error generating look:', error);
      alert("Error communicating with AI service.");
    } finally {
      setIsGeneratingLook(false);
    }
  };

  const handleDownloadLook = () => {
    if (!generatedLookUrl) return;
    const link = document.createElement('a');
    link.href = generatedLookUrl;
    link.download = `ai-look-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Use recommendation items if available
  const items: OutfitItem[] = recommendation?.items || [];

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

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

  // ========== LOOK POPUP CARD ==========
  if (showLookPopup && generatedLookUrl) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
          onClick={() => setShowLookPopup(false)}
        />

        {/* Popup Card */}
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-300">
          
          {/* Gradient Header */}
          <div className="relative px-6 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Your AI-Generated Look</h2>
                  <p className="text-purple-100 text-xs mt-0.5">{generatedMessage}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLookPopup(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image Display */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            <div className="p-6 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white">
                <img 
                  src={generatedLookUrl} 
                  alt="AI Generated Look"
                  className="w-auto h-auto object-contain"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '65vh',
                    display: 'block', 
                    margin: 'auto' 
                  }}
                />
                {/* AI Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Generated
                </div>
              </div>
            </div>

            {/* Selected Items Summary */}
            <div className="px-6 pb-4">
              <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                {items.filter(item => selectedItemIds.has(item.id)).map((item) => (
                  <div key={item.id} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">{item.name}</p>
                      <p className="text-xs text-green-600 font-bold">₹{item.price?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-900">Total: ₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => { setShowLookPopup(false); setGeneratedLookUrl(null); }}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <button 
                onClick={handleDownloadLook}
                className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                Save Image
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Outfit'}
              </button>
              <button 
                onClick={() => {
                  items.filter(item => selectedItemIds.has(item.id)).forEach(item => {
                    handleUpdateCart(item, 1);
                  });
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-green-200 transition-all transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                Buy All
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== MAIN MODAL (Outfit Selection) ==========
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-y-auto flex flex-col max-h-[95vh]">
        
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
            <div className="flex-1 overflow-visible">
              <div className="flex flex-col lg:flex-row min-h-full">
                
                {/* Left Column: Main Product Image */}
                <div className="w-full lg:w-[45%] bg-gradient-to-br from-gray-100 to-gray-50 p-2 flex items-center justify-center hidden lg:block">
                  <div className="relative w-full h-[400px] lg:h-full rounded-2xl overflow-visible shadow-lg group bg-white flex items-center justify-center">
                    <Image 
                      src={product?.imageUrl || product?.image} 
                      alt={product?.name || "Product"} 
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    
                    {/* Overlay Label */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl flex items-center justify-between text-xs border border-gray-200 shadow-md z-10">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-gray-700">Main Product</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Individual Pieces */}
                <div className="w-full lg:w-[55%] p-6 lg:p-8 flex flex-col h-full">
                  
                  {/* Selection Controls */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-600">
                      <span className="text-green-600 font-bold">{selectedItemIds.size}</span> of {items.length} items selected
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={selectAllItems}
                        className="text-xs font-medium text-green-600 hover:text-green-700 hover:underline"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button 
                        onClick={deselectAllItems}
                        className="text-xs font-medium text-gray-500 hover:text-gray-700 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                    {items.length > 0 ? (
                      items.map((item, idx) => {
                        const isSelected = selectedItemIds.has(item.id);
                        return (
                        <div 
                          key={item.id || idx} 
                          onClick={() => toggleItemSelection(item.id)}
                          className={`flex items-center gap-4 p-3 border-2 rounded-xl transition-all group cursor-pointer ${
                            isSelected 
                              ? 'border-green-500 bg-green-50/50 shadow-md' 
                              : 'border-gray-100 bg-white hover:border-gray-200'
                          }`}
                        >
                          {/* Selection Checkbox */}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected 
                              ? 'bg-green-500 text-white' 
                              : 'border-2 border-gray-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>

                          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
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
                                  <div className="flex items-center gap-3 bg-green-50 rounded-full px-2 py-1 border border-green-100" onClick={(e) => e.stopPropagation()}>
                                      <button 
                                          onClick={(e) => { e.stopPropagation(); handleUpdateCart(item, -1); }}
                                          className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm hover:text-green-700 hover:shadow transition-all"
                                      >
                                          <Minus className="w-4 h-4" />
                                      </button>
                                      <span className="text-sm font-bold text-green-700 w-4 text-center">{cartItem.quantity}</span>
                                      <button 
                                          onClick={(e) => { e.stopPropagation(); handleUpdateCart(item, 1); }}
                                          className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white shadow-sm hover:bg-green-700 hover:shadow transition-all"
                                      >
                                          <Plus className="w-4 h-4" />
                                      </button>
                                  </div>
                              ) : (
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); handleUpdateCart(item, 1); }}
                                      className="w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm hover:shadow"
                                  >
                                      <Plus className="w-5 h-5" />
                                  </button>
                              );
                          })()}
                        </div>
                        );
                      })
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
              
              {/* Generating Look Loading State */}
              {isGeneratingLook && (
                <div className="flex items-center gap-3 text-purple-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm font-medium">AI is creating your look with real product images... This may take 1-2 minutes</span>
                </div>
              )}

              <div className="flex gap-3 ml-auto">
                <button 
                  onClick={handleGetLook}
                  disabled={isGeneratingLook || selectedItemIds.size === 0}
                  className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-95 disabled:opacity-50 ${
                    selectedItemIds.size > 0 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isGeneratingLook ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Get Look ({selectedItemIds.size} items)
                    </>
                  )}
                </button>
                
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Look'}
                </button>
                <button 
                  onClick={() => {
                    items.filter(item => selectedItemIds.has(item.id)).forEach(item => {
                      handleUpdateCart(item, 1);
                    });
                  }}
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all transform active:scale-95"
                >
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
