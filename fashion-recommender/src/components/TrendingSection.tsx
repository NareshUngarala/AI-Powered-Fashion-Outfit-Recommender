'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

export default function TrendingSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('/api/products?featured=true&limit=4');
        if (!res.ok) throw new Error('Failed to fetch trending products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching trending products:', err);
        setError('Failed to load trending items');
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <section className="w-full px-4 sm:px-8 lg:px-12 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] w-full bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return null; // Silently fail or show error state if preferred
  }

  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 py-10 lg:py-8 xl:py-12">
      <AnimateOnScroll>
        <div className="flex items-center justify-between mb-6 lg:mb-5 xl:mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
          <Link href="/shop" className="text-green-600 font-medium hover:text-green-700 flex items-center gap-1 hover:gap-2 transition-all duration-200">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </AnimateOnScroll>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
        {products.map((product) => (
          <AnimateOnScroll key={product._id}>
          <Link href={`/products/${product._id}`} className="group cursor-pointer block">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100 relative mb-4">
              <Image
                src={product.images[0] || 'https://via.placeholder.com/400x600?text=No+Image'}
                alt={product.name}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-900 uppercase tracking-wider">
                New
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                  {product.name}
                </h3>
              </div>
              <p className="text-lg font-semibold text-gray-900">₹{product.price.toFixed(2)}</p>
            </div>
          </Link>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
