import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
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
      description: (mockProduct as any).description || "No description available", // Type assertion for now
    };
  }

  try {
    await connectToDatabase();
    // Validate ID format if necessary, or let findById fail/return null
    const product = await Product.findById(id).lean();
    if (!product) return null;
    return {
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt?.toString(),
    };
  } catch (error) {
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
      <ProductDetailClient product={product as any} />
    </div>
  );
}
