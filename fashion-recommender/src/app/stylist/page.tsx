import StylistClient from '@/components/StylistClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Stylist | Style Genie',
  description: 'Get personalized outfit recommendations powered by AI.',
};

export default async function StylistPage() {
  try {
    const res = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/products/random`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
        if (res.status === 404) {
             return (
                <div className="min-h-screen flex items-center justify-center bg-[#0f111a] text-white">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No Products Available</h1>
                    <p className="text-gray-400">Please check back later or add products to the inventory.</p>
                  </div>
                </div>
              );
        }
        throw new Error('Failed to fetch random product');
    }

    const product = await res.json();
    return <StylistClient initialProduct={product} />;

  } catch (error) {
    console.error('Error fetching random product:', error);
     return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f111a] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Product</h1>
          <p className="text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }
}
