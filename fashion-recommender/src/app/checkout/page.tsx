'use client';

import Navbar from '@/components/Navbar';
import { useState } from 'react';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);

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
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                    <input type="text" name="first-name" id="first-name" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                    <input type="text" name="last-name" id="last-name" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                  </div>
                  <div className="sm:col-span-6">
                    <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">Street address</label>
                    <input type="text" name="street-address" id="street-address" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
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
                <div className="space-y-4">
                   <div className="border p-4 rounded-md">
                      <p className="font-medium">Credit Card (Mock)</p>
                      <p className="text-sm text-gray-500">**** **** **** 4242</p>
                   </div>
                </div>
                <button
                  onClick={() => alert('Order placed successfully! (Mock)')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Place Order
                </button>
                <button
                  onClick={() => setStep(1)}
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
