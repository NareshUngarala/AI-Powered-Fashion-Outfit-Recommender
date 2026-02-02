'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Collection {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch('/api/collections');
        const data = await res.json();
        if (data.success) {
          setCollections(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

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
              AI-curated edits defining the season&apos;s mood. Explore the future of fashion.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse" />
              ))}
           </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {collections.map((collection) => (
              <Link 
                key={collection._id} 
                href={`/collections/${collection.slug}`}
                className="block relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={collection.image || 'https://via.placeholder.com/400x600?text=No+Image'}
                  alt={collection.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <span className="inline-block px-2 py-0.5 bg-green-500 text-white text-[8px] font-bold uppercase tracking-wider mb-2">
                    Collection
                  </span>
                  <div className="flex items-end justify-between">
                    <h3 className="text-lg font-serif text-white leading-tight">{collection.name}</h3>
                    <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-5px] group-hover:translate-x-0 duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
