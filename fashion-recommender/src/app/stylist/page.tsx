import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import StylistClient from '@/components/StylistClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Stylist | Style Genie',
  description: 'Get personalized outfit recommendations powered by AI.',
};

export default async function StylistPage() {
  await connectToDatabase();
  
  // Fetch a random product to start the styling session
  // We prioritize products with images
  const products = await Product.aggregate([
    { $match: { imageUrl: { $exists: true, $ne: "" } } },
    { $sample: { size: 1 } }
  ]);
  
  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f111a] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Products Available</h1>
          <p className="text-gray-400">Please check back later or add products to the inventory.</p>
        </div>
      </div>
    );
  }

  // Serialize the product data for the client component
  const product = JSON.parse(JSON.stringify(products[0]));

  return <StylistClient initialProduct={product} />;
}
