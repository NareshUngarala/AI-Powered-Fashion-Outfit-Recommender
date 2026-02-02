'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '@/data/products';
import { ArrowRight } from 'lucide-react';

export default function CollectionsPage() {
  // Group products by category to get unique categories and a representative image
  const categoriesMap = PRODUCTS.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = product.imageUrl; // Store the first image found for this category
    }
    return acc;
  }, {} as Record<string, string>);

  const categories = Object.keys(categoriesMap).sort();

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-gray-900">
              The Collections
            </h1>
            <p className="text-gray-500 italic text-lg max-w-xl">
              AI-curated edits defining the season's mood. Explore the future of fashion.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link 
              key={category} 
              href={`/collections/${encodeURIComponent(category)}`}
              className="block relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={categoriesMap[category]}
                alt={category}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <span className="inline-block px-2 py-0.5 bg-green-500 text-white text-[8px] font-bold uppercase tracking-wider mb-2">
                  Collection
                </span>
                <div className="flex items-end justify-between">
                  <h3 className="text-lg font-serif text-white leading-tight">{category}</h3>
                  <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-5px] group-hover:translate-x-0 duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
