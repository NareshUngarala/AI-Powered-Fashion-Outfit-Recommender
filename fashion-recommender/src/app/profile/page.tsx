'use client';

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User as UserIcon, 
  Settings, 
  Package, 
  Heart, 
  CreditCard, 
  LogOut,
  Sparkles,
  MapPin,
  Camera,
  Clock,
  Edit2,
  X,
  Trash2,
  Lock,
  ShieldAlert,
  Plus,
  Check,
  AlertCircle
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderItem {
  name: string;
  image: string;
}

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface UserProfile {
  name: string;
  email: string;
  image?: string;
  createdAt: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

interface PaymentMethod {
  _id: string;
  cardType: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cardHolderName: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // orders, info, wishlist, payments, settings
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', image: '' });
  
  // New States for Forms
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cardHolderName: '',
    cardType: 'Visa'
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const fetchData = async () => {
    if (status === 'authenticated') {
      try {
        // Fetch User Profile
        const profileRes = await fetch('/api/user/profile');
        const profileData = await profileRes.json();
        
        if (profileData.success) {
          setProfile(profileData.data);
          setEditForm({ 
            name: profileData.data.name, 
            image: profileData.data.image || '' 
          });
        }

        // Fetch Orders
        const ordersRes = await fetch('/api/orders/user');
        const ordersData = await ordersRes.json();
        
        if (ordersData.success) {
          setOrders(ordersData.data);
        }

        // Fetch Wishlist
        const wishlistRes = await fetch('/api/wishlist');
        const wishlistData = await wishlistRes.json();
        
        if (wishlistData.success) {
          setWishlist(wishlistData.data);
        }

        // Fetch Payments
        const paymentsRes = await fetch('/api/user/payments');
        const paymentsData = await paymentsRes.json();
        
        if (paymentsData.success) {
          setPayments(paymentsData.data);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setIsEditing(false);
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setWishlist(prev => prev.filter(p => p._id !== productId));
      }
    } catch (error) {
      console.error('Remove wishlist error:', error);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm),
      });
      const data = await res.json();
      if (data.success) {
        setPayments([data.data, ...payments]);
        setShowPaymentForm(false);
        setPaymentForm({ cardNumber: '', expiryMonth: '', expiryYear: '', cardHolderName: '', cardType: 'Visa' });
      } else {
        alert(data.message || 'Failed to add payment method');
      }
    } catch (error) {
      console.error('Add payment error:', error);
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm('Are you sure you want to remove this card?')) return;
    try {
      const res = await fetch(`/api/user/payments?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPayments(payments.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Delete payment error:', error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMessage({ type: 'error', text: data.message || 'Failed to update password' });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordMessage({ type: 'error', text: 'An error occurred' });
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        signOut({ callbackUrl: '/' });
      } else {
        alert(data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Delete account error:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!session || !profile) {
    return null; 
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const styleStats = {
    vibe: "Urban Minimalist",
    matchRate: "94%",
    scans: 12
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

           <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="relative group cursor-pointer" onClick={() => setIsEditing(true)}>
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative bg-gray-200">
                    <Image 
                      src={profile.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"} 
                      alt={profile.name} 
                      fill 
                      className="object-cover"
                    />
                 </div>
                 <div className="absolute bottom-2 right-2 bg-gray-900 text-white p-2 rounded-full shadow-md group-hover:bg-green-600 transition-colors">
                    <Camera className="w-4 h-4" />
                 </div>
              </div>
              
              <div className="text-center md:text-left space-y-2 flex-1">
                 <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{profile.name}</h1>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                      <Sparkles className="w-3 h-3" />
                      Style Icon
                    </span>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                 </div>
                 <p className="text-gray-500">{profile.email}</p>
                 <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-400 pt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Member since {formatDate(profile.createdAt)}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> New York, USA</span>
                 </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 md:gap-8 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 mt-4 md:mt-0">
                 <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">Orders</div>
                 </div>
                 <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{styleStats.scans}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">Scans</div>
                 </div>
                 <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{styleStats.matchRate}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">Match Rate</div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Navigation */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Account</h3>
                 </div>
                 <nav className="p-2 space-y-1">
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                       <Package className="w-5 h-5" />
                       My Orders
                    </button>
                    <button 
                      onClick={() => setActiveTab('info')}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'info' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                       <UserIcon className="w-5 h-5" />
                       Personal Info
                    </button>
                    <button 
                      onClick={() => setActiveTab('wishlist')}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'wishlist' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                       <Heart className="w-5 h-5" />
                       Wishlist
                    </button>
                    <button 
                      onClick={() => setActiveTab('payments')}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'payments' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                       <CreditCard className="w-5 h-5" />
                       Payment Methods
                    </button>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                       <Settings className="w-5 h-5" />
                       Settings
                    </button>
                 </nav>
                 <div className="p-4 border-t border-gray-100 mt-2">
                    <button 
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                       <LogOut className="w-5 h-5" />
                       Sign Out
                    </button>
                 </div>
              </div>

              {/* Style Profile Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                       <Sparkles className="w-5 h-5 text-yellow-400" />
                       <h3 className="font-semibold">Your Vibe</h3>
                    </div>
                    <p className="text-3xl font-bold mb-1">{styleStats.vibe}</p>
                    <p className="text-gray-400 text-sm mb-6">Based on your recent picks</p>
                    <button className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-sm font-medium transition-colors border border-white/10">
                       Retake Style Quiz
                    </button>
                 </div>
              </div>
           </div>

           {/* Main Content Area */}
           <div className="lg:col-span-3 space-y-6">
              
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                   <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                   </div>
                   
                   <div className="divide-y divide-gray-100">
                      {orders.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          No orders found. Start shopping to see your orders here!
                        </div>
                      ) : (
                        orders.map((order) => (
                          <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors group">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                   <div className="bg-gray-100 p-2 rounded-lg">
                                      <Package className="w-5 h-5 text-gray-600" />
                                   </div>
                                   <div>
                                      <div className="font-semibold text-gray-900">{order.orderId}</div>
                                      <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                                   </div>
                                </div>
                                <div className="flex items-center gap-3">
                                   <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                      order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                      order.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                      'bg-yellow-50 text-yellow-700 border-yellow-100'
                                   }`}>
                                      {order.status}
                                   </span>
                                   <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                                </div>
                             </div>
    
                             <div className="flex items-center gap-4 pl-0 sm:pl-[60px]">
                                <div className="flex -space-x-3">
                                   {order.items.slice(0, 3).map((item, index) => (
                                      <div key={index} className="w-10 h-10 rounded-full border-2 border-white relative overflow-hidden bg-gray-100">
                                         <Image 
                                           src={item.image} 
                                           alt={item.name} 
                                           fill 
                                           className="object-cover"
                                         />
                                      </div>
                                   ))}
                                   {order.items.length > 3 && (
                                      <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-500">
                                         +{order.items.length - 3}
                                      </div>
                                   )}
                                </div>
                                <div className="text-sm text-gray-500">
                                   {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </div>
                                <Link 
                                  href={`/orders/${order.orderId || order._id}`}
                                  className="ml-auto text-sm font-medium text-gray-900 hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                   View Details
                                </Link>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>
              )}

              {/* PERSONAL INFO TAB */}
              {activeTab === 'info' && (
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                       <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                       <button 
                         onClick={() => setIsEditing(true)}
                         className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                       >
                         <Edit2 className="w-4 h-4" /> Edit
                       </button>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Full Name</p>
                          <p className="font-semibold text-gray-900">{profile.name}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Email Address</p>
                          <p className="font-semibold text-gray-900">{profile.email}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Member Since</p>
                          <p className="font-semibold text-gray-900">{formatDate(profile.createdAt)}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">User ID</p>
                          <p className="font-mono text-sm font-medium text-gray-900">{profile._id}</p>
                        </div>
                      </div>
                    </div>
                 </div>
              )}

              {/* WISHLIST TAB */}
              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                     <h2 className="text-lg font-bold text-gray-900">My Wishlist</h2>
                     <span className="text-sm text-gray-500">{wishlist.length} items</span>
                  </div>
                  <div className="p-6">
                    {wishlist.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        Your wishlist is empty. Go find something you love!
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((product) => (
                          <div key={product._id} className="group relative border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-square relative bg-gray-100">
                              <Image 
                                src={product.images[0]} 
                                alt={product.name} 
                                fill 
                                className="object-cover"
                              />
                              <button 
                                onClick={() => removeFromWishlist(product._id)}
                                className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-red-500 hover:bg-white transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                              <p className="text-gray-500 text-sm mt-1">{product.category}</p>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                <Link 
                                  href={`/products/${product._id}`}
                                  className="text-xs font-medium text-green-600 hover:text-green-700"
                                >
                                  View
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAYMENTS TAB */}
              {activeTab === 'payments' && (
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                       <h2 className="text-lg font-bold text-gray-900">Payment Methods</h2>
                       <button 
                         onClick={() => setShowPaymentForm(true)}
                         className="text-sm bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                       >
                         <Plus className="w-4 h-4" /> Add Card
                       </button>
                    </div>
                    
                    {showPaymentForm && (
                      <div className="p-6 bg-gray-50 border-b border-gray-100">
                        <form onSubmit={handleAddPayment} className="space-y-4 max-w-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                            <input 
                              type="text" 
                              placeholder="0000 0000 0000 0000"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                              value={paymentForm.cardNumber}
                              onChange={e => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM)</label>
                              <input 
                                type="text" 
                                placeholder="MM"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                                value={paymentForm.expiryMonth}
                                onChange={e => setPaymentForm({...paymentForm, expiryMonth: e.target.value})}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (YY)</label>
                              <input 
                                type="text" 
                                placeholder="YY"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                                value={paymentForm.expiryYear}
                                onChange={e => setPaymentForm({...paymentForm, expiryYear: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                            <input 
                              type="text" 
                              placeholder="Name on Card"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                              value={paymentForm.cardHolderName}
                              onChange={e => setPaymentForm({...paymentForm, cardHolderName: e.target.value})}
                              required
                            />
                          </div>
                          <div className="flex gap-3">
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Save Card</button>
                            <button type="button" onClick={() => setShowPaymentForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cancel</button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="p-6">
                      {payments.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p>No payment methods saved yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {payments.map(method => (
                            <div key={method._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">
                                  {method.cardType}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">•••• •••• •••• {method.last4}</p>
                                  <p className="text-sm text-gray-500">Expires {method.expiryMonth}/{method.expiryYear}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleDeletePayment(method._id)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                 </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                 <div className="space-y-6">
                   {/* Password Settings */}
                   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-6 border-b border-gray-100">
                         <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                           <Lock className="w-5 h-5 text-gray-400" /> Security
                         </h2>
                      </div>
                      <div className="p-6">
                        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input 
                              type="password" 
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                              value={passwordForm.currentPassword}
                              onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input 
                              type="password" 
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                              value={passwordForm.newPassword}
                              onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input 
                              type="password" 
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                              value={passwordForm.confirmPassword}
                              onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                              required
                            />
                          </div>
                          
                          {passwordMessage.text && (
                            <div className={`text-sm p-3 rounded-lg flex items-center gap-2 ${
                              passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {passwordMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                              {passwordMessage.text}
                            </div>
                          )}

                          <button type="submit" className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                            Update Password
                          </button>
                        </form>
                      </div>
                   </div>

                   {/* Danger Zone */}
                   <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                      <div className="p-6 border-b border-red-100 bg-red-50/50">
                         <h2 className="text-lg font-bold text-red-700 flex items-center gap-2">
                           <ShieldAlert className="w-5 h-5" /> Danger Zone
                         </h2>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-600 mb-4 text-sm">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button 
                          onClick={handleDeleteAccount}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                        >
                          Delete Account
                        </button>
                      </div>
                   </div>
                 </div>
              )}
           </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="font-semibold text-gray-900">Edit Profile</h3>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                  <input 
                    type="url" 
                    value={editForm.image}
                    onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Paste a link to an image to update your avatar.</p>
                </div>
                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
