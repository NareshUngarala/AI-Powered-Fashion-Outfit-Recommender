'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingBag, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-indigo-600">StyleAI</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Shop
              </Link>
              <Link href="/stylist" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                AI Stylist
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/checkout" className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">View cart</span>
                <ShoppingBag className="h-6 w-6" aria-hidden="true" />
              </Link>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Hello, {session.user?.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-red-600 hover:text-red-900"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link href="/auth/signin" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
