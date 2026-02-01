import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

async function getProducts() {
  await connectToDatabase();
  const products = await Product.find({}).lean();
  return products.map((p) => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toString(),
  }));
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trending Now</h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product as any} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No products found. Please seed the database.</p>
              <a 
                href="/api/seed" 
                target="_blank"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Seed Database
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
