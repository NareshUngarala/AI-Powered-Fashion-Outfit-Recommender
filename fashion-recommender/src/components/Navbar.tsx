'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingBag, User as UserIcon, Heart, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <Link href="/" className="flex items-center gap-2">
               <Image 
                 src="/logo.png" 
                 alt="Style Genie Logo" 
                 width={32} 
                 height={32} 
                 className="h-8 w-8 object-contain"
               />
               <span className="font-bold text-xl tracking-tight text-gray-900">STYLE GENIE</span>
            </Link>
          </div>

          {/* Center Navigation (Desktop) */}
          {session && (
            <div className="hidden md:flex space-x-8">
              <Link href="/shop" className="text-gray-500 hover:text-gray-900 px-3 py-1 text-sm font-medium transition-colors">
                Shop
              </Link>
              <Link href="/stylist" className="text-gray-900 px-3 py-1 text-sm font-medium flex items-center gap-1">
                AI Stylist
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
              </Link>
              <Link href="/collections" className="text-gray-500 hover:text-gray-900 px-3 py-1 text-sm font-medium transition-colors">
                Collections
              </Link>
            </div>
          )}

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {session && (
              <>
                {/* Search - Sliding Animation */}
                <div className={`relative hidden sm:flex items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isSearchOpen ? 'w-64' : 'w-10'}`}>
                   <div className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center rounded-full overflow-hidden transition-all duration-500 ${
                     isSearchOpen 
                       ? 'w-full bg-white shadow-sm border border-green-100 ring-1 ring-green-500/5 pl-4' 
                       : 'w-10 h-10 bg-gray-50 border-none hover:bg-gray-100 justify-center'
                   }`}>
                      
                      <input 
                         ref={searchInputRef}
                         type="text" 
                         className={`bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400 focus:ring-0 p-0 h-full transition-all duration-300 ${
                           isSearchOpen ? 'w-full opacity-100' : 'w-0 opacity-0'
                         }`}
                         placeholder="Search trends..."
                        onBlur={() => {
                           if (!searchInputRef.current?.value) {
                             setIsSearchOpen(false);
                           }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setIsSearchOpen(false);
                            searchInputRef.current?.blur();
                          }
                        }}
                      />
                      
                      <button 
                        onClick={() => {
                          setIsSearchOpen(!isSearchOpen);
                          if (!isSearchOpen) {
                            setTimeout(() => searchInputRef.current?.focus(), 100);
                          }
                        }}
                        className={`flex-shrink-0 p-2 transition-colors duration-300 ${
                          isSearchOpen ? 'text-green-600' : 'text-gray-900 hover:text-green-600'
                        }`}
                      >
                        <Search className="h-5 w-5" />
                      </button>
                   </div>
                </div>

                <button 
                  className="relative w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-900 hover:text-green-600"
                  onClick={() => setIsWishlistOpen(true)}
                >
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-900 hover:text-green-600"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}
            
            {session ? (
                <div className="relative group">
                  <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-900 hover:text-green-600 transition-colors overflow-hidden">
                     {session.user?.image ? (
                       <Image 
                         src={session.user.image} 
                         alt={session.user.name || 'Profile'} 
                         width={40} 
                         height={40} 
                         className="w-full h-full object-cover"
                       />
                     ) : (
                       <UserIcon className="h-5 w-5" />
                     )}
                  </button>
                   <div className="absolute right-0 pt-2 w-48 hidden group-hover:block">
                      <div className="bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                        <div className="px-4 py-2 text-xs text-gray-500">Signed in as {session.user?.name}</div>
                        <Link href="/profile" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Profile
                        </Link>
                        <button onClick={() => signOut({ callbackUrl: '/' })} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/auth/signin" className="text-sm font-medium text-gray-900 hover:text-green-600">
                    Sign in
                  </Link>
                  <Link href="/auth/signup" className="text-sm font-medium text-white bg-black px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                    Sign up
                  </Link>
                </div>
              )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="space-y-1 px-4 py-3">
            <Link 
              href="/shop" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="/stylist" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AI Stylist
            </Link>
            <Link 
              href="/collections" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link 
              href="/profile" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            
            {/* Mobile Search */}
            <div className="mt-4 relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
               </div>
               <input 
                  type="text" 
                  className="bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-sm w-full"
                  placeholder="Search trends..."
               />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
