'use client';

import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    streetAddress: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total: cartTotal,
          shippingAddress: formData
        })
      });

      const data = await response.json();

      if (data.success) {
        clearCart();
        alert('Order placed successfully! Order ID: ' + data.data.orderId);
        router.push('/profile');
      } else {
        alert('Order failed: ' + data.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!session) {
      return (
          <div className="min-h-screen bg-gray-50">
              <Navbar />
              <div className="max-w-3xl mx-auto px-4 py-10 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Please Sign In</h2>
                  <p className="mt-2 text-gray-600">You need to be logged in to checkout.</p>
                  <button onClick={() => router.push('/auth/signin')} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md">Sign In</button>
              </div>
          </div>
      )
  }

  if (items.length === 0) {
      return (
          <div className="min-h-screen bg-gray-50">
              <Navbar />
              <div className="max-w-3xl mx-auto px-4 py-10 text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
                  <button onClick={() => router.push('/shop')} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md">Go Shopping</button>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {step === 1 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-gray-900">Shipping Information</h2>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
                    <input 
                        type="text" 
                        name="firstName" 
                        id="firstName" 
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" 
                        required
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
                    <input 
                        type="text" 
                        name="lastName" 
                        id="lastName" 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" 
                        required
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">Street address</label>
                    <input 
                        type="text" 
                        name="streetAddress" 
                        id="streetAddress" 
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" 
                        required
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                      if(formData.firstName && formData.lastName && formData.streetAddress) {
                          setStep(2)
                      } else {
                          alert('Please fill in all fields')
                      }
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continue to Payment
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-gray-900">Payment Details</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        This is a demo checkout. No actual payment will be processed.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total</p>
                        <p>₹{cartTotal.toFixed(2)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                   <div className="border p-4 rounded-md">
                      <p className="font-medium">Credit Card (Mock)</p>
                      <p className="text-sm text-gray-500">**** **** **** 4242</p>
                   </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </button>
                <button
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
