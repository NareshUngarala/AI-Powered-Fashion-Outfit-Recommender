'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  ShoppingBag, 
  CheckCircle2, 
  MapPin, 
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Smartphone,
  Banknote,
  X,
  Truck,
  Package
} from 'lucide-react';

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen } = useCheckout();
  const [step, setStep] = useState(1);
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('cod');
  const [orderId, setOrderId] = useState('');
  const [mounted, setMounted] = useState(false);

  const gst = cartTotal * 0.18;
  const total = cartTotal + gst;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [cardData, setCardData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCheckoutOpen]);

  // Reset step when modal opens
  useEffect(() => {
    if (isCheckoutOpen) {
      setStep(1);
      setError('');
      setFormError('');
    }
  }, [isCheckoutOpen]);

  const handleClose = () => {
    setIsCheckoutOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.streetAddress || !formData.city || !formData.state || !formData.pincode) {
      setFormError('Please fill in all required fields.');
      return false;
    }
    if (formData.phone.length < 10) {
      setFormError('Please enter a valid phone number.');
      return false;
    }
    if (formData.pincode.length < 6) {
      setFormError('Please enter a valid 6-digit pincode.');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total,
          shippingAddress: formData
        })
      });

      const data = await response.json();

      if (data.success) {
        setOrderId(data.data?.orderId || '');
        clearCart();
        setStep(3);
      } else {
        setError(data.message || 'Order failed. Please try again.');
      }
    } catch {
      setError('An error occurred during checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  const renderContent = () => {
    // Not signed in
    if (!session) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex justify-end p-4">
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full inline-flex items-center justify-center mb-5 shadow-sm border border-gray-100">
                <Lock className="w-7 h-7 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
              <p className="text-gray-400 text-sm mb-6">You need to be logged in to complete your checkout.</p>
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
      );
    }

    // Empty cart (but not on success step)
    if (items.length === 0 && step !== 3) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex justify-end p-4">
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full inline-flex items-center justify-center mb-5 shadow-sm border border-gray-100">
                <ShoppingBag className="w-7 h-7 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
              <p className="text-gray-400 text-sm mb-6">Add some items to your cart before checking out.</p>
              <button
                onClick={() => { handleClose(); router.push('/shop'); }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold text-sm transition-all shadow-lg shadow-green-600/20"
              >
                Go Shopping
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Order success - animated
    if (step === 3) {
      const now = new Date();
      const deliveryStart = new Date(now);
      deliveryStart.setDate(now.getDate() + 5);
      const deliveryEnd = new Date(now);
      deliveryEnd.setDate(now.getDate() + 7);
      const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

      return (
        <div className="h-full flex flex-col bg-gray-50/80">
          {/* Close button */}
          <div className="flex justify-end px-4 pt-3 pb-1">
            <button onClick={handleClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="max-w-md w-full">

              {/* Success icon with confetti */}
              <div className="relative flex flex-col items-center mb-4">
                {/* Confetti dots */}
                <div className="absolute -top-1 left-[30%] w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.8s' }} />
                <div className="absolute top-0 right-[28%] w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.5s' }} />
                <div className="absolute top-2 left-[22%] w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '2s' }} />
                <div className="absolute -top-2 right-[35%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '100ms', animationDuration: '1.6s' }} />
                <div className="absolute top-4 right-[22%] w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1.7s' }} />
                <div className="absolute top-1 left-[42%] w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '500ms', animationDuration: '1.4s' }} />

                {/* Icon */}
                <div className="relative">
                  <div className="absolute inset-0 w-14 h-14 rounded-full bg-green-200 animate-ping opacity-20" />
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              {/* Title & subtitle */}
              <div className="text-center mb-5">
                <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Order Placed!</h2>
                <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">
                  Your wardrobe just got a whole lot better. We&apos;ve received your order and our stylists are preparing it with care.
                </p>
              </div>

              {/* Delivery Journey Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="w-3.5 h-3.5 text-gray-700" />
                  <h3 className="text-xs font-bold text-gray-900">Delivery Journey</h3>
                </div>

                <div className="relative pl-4">
                  {/* Vertical line */}
                  <div className="absolute left-[11px] top-[10px] bottom-[10px] w-[2px] bg-gray-100" />
                  <div className="absolute left-[11px] top-[10px] w-[2px] bg-green-500" style={{ height: '44px' }} />

                  {/* Step 1 - Order Confirmed (completed) */}
                  <div className="relative flex items-start gap-3 mb-4">
                    <div className="relative z-10 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 -ml-[14px]">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <div className="-mt-0.5">
                      <p className="text-xs font-semibold text-gray-900">Order Confirmed</p>
                      <p className="text-[11px] text-gray-400">Today, {formatTime(now)}</p>
                    </div>
                  </div>

                  {/* Step 2 - Preparing (active) */}
                  <div className="relative flex items-start gap-3 mb-4">
                    <div className="relative z-10 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 -ml-[14px] animate-pulse">
                      <Package className="w-3 h-3 text-white" />
                    </div>
                    <div className="-mt-0.5">
                      <p className="text-xs font-semibold text-gray-900">Preparing your package</p>
                      <p className="text-[11px] text-gray-400">Estimated completion by tomorrow</p>
                    </div>
                  </div>

                  {/* Step 3 - Out for delivery (pending) */}
                  <div className="relative flex items-start gap-3 mb-4">
                    <div className="relative z-10 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 -ml-[14px]">
                      <Truck className="w-3 h-3 text-gray-400" />
                    </div>
                    <div className="-mt-0.5">
                      <p className="text-xs text-gray-400">Out for delivery</p>
                      <p className="text-[11px] text-gray-300">Coming soon to your doorstep</p>
                    </div>
                  </div>

                  {/* Step 4 - Delivered (pending) */}
                  <div className="relative flex items-start gap-3">
                    <div className="relative z-10 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 -ml-[14px]">
                      <Banknote className="w-3 h-3 text-gray-400" />
                    </div>
                    <div className="-mt-0.5">
                      <p className="text-xs text-gray-400">Delivered</p>
                      <p className="text-[11px] text-gray-300">Estimated: {formatDate(deliveryStart)} - {formatDate(deliveryEnd)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <button
                  onClick={() => { handleClose(); router.push('/profile'); }}
                  className="inline-flex items-center justify-center gap-2 px-7 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold text-xs transition-all shadow-md shadow-green-500/20"
                >
                  Track Order
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { handleClose(); router.push('/shop'); }}
                  className="inline-flex items-center justify-center gap-2 px-7 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full font-semibold text-xs hover:bg-gray-50 transition-all"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Order ID */}
              {orderId && (
                <p className="text-center text-[11px] text-gray-400">
                  Order ID: <span className="font-medium text-gray-500">#{orderId}</span>
                </p>
              )}

            </div>
          </div>
        </div>
      );
    }

    // Main checkout form
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 flex-shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>1</div>
              <span className={`text-xs font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Shipping</span>
            </div>
            <div className={`w-10 h-[2px] rounded-full ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`} />
            <div className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>2</div>
              <span className={`text-xs font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Payment</span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-900" />
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row gap-5">
              {/* Left Column: Form Steps */}
              <div className="flex-1">
                {step === 1 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h2 className="text-base font-bold text-gray-900">Shipping Information</h2>
                    </div>

                    {formError && (
                      <div className="mb-4 p-2.5 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {formError}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="co-firstName" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">First Name *</label>
                          <input 
                            type="text" name="firstName" id="co-firstName"
                            value={formData.firstName} onChange={handleInputChange}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-300"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="co-lastName" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Last Name *</label>
                          <input 
                            type="text" name="lastName" id="co-lastName"
                            value={formData.lastName} onChange={handleInputChange}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-300"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="co-phone" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number *</label>
                          <input 
                            type="tel" name="phone" id="co-phone"
                            value={formData.phone} onChange={handleInputChange}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-300"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="co-streetAddress" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Street Address *</label>
                          <input 
                            type="text" name="streetAddress" id="co-streetAddress"
                            value={formData.streetAddress} onChange={handleInputChange}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-300"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label htmlFor="co-city" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">City *</label>
                          <input 
                            type="text" name="city" id="co-city"
                            value={formData.city} onChange={handleInputChange}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-300"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="co-state" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">State *</label>
                          <input 
                            type="text" name="state" id="co-state"
                            value={formData.state} onChange={handleInputChange}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-300"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="co-pincode" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pincode *</label>
                          <input 
                            type="text" name="pincode" id="co-pincode"
                            value={formData.pincode} onChange={handleInputChange}
                            maxLength={6}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-300"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (validateStep1()) setStep(2);
                      }}
                      className="w-full mt-5 flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all"
                    >
                      Continue to Payment
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1.5 mt-3 px-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <p className="text-[10px] text-gray-400">Your personal data will be used to process your order and support your experience.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Demo Notice */}
                    <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <p className="text-xs text-amber-700">
                        Demo checkout — no actual payment will be processed.
                      </p>
                    </div>

                    {/* Shipping Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shipping to</span>
                        <button onClick={() => setStep(1)} className="text-[11px] font-semibold text-green-600 hover:text-green-700 transition-colors">
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-gray-900 font-semibold">{formData.firstName} {formData.lastName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formData.streetAddress}, {formData.city}, {formData.state} - {formData.pincode} &middot; {formData.phone}</p>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-2.5">
                      {/* Credit/Debit Card */}
                      <div 
                        onClick={() => setPaymentMethod('card')}
                        className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all ${
                          paymentMethod === 'card' ? 'border-2 border-green-500' : 'border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === 'card' ? 'border-green-500' : 'border-gray-300'
                            }`}>
                              {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">Credit or Debit Card</p>
                              <p className="text-[11px] text-gray-400">Visa, Mastercard, Amex</p>
                            </div>
                          </div>
                          <CreditCard className="w-4 h-4 text-gray-400" />
                        </div>

                        {paymentMethod === 'card' && (
                          <div className="space-y-2.5 pl-7 mt-3.5">
                            <div className="grid grid-cols-2 gap-2.5">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cardholder Name</label>
                                <input type="text" value={cardData.cardholderName} onChange={(e) => setCardData(prev => ({ ...prev, cardholderName: e.target.value }))} placeholder="John Doe" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Card Number</label>
                                <input type="text" value={cardData.cardNumber} onChange={(e) => setCardData(prev => ({ ...prev, cardNumber: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() }))} maxLength={19} placeholder="1234 5678 9012 3456" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Expiry Date</label>
                                <input type="text" value={cardData.expiry} onChange={(e) => { let v = e.target.value.replace(/\D/g, ''); if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2); setCardData(prev => ({ ...prev, expiry: v })); }} maxLength={5} placeholder="MM/YY" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">CVV</label>
                                <input type="password" value={cardData.cvv} onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))} maxLength={4} placeholder="***" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* UPI */}
                      <div 
                        onClick={() => setPaymentMethod('upi')}
                        className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all ${
                          paymentMethod === 'upi' ? 'border-2 border-green-500' : 'border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === 'upi' ? 'border-green-500' : 'border-gray-300'
                            }`}>
                              {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">UPI</p>
                              <p className="text-[11px] text-gray-400">Google Pay, PhonePe, Paytm & more</p>
                            </div>
                          </div>
                          <Smartphone className="w-4 h-4 text-gray-400" />
                        </div>

                        {paymentMethod === 'upi' && (
                          <div className="pl-7 mt-3">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">UPI ID</label>
                            <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                            <p className="text-[10px] text-gray-400 mt-1.5">A payment request will be sent to your UPI app.</p>
                          </div>
                        )}
                      </div>

                      {/* Cash on Delivery */}
                      <div 
                        onClick={() => setPaymentMethod('cod')}
                        className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all ${
                          paymentMethod === 'cod' ? 'border-2 border-green-500' : 'border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === 'cod' ? 'border-green-500' : 'border-gray-300'
                            }`}>
                              {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">Cash on Delivery</p>
                              <p className="text-[11px] text-gray-400">Pay when your order arrives</p>
                            </div>
                          </div>
                          <Banknote className="w-4 h-4 text-gray-400" />
                        </div>

                        {paymentMethod === 'cod' && (
                          <div className="pl-7 mt-2.5">
                            <p className="text-[10px] text-gray-400">No advance payment required. Pay at delivery.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {error && (
                      <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    {/* Back + Trust badges */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setStep(1)}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-1.5 text-gray-400 font-medium text-xs hover:text-gray-900 transition-colors disabled:opacity-50"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Shipping
                      </button>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <ShieldCheck className="w-3 h-3" />
                          SSL
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <Lock className="w-3 h-3" />
                          Encrypted
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <CreditCard className="w-3 h-3" />
                          PCI
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary */}
              <div className="w-full lg:w-[340px] flex-shrink-0">
                <div className={`rounded-xl p-4 sm:p-5 ${step === 2 ? 'bg-gray-900 shadow-xl' : 'bg-white shadow-sm border border-gray-100'}`}>
                  <h2 className={`text-sm font-bold mb-3 ${step === 2 ? 'text-white' : 'text-gray-900'}`}>Order Summary</h2>
                  
                  {/* Items */}
                  <div className="space-y-2.5 mb-3 max-h-[180px] overflow-y-auto hide-scrollbar">
                    {items.map((item) => (
                      <div key={item.cartId} className="flex gap-3">
                        <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative ${step === 2 ? 'bg-gray-800' : 'bg-gray-50 border border-gray-100'}`}>
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                          {item.quantity > 1 && (
                            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                              {item.quantity}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold truncate ${step === 2 ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
                          <p className="text-[10px] uppercase tracking-wide text-gray-400">
                            {item.size && `${item.size}`}
                            {item.size && item.color && ' · '}
                            {item.color && `${item.color}`}
                          </p>
                        </div>
                        <span className={`text-xs font-bold flex-shrink-0 ${step === 2 ? 'text-white' : 'text-gray-900'}`}>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className={`border-t pt-3 space-y-1.5 ${step === 2 ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="flex justify-between text-xs">
                      <span className={step === 2 ? 'text-gray-400' : 'text-gray-500'}>Subtotal</span>
                      <span className={`font-medium ${step === 2 ? 'text-white' : 'text-gray-900'}`}>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={step === 2 ? 'text-gray-400' : 'text-gray-500'}>Shipping</span>
                      <span className="font-bold text-green-500 text-[10px] uppercase tracking-wide">Free</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={step === 2 ? 'text-gray-400' : 'text-gray-500'}>GST (18%)</span>
                      <span className={`font-medium ${step === 2 ? 'text-white' : 'text-gray-900'}`}>₹{gst.toFixed(2)}</span>
                    </div>
                    <div className={`h-px !my-2.5 ${step === 2 ? 'bg-gray-700' : 'bg-gray-100'}`} />
                    <div className="flex justify-between items-baseline">
                      <span className={`text-sm font-bold ${step === 2 ? 'text-white' : 'text-gray-900'}`}>Total</span>
                      <div className="text-right">
                        <span className={`text-lg font-bold ${step === 2 ? 'text-white' : 'text-green-600'}`}>₹{total.toFixed(2)}</span>
                        {step === 1 && <p className="text-[9px] text-gray-400 mt-0.5">Inclusive of all taxes</p>}
                      </div>
                    </div>
                  </div>

                  {/* Pay button on payment step */}
                  {step === 2 && (
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            {paymentMethod === 'cod' ? (
                              <>
                                <Banknote className="w-4 h-4" />
                                Place Order (COD)
                              </>
                            ) : paymentMethod === 'upi' ? (
                              <>
                                <Smartphone className="w-4 h-4" />
                                Pay via UPI
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                Pay Securely Now
                              </>
                            )}
                          </>
                        )}
                      </button>
                      <p className="text-[9px] text-gray-500 text-center leading-relaxed">
                        By placing this order, you agree to Style Genie&apos;s{' '}
                        <Link href="#" className="underline text-gray-400 hover:text-white">Terms</Link> &{' '}
                        <Link href="#" className="underline text-gray-400 hover:text-white">Privacy Policy</Link>.
                      </p>
                    </div>
                  )}
                </div>

                {/* Trust badge (shipping step only) */}
                {step === 1 && (
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 py-2">
                    <Lock className="w-3 h-3 text-green-500" />
                    <span>Secure 256-bit SSL encrypted payment</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  return (
    <div 
      className={`fixed inset-0 z-[70] transition-all duration-300 ${
        isCheckoutOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          isCheckoutOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal Panel */}
      <div 
        className={`absolute inset-0 bg-gray-50 text-gray-900 transition-transform duration-500 ease-out ${
          isCheckoutOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
}
