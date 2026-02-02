'use client';

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, 
  Settings, 
  Package, 
  Heart, 
  CreditCard, 
  LogOut,
  Sparkles,
  MapPin,
  Camera,
  ChevronRight,
  Clock
} from 'lucide-react';

export default function ProfilePage() {
  // Mock User Data
  const user = {
    name: "Alex Doe",
    email: "alex.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    joinDate: "Member since 2023",
    location: "New York, USA",
    styleStats: {
      vibe: "Urban Minimalist",
      matchRate: "94%",
      scans: 12
    }
  };

  const recentOrders = [
    {
      id: "#ORD-7782",
      date: "Oct 24, 2023",
      status: "Delivered",
      total: "$345.00",
      items: 3,
      images: [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=200",
        "https://images.unsplash.com/photo-1506629082955-511b1aa002c4?auto=format&fit=crop&q=80&w=200"
      ]
    },
    {
      id: "#ORD-9921",
      date: "Sep 12, 2023",
      status: "In Transit",
      total: "$120.00",
      items: 1,
      images: [
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=200"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
           {/* Background Decor */}
           <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

           <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="relative group cursor-pointer">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                    <Image 
                      src={user.avatar} 
                      alt={user.name} 
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
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.name}</h1>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                      <Sparkles className="w-3 h-3" />
                      Style Icon
                    </span>
                 </div>
                 <p className="text-gray-500">{user.email}</p>
                 <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-400 pt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {user.joinDate}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {user.location}</span>
                 </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                 <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{user.styleStats.scans}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">Style Scans</div>
                 </div>
                 <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{user.styleStats.matchRate}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">Match Rate</div>
                 </div>
                 <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">14</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">Saved Items</div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           
           {/* Sidebar Navigation - Made more compact */}
           <div className="lg:col-span-1 space-y-6">
              <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 space-y-1">
                 {[
                    { icon: User, label: 'Personal Information', active: true },
                    { icon: Package, label: 'My Orders' },
                    { icon: Heart, label: 'Wishlist & Saved' },
                    { icon: Sparkles, label: 'AI Style Profile' },
                    { icon: CreditCard, label: 'Payment Methods' },
                    { icon: Settings, label: 'Settings' },
                 ].map((item) => (
                    <button 
                      key={item.label}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-all ${
                        item.active 
                          ? 'bg-gray-900 text-white shadow-md' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                       <div className="flex items-center gap-3">
                          <item.icon className={`w-4 h-4 ${item.active ? 'text-green-400' : 'text-gray-400'}`} />
                          {item.label}
                       </div>
                       <ChevronRight className={`w-4 h-4 ${item.active ? 'text-gray-400' : 'text-gray-300'}`} />
                    </button>
                 ))}
                 
                 <div className="pt-3 mt-3 border-t border-gray-100">
                    <button className="w-full flex items-center gap-3 p-2.5 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors">
                       <LogOut className="w-4 h-4" />
                       Sign Out
                    </button>
                 </div>
              </nav>


           </div>

           {/* Main Content Area - Grid Layout */}
           <div className="lg:col-span-3 grid grid-cols-1 xl:grid-cols-2 gap-6 h-fit">
              
              {/* Recent Orders Section */}
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                    <Link href="#" className="text-sm font-medium text-green-600 hover:text-green-700">View All</Link>
                 </div>
                 
                 <div className="space-y-4">
                    {recentOrders.map((order) => (
                       <div key={order.id} className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors flex gap-4 items-center">
                          <div className="flex -space-x-3 overflow-hidden flex-shrink-0">
                             {order.images.map((img, i) => (
                                <div key={i} className="w-12 h-12 rounded-lg border-2 border-white shadow-sm relative z-0 hover:z-10 transition-all">
                                   <Image src={img} alt="Item" fill className="object-cover rounded-md" />
                                </div>
                             ))}
                             {order.items > order.images.length && (
                                <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                   +{order.items - order.images.length}
                                </div>
                             )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                             <h3 className="font-bold text-gray-900 text-sm truncate">{order.id}</h3>
                             <p className="text-gray-500 text-xs">{order.date} • {order.items} Items</p>
                          </div>
                          
                          <div className="text-right">
                             <div className="font-bold text-gray-900 text-sm">{order.total}</div>
                             <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide mt-1 ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                             }`}>
                                {order.status}
                             </span>
                          </div>
                       </div>
                    ))}
                 </div>
              </section>

              {/* Personal Info Form (Read-only Demo) */}
              <section className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                    <button className="text-sm font-medium text-gray-500 hover:text-gray-900">Edit</button>
                 </div>
                 
                 <div className="space-y-4">
                    <div>
                       <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Full Name</label>
                       <input 
                         type="text" 
                         value={user.name} 
                         readOnly 
                         className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Email Address</label>
                       <input 
                         type="email" 
                         value={user.email} 
                         readOnly 
                         className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none"
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Phone Number</label>
                         <input 
                           type="text" 
                           value="+1 (555) 123-4567" 
                           readOnly 
                           className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none"
                         />
                      </div>
                      <div>
                         <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Location</label>
                         <input 
                           type="text" 
                           value={user.location} 
                           readOnly 
                           className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none"
                         />
                      </div>
                    </div>
                 </div>
              </section>

           </div>
        </div>

      </main>
    </div>
  );
}