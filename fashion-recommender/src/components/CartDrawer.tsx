'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingBag, 
  X, 
  Minus, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Lock 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    cartCount, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop & Drawer Container */}
      <div 
        className={`fixed inset-0 z-[60] flex justify-end transition-visibility duration-300 ${
          isCartOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
            isCartOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsCartOpen(false)}
        />

        {/* Drawer Panel */}
        <div 
          className={`relative w-full max-w-[420px] bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-gray-900 fill-gray-900" />
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Cart</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">
                {cartCount} items
              </span>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Cart Items (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">Your cart is empty</p>
                  <p className="text-sm text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 py-2">
                    {/* Image */}
                    <div className="w-20 h-26 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative shadow-sm border border-gray-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-bold text-gray-900 truncate leading-tight pr-2">{item.name}</h4>
                          <span className="text-sm font-bold text-gray-900 whitespace-nowrap">₹{item.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium mt-1">{item.size || 'M'} • {item.color || 'Standard'}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                          <button 
                            onClick={() => updateQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 flex items-center justify-center bg-white rounded-md text-gray-600 shadow-sm hover:text-gray-900 transition-all active:scale-95"
                          >
                            <Minus className="w-3 h-3" strokeWidth={2.5} />
                          </button>
                          <span className="text-xs font-bold text-gray-900 w-6 text-center tabular-nums">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-white rounded-md text-gray-600 shadow-sm hover:text-gray-900 transition-all active:scale-95"
                          >
                            <Plus className="w-3 h-3" strokeWidth={2.5} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 uppercase tracking-wider px-2 py-1 rounded-md hover:bg-red-50"
                        >
                          <X className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Upsell / Recommendation */}
                <div className="mt-2 p-4 bg-sky-50 rounded-xl flex items-center justify-between border border-sky-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-sky-500">
                      <Sparkles className="w-5 h-5 fill-sky-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mb-0.5">Matches Your Style</p>
                      <p className="text-xs font-bold text-gray-900">Premium Leather Belt</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-sky-600 hover:text-sky-700 underline decoration-2 underline-offset-2 whitespace-nowrap ml-2">
                    Add ₹2,499
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <span className="text-base font-medium text-gray-500">Subtotal</span>
                  <span className="text-3xl font-bold text-gray-900">₹{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="space-y-3">
                  <Link 
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-cyan-200 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Checkout <ArrowRight className="w-5 h-5" />
                  </Link>
                  
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Lock className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure SSL Encrypted Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
