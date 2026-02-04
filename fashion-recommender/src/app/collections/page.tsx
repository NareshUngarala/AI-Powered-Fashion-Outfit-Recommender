'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';

interface Collection {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
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
        
        {/* Styles Grid - Replicating the provided UI */}
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-3xl animate-pulse" />
              ))}
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
            {collections.map((collection, index) => {
              // Logic to vary card sizes/aspects to mimic the bento/masonry layout
              // Index 0: Large Vertical (Row span 2)
              // Index 1: Standard
              // Index 2: Standard
              // Index 3: Standard
              const isLarge = index === 0;
              const isWide = index === 3;
              
              return (
                <Link 
                  key={collection._id} 
                  href={`/collections/${collection.slug}`}
                  className={`relative group cursor-pointer overflow-hidden rounded-3xl ${isLarge ? 'md:row-span-2 md:h-full' : ''} ${isWide ? 'md:col-span-2' : ''}`}
                >
                  <Image
                    src={collection.imageUrl || 'https://via.placeholder.com/600x800?text=No+Image'}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    {/* Optional Badge for specific items or random */}
                    {(index === 0 || collection.featured) && (
                      <span className="inline-block px-3 py-1 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider mb-3 rounded-full">
                        {index === 0 ? 'New Season' : 'Trending'}
                      </span>
                    )}
                    
                    <h3 className="text-3xl font-bold text-white leading-tight font-serif tracking-wide">
                      {collection.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
