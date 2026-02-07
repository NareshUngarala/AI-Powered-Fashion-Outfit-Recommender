import StylistClient from '@/components/StylistClient';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AI Stylist | Style Genie',
  description: 'Get personalized outfit recommendations powered by AI.',
};

export default async function StylistPage() {
  try {
    const res = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000'}/products/random`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
        if (res.status === 404) {
             return (
                <div className="min-h-screen flex flex-col bg-gray-950 text-white">
                  <Navbar />
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">No Products Available</h1>
                      <p className="text-gray-400">Please check back later or add products to the inventory.</p>
                    </div>
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
      <div className="min-h-screen flex flex-col bg-gray-950 text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Stylist</h1>
            <p className="text-gray-400 mb-6">Could not connect to the product service. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }
}
