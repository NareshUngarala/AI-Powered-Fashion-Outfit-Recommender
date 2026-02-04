import Navbar from '@/components/Navbar';
import ProductDetailClient from '@/components/ProductDetailClient';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/data/products';

export const dynamic = 'force-dynamic';

async function getProduct(id: string) {
  // Check mock data first (for "p1", "p2" etc)
  const mockProduct = PRODUCTS.find(p => p._id === id);
  if (mockProduct) {
    return {
      ...mockProduct,
      tags: [], // Mock data might not have tags, provide default
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      description: (mockProduct as any).description || "No description available", // Type assertion for now
    };
  }

  try {
    const res = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/products/${id}`, {
        cache: 'no-store'
    });
    
    if (!res.ok) return null;
    
    return await res.json();
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Static demo bypass
  if (id === 'demo') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ProductDetailClient product={{} as any} />
      </div>
    );
  }

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ProductDetailClient product={product as any} />
    </div>
  );
}
