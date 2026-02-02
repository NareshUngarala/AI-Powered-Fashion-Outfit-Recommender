import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { Product } from '@/data/products';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product._id}`} className="group cursor-pointer block">
      <div className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-all">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.match && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-green-600" />
            <span className="text-[10px] font-bold text-gray-900">
              AI MATCH <span className="text-green-600">{product.match}%</span>
            </span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        {product.brand && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {product.brand}
          </p>
        )}
        <h3 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-green-600 transition-colors truncate">
          {product.name}
        </h3>
        <p className="text-sm font-bold text-green-600">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
