'use client';

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User as UserIcon, 
  Settings, 
  Package, 
  Heart, 
  LogOut,
  Sparkles,
  Camera,
  Clock,
  Edit2,
  X,
  Trash2,
  Lock,
  ShieldAlert,
  Check,
  AlertCircle,
  Plus,
  ChevronRight
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

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
  gender?: string;
  preferredStyle?: string;
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

// PaymentMethod interface removed

interface OutfitItem {
  _id: string;
  name: string;
  price?: number;
  category: string;
  image?: string;
  reason: string;
}

interface Outfit {
  _id: string;
  name: string;
  createdAt: string;
  items: OutfitItem[];
  styleAdvice: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // orders, info, wishlist, settings
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    image: '',
    gender: 'Unisex',
    preferredStyle: ''
  });
  
  // New States for Forms
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image(); // Use window.Image to avoid conflict with next/image
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.6)); // Compress to JPEG with 0.6 quality
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB before compression)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size too large. Please select an image under 5MB.");
        return;
      }

      try {
        const resizedImage = await resizeImage(file);
        setEditForm(prev => ({ ...prev, image: resizedImage }));
      } catch (error) {
        console.error("Error resizing image:", error);
        alert("Failed to process image. Please try another one.");
      }
    }
  };

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
            image: profileData.data.image || '',
            gender: profileData.data.gender || 'Unisex',
            preferredStyle: profileData.data.preferredStyle || ''
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

        // Fetch Outfits
        const outfitsRes = await fetch('/api/outfits');
        const outfitsData = await outfitsRes.json();
        
        if (outfitsData.success) {
          setOutfits(outfitsData.data);
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
      const payloadSize = JSON.stringify(editForm).length;
      console.log(`Attempting to send profile update. Payload size: ${(payloadSize / 1024).toFixed(2)} KB`);

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      
      if (!res.ok) {
        if (res.status === 413) {
            throw new Error('Image too large. Please choose a smaller image.');
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setIsEditing(false);
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      // Handle network errors (Failed to fetch) specifically
      if (error.message === 'Failed to fetch') {
          alert('Network error: Could not connect to the server. The image might be too large or the server is unreachable.');
      } else {
          alert(error.message || 'An error occurred while updating profile');
      }
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

// Payment handling functions removed

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

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col bg-gray-50/50 font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
      <Navbar />
      {isEditing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Avatar URL</label>
                <div className="flex gap-4">
                  <div 
                    className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200 group/avatar cursor-pointer hover:ring-2 hover:ring-green-500 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image 
                      src={editForm.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <input 
                      type="url" 
                      value={editForm.image}
                      onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white text-base"
                      placeholder="https://example.com/image.jpg"
                    />
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Gender Preference</label>
                  <div className="relative">
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white appearance-none text-base"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                    <ChevronRight className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Style Vibe</label>
                  <div className="relative">
                    <select
                      value={editForm.preferredStyle}
                      onChange={(e) => setEditForm({...editForm, preferredStyle: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white appearance-none text-base"
                    >
                      <option value="" disabled>Select your vibe</option>
                      <option value="Minimalist">Minimalist</option>
                      <option value="Streetwear">Streetwear</option>
                      <option value="Casual">Casual</option>
                      <option value="Formal">Formal</option>
                      <option value="Chic">Chic</option>
                      <option value="Vintage">Vintage</option>
                      <option value="Bohemian">Bohemian</option>
                      <option value="Preppy">Preppy</option>
                      <option value="Athleisure">Athleisure</option>
                      <option value="Grunge">Grunge</option>
                      <option value="Classic">Classic</option>
                    </select>
                    <ChevronRight className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90" />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      <main className="flex-1 flex flex-col min-h-0 w-full px-4 py-4">
        <div className="flex flex-col h-full space-y-4">

          {/* Top Profile Header - full width */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-sm ring-1 ring-white/10 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light" />
            
            <div className="relative z-10 p-5 md:p-6 flex flex-col md:flex-row items-center md:items-end gap-5">
               <div className="relative group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-white/20 backdrop-blur-sm">
                     <div className="w-full h-full rounded-full overflow-hidden border-2 md:border-4 border-white/90 relative bg-gray-200 shadow-xl">
                        <Image 
                          src={profile.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"} 
                          alt={profile.name} 
                          fill 
                          className="object-cover"
                        />
                     </div>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-0 right-0 bg-white text-gray-900 p-2 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all"
                  >
                     <Camera className="w-4 h-4" />
                  </button>
               </div>
               
               <div className="text-center md:text-left flex-1 mb-1">
                  <h1 className="text-xl md:text-3xl font-bold text-white mb-1 tracking-tight">{profile.name}</h1>
                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-white/90 text-sm font-medium">
                     <p className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                        {profile.email}
                     </p>
                     <span className="hidden md:block w-1 h-1 bg-white/30 rounded-full" />
                     <p className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 text-xs">
                        <Clock className="w-3.5 h-3.5" /> Member since {new Date(profile.createdAt).getFullYear()}
                     </p>
                  </div>
               </div>

               <div className="flex gap-5 bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10">
                  <div className="text-center px-4">
                     <p className="text-2xl font-bold text-white">{orders.length}</p>
                     <p className="text-sm text-white/80 uppercase tracking-widest font-bold">Orders</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div className="text-center px-4">
                     <p className="text-2xl font-bold text-white">{outfits.length}</p>
                     <p className="text-sm text-white/80 uppercase tracking-widest font-bold">Looks</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div className="text-center px-4">
                     <p className="text-2xl font-bold text-white">{wishlist.length}</p>
                     <p className="text-sm text-white/80 uppercase tracking-widest font-bold">Saved</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Content grid below header */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Sidebar - Account Explorer */}
          <div className="lg:col-span-3 lg:h-full lg:overflow-y-auto pr-1 custom-scrollbar">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
               <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Account Explorer</h2>
               <nav className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      activeTab === 'orders' 
                        ? 'bg-green-600 text-white shadow-lg shadow-gray-200 scale-[1.02]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                     <Package className={`w-5 h-5 ${activeTab === 'orders' ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`} />
                     Recent Acquisitions
                     {activeTab === 'orders' && <ChevronRight className="w-3 h-3 ml-auto text-gray-500" />}
                  </button>
                  <button 
                    onClick={() => setActiveTab('outfits')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      activeTab === 'outfits' 
                        ? 'bg-green-600 text-white shadow-lg shadow-gray-200 scale-[1.02]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                     <Sparkles className={`w-5 h-5 ${activeTab === 'outfits' ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`} />
                     Style Timeline
                     {activeTab === 'outfits' && <ChevronRight className="w-3 h-3 ml-auto text-gray-500" />}
                  </button>
                  <button 
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      activeTab === 'wishlist' 
                        ? 'bg-green-600 text-white shadow-lg shadow-gray-200 scale-[1.02]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                     <Heart className={`w-5 h-5 ${activeTab === 'wishlist' ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`} />
                     Wishlist
                     {activeTab === 'wishlist' && <ChevronRight className="w-3 h-3 ml-auto text-gray-500" />}
                  </button>
                  
                  <div className="pt-3 pb-2">
                    <div className="h-px bg-gray-100" />
                  </div>

                  <button 
                    onClick={() => setActiveTab('info')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      activeTab === 'info' 
                        ? 'bg-green-600 text-white shadow-lg shadow-gray-200 scale-[1.02]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                     <UserIcon className={`w-5 h-5 ${activeTab === 'info' ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`} />
                     Profile Settings
                     {activeTab === 'info' && <ChevronRight className="w-3 h-3 ml-auto text-gray-500" />}
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      activeTab === 'settings' 
                        ? 'bg-green-600 text-white shadow-lg shadow-gray-200 scale-[1.02]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                     <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`} />
                     Security
                     {activeTab === 'settings' && <ChevronRight className="w-3 h-3 ml-auto text-gray-500" />}
                  </button>
                  
                  <div className="pt-2">
                     <button 
                       onClick={() => signOut({ callbackUrl: '/' })}
                       className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-1 group"
                     >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Sign Out
                     </button>
                  </div>
               </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 relative lg:h-full">
            <div className="lg:absolute lg:inset-0 lg:overflow-y-auto pr-1 custom-scrollbar space-y-4">
             {/* Dynamic Content Area */}
             <div>
                
                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Acquisitions</h3>
                        <div className="text-base text-gray-500 font-medium">
                           {orders.length} orders found
                        </div>
                     </div>
                     
                     <div className="space-y-5">
                        {orders.length === 0 ? (
                          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
                             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-gray-400" />
                             </div>
                             <h4 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h4>
                             <p className="text-gray-500 mb-6 max-w-sm mx-auto text-base">Your wardrobe is waiting for its first addition. Explore our collection to find your perfect style.</p>
                             <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-base font-medium hover:bg-green-700 transition-colors">
                                Start Shopping <ChevronRight className="w-5 h-5" />
                             </Link>
                          </div>
                        ) : (
                          orders.map((order) => (
                            <div key={order._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-4">
                                  <div className="flex items-center gap-4">
                                     <div className="bg-gray-50 p-3 rounded-xl">
                                        <Package className="w-6 h-6 text-gray-900" />
                                     </div>
                                     <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                           <span className="font-bold text-gray-900 text-xl">{order.orderId}</span>
                                           <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
                                              order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                              order.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                              'bg-yellow-50 text-yellow-700 border-yellow-100'
                                           }`}>
                                              {order.status}
                                           </span>
                                        </div>
                                        <div className="text-base text-gray-500 flex items-center gap-1.5">
                                           <Clock className="w-4 h-4" /> {formatDate(order.createdAt)}
                                        </div>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                     <div className="text-right">
                                        <p className="text-sm text-gray-500 mb-0.5">Total Amount</p>
                                        <p className="text-xl font-bold text-gray-900">₹{order.total.toFixed(2)}</p>
                                     </div>
                                     <Link 
                                       href={`/orders/${order.orderId || order._id}`}
                                       className="p-3 rounded-xl bg-gray-50 text-gray-900 hover:bg-green-600 hover:text-white transition-all"
                                     >
                                        <ChevronRight className="w-5 h-5" />
                                     </Link>
                                  </div>
                               </div>
      
                               <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                                  <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                                     {order.items.slice(0, 4).map((item, index) => (
                                        <div key={index} className="w-12 h-12 rounded-xl border-2 border-white relative overflow-hidden bg-gray-100 shadow-sm hover:scale-110 hover:z-10 transition-all">
                                           <Image 
                                             src={item.image} 
                                             alt={item.name} 
                                             fill 
                                             className="object-cover"
                                           />
                                        </div>
                                     ))}
                                     {order.items.length > 4 && (
                                        <div className="w-12 h-12 rounded-xl border-2 border-white bg-gray-900 flex items-center justify-center text-sm font-bold text-white shadow-sm z-10">
                                           +{order.items.length - 4}
                                        </div>
                                     )}
                                  </div>
                                  <span className="text-base font-medium text-gray-600 ml-1">
                                     {order.items.length} items purchased
                                  </span>
                               </div>
                            </div>
                          ))
                        )}
                     </div>
                  </div>
                )}

                {/* OUTFITS TAB */}
                {activeTab === 'outfits' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="flex items-center justify-between">
                        <div>
                           <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Style Timeline</h3>
                           <p className="text-base text-gray-500 mt-1">Your AI-curated fashion journey</p>
                        </div>
                        <Link href="/stylist" className="hidden sm:flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl text-base font-medium hover:bg-green-700 transition-all shadow-lg shadow-gray-200">
                           <Sparkles className="w-5 h-5" /> Generate New Look
                        </Link>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Create New Card (Visible on all sizes) */}
                        <Link href="/stylist" className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl hover:border-green-600 hover:bg-gray-50 transition-all min-h-[280px]">
                           <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5 group-hover:bg-white group-hover:shadow-md transition-all">
                             <Plus className="w-10 h-10 text-gray-400 group-hover:text-green-600" />
                           </div>
                           <h4 className="text-xl font-bold text-gray-900">Create New Look</h4>
                           <p className="text-base text-gray-500 text-center mt-3 max-w-[240px]">Let our AI stylist curate your next perfect outfit</p>
                        </Link>

                        {outfits.map((outfit) => (
                           <div key={outfit._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col">
                              <div className="flex justify-between items-start mb-5">
                                 <div>
                                    <h4 className="font-bold text-xl text-gray-900 line-clamp-1">{outfit.name || 'Untitled Outfit'}</h4>
                                    <p className="text-base text-gray-500 mt-1">{formatDate(outfit.createdAt)}</p>
                                 </div>
                                 <button className="p-3 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                 </button>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 mb-5 flex-1">
                                 {outfit.items.slice(0, 4).map((item, idx) => (
                                    <div key={idx} className="aspect-square relative rounded-xl overflow-hidden bg-gray-50 group/item">
                                       <Image 
                                         src={item.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300"} 
                                         alt={item.name} 
                                         fill 
                                         className="object-cover group-hover/item:scale-110 transition-transform duration-500"
                                       />
                                    </div>
                                 ))}
                              </div>

                              <div className="bg-gray-50 rounded-xl p-5">
                                 <p className="text-base text-gray-600 line-clamp-2 italic">
                                    <Sparkles className="w-5 h-5 inline mr-2 text-purple-500" />
                                    {outfit.styleAdvice}
                                 </p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}

                {/* WISHLIST TAB */}
                {activeTab === 'wishlist' && (
                   <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center justify-between">
                         <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Your Wishlist</h3>
                         <span className="px-4 py-1.5 bg-gray-100 rounded-full text-sm font-bold text-gray-600">{wishlist.length} items</span>
                      </div>
                      
                      {wishlist.length === 0 ? (
                         <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
                            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Wishlist is empty</h4>
                            <p className="text-gray-500 mb-6 text-base">Save items you love to revisit them later.</p>
                           <Link href="/products" className="inline-block px-8 py-3 bg-green-600 text-white rounded-xl text-base font-medium hover:bg-green-700 transition-colors">
                               Browse Products
                            </Link>
                         </div>
                      ) : (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {wishlist.map((product) => (
                               <div key={product._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all group relative">
                                  <div className="aspect-[4/5] relative bg-gray-100 overflow-hidden">
                                     <Image 
                                       src={product.images[0]} 
                                       alt={product.name} 
                                       fill 
                                       className="object-cover group-hover:scale-105 transition-transform duration-500"
                                     />
                                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                     <button 
                                       onClick={() => removeFromWishlist(product._id)}
                                       className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                                     >
                                        <Trash2 className="w-5 h-5" />
                                     </button>
                                  </div>
                                  <div className="p-5">
                                     <div className="flex justify-between items-start mb-2">
                                        <div>
                                           <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
                                           <h3 className="font-bold text-gray-900 line-clamp-1 text-lg">{product.name}</h3>
                                        </div>
                                     </div>
                                     <div className="flex items-center justify-between mt-4">
                                        <span className="text-xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                                        <Link 
                                          href={`/products/${product._id}`}
                                          className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center gap-1.5"
                                        >
                                           View Details <ChevronRight className="w-4 h-4" />
                                        </Link>
                                     </div>
                                  </div>
                               </div>
                            ))}
                         </div>
                      )}
                   </div>
                )}

                {/* PERSONAL INFO TAB */}
                {activeTab === 'info' && (
                   <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center justify-between">
                         <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Profile Settings</h3>
                         <button 
                           onClick={() => setIsEditing(true)}
                           className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-base font-medium hover:bg-green-700 transition-colors shadow-sm"
                         >
                            <Edit2 className="w-5 h-5" /> Edit Profile
                         </button>
                      </div>

                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                         <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                            <div className="p-8 space-y-8">
                               <h4 className="font-bold text-gray-900 flex items-center gap-3 text-xl">
                                  <UserIcon className="w-6 h-6 text-gray-400" /> Basic Information
                               </h4>
                               <div className="space-y-6">
                                  <div>
                                     <p className="text-base font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</p>
                                     <p className="text-xl font-semibold text-gray-900">{profile.name}</p>
                                  </div>
                                  <div>
                                     <p className="text-base font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</p>
                                     <p className="text-xl font-semibold text-gray-900">{profile.email}</p>
                                  </div>
                               </div>
                            </div>
                            <div className="p-8 space-y-8">
                               <h4 className="font-bold text-gray-900 flex items-center gap-3 text-xl">
                                  <Sparkles className="w-6 h-6 text-gray-400" /> Style Preferences
                               </h4>
                               <div className="space-y-6">
                                  <div>
                                     <p className="text-base font-bold text-gray-400 uppercase tracking-wider mb-2">Gender Preference</p>
                                     <span className="inline-flex items-center px-5 py-2 rounded-full text-base font-medium bg-indigo-50 text-indigo-700">
                                        {profile.gender || 'Not specified'}
                                     </span>
                                  </div>
                                  <div>
                                     <p className="text-base font-bold text-gray-400 uppercase tracking-wider mb-2">Style Vibe</p>
                                     <p className="text-xl font-medium text-gray-900">{profile.preferredStyle || 'Not set yet'}</p>
                                  </div>
                                  <div className="pt-3">
                                     <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
                                        <p className="text-base text-yellow-800 flex gap-3 leading-relaxed">
                                           <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
                                           Updating your style preferences helps our AI recommend better outfits for you.
                                        </p>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                   <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div>
                         <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-4">Security & Danger Zone</h3>
                         
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Password Update */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                               <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-4 text-xl">
                                  <Lock className="w-5 h-5 text-gray-400" /> Update Password
                               </h4>
                               <form onSubmit={handleChangePassword} className="space-y-4">
                                  <div>
                                     <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                                     <input 
                                       type="password" 
                                       className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-base"
                                       value={passwordForm.currentPassword}
                                       onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                       required
                                     />
                                  </div>
                                  <div>
                                     <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                     <input 
                                       type="password" 
                                       className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-base"
                                       value={passwordForm.newPassword}
                                       onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                       required
                                     />
                                  </div>
                                  <div>
                                     <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                                     <input 
                                       type="password" 
                                       className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-base"
                                       value={passwordForm.confirmPassword}
                                       onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                       required
                                     />
                                  </div>
                                  
                                  {passwordMessage.text && (
                                     <div className={`text-sm p-4 rounded-xl flex items-center gap-3 ${
                                        passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                     }`}>
                                        {passwordMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                        {passwordMessage.text}
                                     </div>
                                  )}

                                  <div className="pt-2">
                                     <button type="submit" className="w-full px-6 py-3 bg-green-600 text-white rounded-xl text-base font-bold hover:bg-green-700 transition-colors shadow-lg shadow-gray-200">
                                        Update Password
                                     </button>
                                  </div>
                               </form>
                            </div>

                            {/* Danger Zone */}
                            <div className="space-y-4">
                               <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
                                  <h4 className="font-bold text-red-700 flex items-center gap-2 mb-3 text-xl">
                                     <ShieldAlert className="w-5 h-5" /> Danger Zone
                                  </h4>
                                  <p className="text-red-600/80 text-sm mb-4 leading-relaxed">
                                     Deleting your account is permanent and cannot be undone. All your data, including order history, saved outfits, and preferences will be permanently erased.
                                  </p>
                                  <button 
                                    onClick={handleDeleteAccount}
                                    className="w-full px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl text-base font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                  >
                                    Delete My Account
                                  </button>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
      </div>
      </main>
    </div>
  );
}
