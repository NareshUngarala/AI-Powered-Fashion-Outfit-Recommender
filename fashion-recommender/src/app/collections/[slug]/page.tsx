'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';

export default function CollectionDetailsPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? decodeURIComponent(params.slug) : '';
  
  // Filter products by style matching the slug, excluding non-clothing items
  const categoryProducts = PRODUCTS.filter(product => {
    const isMatch = product.style === slug || product.category === slug;
    // User requested to exclude Bags and Accessories from these pages
    const isExcluded = ['Bags', 'Accessories'].includes(product.category);
    return isMatch && !isExcluded;
  });
  const categoryExists = categoryProducts.length > 0;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Navigation & Header */}
        <div className="mb-8 space-y-6">
          <Link 
            href="/collections" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Styles
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-medium text-gray-900">
              {categoryExists ? slug : 'Style Not Found'}
            </h1>
            {categoryExists && (
              <p className="text-gray-500 italic text-lg">
                {categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'items'} available
              </p>
            )}
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {categoryExists ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <p className="text-xl text-gray-500">
              We couldn&apos;t find any products in this style.
            </p>
            <Link 
              href="/collections" 
              className="inline-block px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
            >
              Browse all Styles
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
