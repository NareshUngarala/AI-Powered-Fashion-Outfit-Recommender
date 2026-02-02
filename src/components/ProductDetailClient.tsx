'use client';

import { useState } from 'react';
import { ShoppingBag, Sparkles, Loader2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags: string[];
}

interface RecommendationItem {
  category: string;
  name: string;
  color: string;
  reason: string;
}

interface OutfitRecommendation {
  items: RecommendationItem[];
  styleAdvice: string;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetRecommendation = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });

      if (!res.ok) throw new Error('Failed to fetch recommendation');

      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      setError('Failed to generate outfit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product Details */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <h2 id="information-heading" className="sr-only">
              Product information
            </h2>

            <div className="flex items-center">
              <p className="text-lg text-gray-900 sm:text-xl">${product.price}</p>
            </div>

            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">{product.description}</p>
            </div>

            <div className="mt-6 flex items-center">
              <span className="text-sm text-gray-500 capitalize">Category: {product.category}</span>
            </div>
          </section>
        </div>

        {/* Product Image */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover object-center" />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <div className="mt-10 flex gap-4">
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              
              <button
                type="button"
                onClick={handleGetRecommendation}
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5 text-purple-600" />}
                AI Stylist
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* AI Recommendations Section */}
      {recommendation && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 mt-8 rounded-xl">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">AI Suggested Outfit</h2>
          </div>
          
          <p className="text-gray-600 mb-8 italic">"{recommendation.styleAdvice}"</p>
          
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {recommendation.items.map((item, idx) => (
              <div key={idx} className="group relative bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{item.category} • {item.color}</p>
                    <p className="mt-2 text-sm text-gray-600">{item.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
