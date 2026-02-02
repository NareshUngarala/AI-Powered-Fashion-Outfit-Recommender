'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronLeft, Package, MapPin, CreditCard, Calendar, Clock } from 'lucide-react';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  streetAddress: string;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  status: string;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: string;
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (status === 'authenticated') {
        try {
          const res = await fetch(`/api/orders/${params.id}`);
          const data = await res.json();

          if (data.success) {
            setOrder(data.data);
          } else {
            setError(data.message || 'Failed to fetch order');
          }
        } catch (err) {
          setError('An error occurred while fetching the order');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [status, params.id]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-500 mb-8">{error || "We couldn't find the order you're looking for."}</p>
          <Link href="/profile" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/profile" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                Order {order.orderId}
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                  order.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                  'bg-yellow-50 text-yellow-700 border-yellow-100'
                }`}>
                  {order.status}
                </span>
              </h1>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Download Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-500" /> Items ({order.items.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {order.items.map((item, index) => (
                  <div key={index} className="p-4 flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gray-100 relative overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <div className="text-sm text-gray-500 mt-1 space-y-1">
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center text-base font-bold pt-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info Sidebar */}
          <div className="space-y-6">
            {/* Shipping Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-500" /> Shipping Address
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.streetAddress}</p>
                {/* Add city/state/zip if available in schema later */}
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-gray-500" /> Payment Info
              </h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                <p className="text-xs text-gray-500 mt-1">Paid on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Support */}
            <div className="bg-green-50 rounded-2xl border border-green-100 p-5">
              <h3 className="font-semibold text-green-800 mb-2">Need Help?</h3>
              <p className="text-sm text-green-700 mb-3">
                Have an issue with your order? Our support team is here to help.
              </p>
              <button className="w-full py-2 bg-white text-green-700 font-medium text-sm rounded-lg border border-green-200 hover:bg-green-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
