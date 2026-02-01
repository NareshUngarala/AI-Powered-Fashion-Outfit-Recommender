import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Navbar from '@/components/Navbar';
import ProductDetailClient from '@/components/ProductDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getProduct(id: string) {
  await connectToDatabase();
  // Validate ID format if necessary, or let findById fail/return null
  try {
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
