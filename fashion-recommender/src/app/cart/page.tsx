'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  Sparkles, 
  Lock, 
  CreditCard
} from 'lucide-react';

import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items: cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  
  const tax = cartTotal * 0.085; // 8.5% tax
  const total = cartTotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
             <div className="bg-white p-6 rounded-full inline-block mb-4 shadow-sm">
               <ArrowLeft className="w-8 h-8 text-gray-400" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
             <p className="text-gray-500 mb-8">Looks like you haven't added any items yet.</p>
             <Link href="/shop" className="inline-block px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-200">
               Start Shopping
             </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Your Cart <span className="text-gray-400 font-normal text-lg ml-2">({cartItems.length} items)</span>
          </h1>
          <Link href="/shop" className="flex items-center gap-2 text-green-600 font-medium hover:text-green-700 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div key={item.cartId} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-start">
                {/* Image */}
                <Link href={`/products/${item.id}`} className="w-full sm:w-24 aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative cursor-pointer block">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-1">
                    <Link href={`/products/${item.id}`} className="hover:text-green-600 transition-colors">
                      <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                    </Link>
                    <p className="text-base font-bold text-gray-900">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                    {item.size && <span>Size: <span className="text-gray-900 font-medium">{item.size}</span></span>}
                    {item.size && <span className="text-gray-300">|</span>}
                    {item.color && <span>Color: <span className="text-gray-900 font-medium">{item.color}</span></span>}
                  </div>

                  {/* Note: aiRecommendation is not currently in CartItem interface, hiding for now unless added to context */}

                  <div className="flex items-center justify-between mt-auto">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-gray-900 w-4 text-center text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      className="flex items-center gap-1.5 text-red-400 hover:text-red-500 text-xs font-medium transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Summary */}
          <div className="w-full lg:w-[360px] flex-shrink-0 space-y-4">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-100 my-3" />
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-green-500">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">Promo Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs rounded-lg transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              <Link href="/checkout" className="block w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-center text-sm shadow-lg shadow-green-200 hover:shadow-green-300 transition-all transform hover:-translate-y-0.5">
                Checkout Securely
              </Link>

              <div className="mt-4 flex flex-col items-center gap-2 text-gray-400">
                <div className="flex items-center gap-1.5 text-[10px] font-medium">
                  <Lock className="w-3 h-3" />
                  SSL Encrypted & Secure Payment
                </div>
                <div className="flex gap-2 opacity-50">
                   <CreditCard className="w-5 h-3" />
                   <CreditCard className="w-5 h-3" />
                   <CreditCard className="w-5 h-3" />
                </div>
              </div>
            </div>

            {/* AI Stylist Tip */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100 border-dashed relative overflow-hidden">
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-green-100 rounded-full blur-2xl opacity-50" />
               
               <div className="flex gap-3 relative z-10">
                 <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 text-base">
                   💡
                 </div>
                 <div className="space-y-0.5">
                   <h3 className="text-xs font-bold text-green-800">AI Stylist Tip</h3>
                   <p className="text-xs text-green-700 leading-relaxed">
                     Adding our <span className="font-bold">Satin Scarf</span> would complete this outfit perfectly. 
                     <button className="ml-1 underline font-bold hover:text-green-900">Add for $45</button>
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
