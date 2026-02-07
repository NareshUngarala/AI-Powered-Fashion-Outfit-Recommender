'use client';

import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
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
  Banknote
} from 'lucide-react';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');

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

  // Not signed in
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <main className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 bg-white rounded-full inline-flex items-center justify-center mb-5 shadow-sm border border-gray-100">
            <Lock className="w-7 h-7 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-400 text-sm mb-6">You need to be logged in to complete your checkout.</p>
          <button 
            onClick={() => router.push('/auth/signin')} 
            className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold text-sm transition-all shadow-lg shadow-green-600/20"
          >
            Sign In to Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </main>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <main className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 bg-white rounded-full inline-flex items-center justify-center mb-5 shadow-sm border border-gray-100">
            <ShoppingBag className="w-7 h-7 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-400 text-sm mb-6">Add some items to your cart before checking out.</p>
          <button 
            onClick={() => router.push('/shop')} 
            className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold text-sm transition-all shadow-lg shadow-green-600/20"
          >
            Go Shopping
            <ArrowRight className="w-4 h-4" />
          </button>
        </main>
      </div>
    );
  }

  // Order success
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <main className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full inline-flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">Thank you for your purchase. You can track your order from your profile page.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => router.push('/profile')} 
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold text-sm transition-all shadow-lg shadow-green-600/20"
            >
              View Orders
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => router.push('/shop')} 
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-semibold text-sm hover:bg-gray-50 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        {/* Header row: Back link + Step Indicator */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/cart" className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-green-600 transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Cart
          </Link>

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
        </div>

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
                      <label htmlFor="firstName" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">First Name *</label>
                      <input 
                        type="text" name="firstName" id="firstName"
                        value={formData.firstName} onChange={handleInputChange}
                        placeholder=""
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-300"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Last Name *</label>
                      <input 
                        type="text" name="lastName" id="lastName"
                        value={formData.lastName} onChange={handleInputChange}
                        placeholder=""
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="phone" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number *</label>
                      <input 
                        type="tel" name="phone" id="phone"
                        value={formData.phone} onChange={handleInputChange}
                        placeholder=""
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-300"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="streetAddress" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Street Address *</label>
                      <input 
                        type="text" name="streetAddress" id="streetAddress"
                        value={formData.streetAddress} onChange={handleInputChange}
                        placeholder=""
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="city" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">City *</label>
                      <input 
                        type="text" name="city" id="city"
                        value={formData.city} onChange={handleInputChange}
                        placeholder=""
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-300"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">State *</label>
                      <input 
                        type="text" name="state" id="state"
                        value={formData.state} onChange={handleInputChange}
                        placeholder=""
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm text-gray-900 placeholder-gray-300"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pincode" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pincode *</label>
                      <input 
                        type="text" name="pincode" id="pincode"
                        value={formData.pincode} onChange={handleInputChange}
                        placeholder=""
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
                        <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'card' ? 'border-green-500' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Credit or Debit Card</p>
                          <p className="text-[11px] text-gray-400">Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                      <CreditCard className="w-4.5 h-4.5 text-gray-400" />
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="space-y-2.5 pl-7 mt-3.5">
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cardholder Name</label>
                            <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Card Number</label>
                            <input type="text" maxLength={19} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Expiry Date</label>
                            <input type="text" maxLength={5} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">CVV</label>
                            <input type="password" maxLength={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
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
                        <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'upi' ? 'border-green-500' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">UPI</p>
                          <p className="text-[11px] text-gray-400">Google Pay, PhonePe, Paytm & more</p>
                        </div>
                      </div>
                      <Smartphone className="w-4.5 h-4.5 text-gray-400" />
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="pl-7 mt-3">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">UPI ID</label>
                        <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
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
                        <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'cod' ? 'border-green-500' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Cash on Delivery</p>
                          <p className="text-[11px] text-gray-400">Pay when your order arrives</p>
                        </div>
                      </div>
                      <Banknote className="w-4.5 h-4.5 text-gray-400" />
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

                {/* Back + Trust badges inline */}
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

            {/* Privacy note (shipping step only) */}
            {step === 1 && (
              <div className="flex items-center gap-1.5 mt-3 px-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <p className="text-[10px] text-gray-400">Your personal data will be used to process your order and support your experience.</p>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[340px] flex-shrink-0">
            <div className="lg:sticky lg:top-20 space-y-3">
              <div className={`rounded-xl p-4 sm:p-5 ${step === 2 ? 'bg-gray-900 shadow-xl' : 'bg-white shadow-sm border border-gray-100'}`}>
                <h2 className={`text-sm font-bold mb-3 ${step === 2 ? 'text-white' : 'text-gray-900'}`}>Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-2.5 mb-3 max-h-[180px] overflow-y-auto">
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
                        <p className={`text-[10px] uppercase tracking-wide ${step === 2 ? 'text-gray-400' : 'text-gray-400'}`}>
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

                {/* Pay button inside summary on payment step */}
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
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 py-0.5">
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
}
