'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  Lock, 
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowRight
} from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';

export default function CartPage() {
  const { items: cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { setIsCheckoutOpen } = useCheckout();
  
  const gst = cartTotal * 0.18; // 18% GST
  const total = cartTotal + gst;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
             <div className="w-20 h-20 bg-white rounded-full inline-flex items-center justify-center mb-6 shadow-sm border border-gray-100">
               <ShoppingBag className="w-9 h-9 text-gray-300" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
             <p className="text-gray-400 mb-8 text-sm">Looks like you haven&apos;t added any items yet.</p>
             <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold text-sm transition-all shadow-lg shadow-green-600/20">
               Start Shopping
               <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans text-gray-900 overflow-hidden">
      <Navbar />

      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0 mb-3">
          <h1 className="text-xl font-bold text-gray-900">
            Your Cart <span className="text-gray-400 font-normal text-sm ml-1">({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={clearCart}
              className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
            <Link href="/shop" className="flex items-center gap-1 text-green-600 font-medium hover:text-green-700 transition-colors text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Content: Items + Summary side-by-side, filling remaining space */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
          {/* Left Column: Cart Items (scrollable) */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2.5 hide-scrollbar">
            {cartItems.map((item) => (
              <div key={item.cartId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-3 sm:p-4 flex flex-row gap-3">
                  {/* Image */}
                  <Link href={`/products/${item.id}`} className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative cursor-pointer block border border-gray-100">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    {/* Top: Name, Variant, Price */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <Link href={`/products/${item.id}`} className="hover:text-green-600 transition-colors">
                          <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">{item.name}</h3>
                        </Link>
                        <div className="flex flex-wrap gap-x-2 text-[11px] text-gray-400 mt-0.5">
                          {item.size && (
                            <span>Size: <span className="text-gray-600 font-medium">{item.size}</span></span>
                          )}
                          {item.color && (
                            <span>Color: <span className="text-gray-600 font-medium">{item.color}</span></span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-gray-400">₹{item.price.toFixed(2)} each</p>
                        )}
                      </div>
                    </div>

                    {/* Bottom: Quantity + Remove */}
                    <div className="flex items-center justify-between mt-1.5">
                      {/* Quantity Controls */}
                      <div className="inline-flex items-center border border-gray-200 rounded-md overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <div className="w-8 h-7 flex items-center justify-center border-x border-gray-200 bg-gray-50">
                          <span className="font-bold text-xs text-gray-900">{item.quantity}</span>
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button 
                        onClick={() => removeFromCart(item.cartId)}
                        className="flex items-center gap-1 text-red-400 hover:text-red-500 text-[11px] font-semibold transition-colors px-1.5 py-0.5 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Summary (fixed, no scroll) */}
          <div className="w-full lg:w-[340px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full flex flex-col">
              <h2 className="text-base font-bold text-gray-900 mb-3">Order Summary</h2>
              
              <div className="space-y-2.5 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-gray-900">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-semibold text-green-600 uppercase text-xs tracking-wide">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST (18%)</span>
                  <span className="font-semibold text-gray-900">₹{gst.toFixed(2)}</span>
                </div>
                
                <div className="h-px bg-gray-100 !my-3" />
                
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">Inclusive of all taxes</p>
                  </div>
                  <span className="text-xl font-bold text-green-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button onClick={() => setIsCheckoutOpen(true)} className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transition-all transform hover:-translate-y-0.5">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Badges */}
              <div className="mt-auto pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <Lock className="w-3 h-3 flex-shrink-0 text-gray-300" />
                  <span>SSL Encrypted & Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <ShieldCheck className="w-3 h-3 flex-shrink-0 text-gray-300" />
                  <span>100% Purchase Protection</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <Truck className="w-3 h-3 flex-shrink-0 text-gray-300" />
                  <span>Free Express Shipping on all orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
