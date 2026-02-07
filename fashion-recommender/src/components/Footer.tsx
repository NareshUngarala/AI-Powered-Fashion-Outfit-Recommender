import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-10 lg:pt-8 xl:pt-12 pb-6 lg:pb-6 xl:pb-8">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-8 xl:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
               <Image 
                 src="/logo.png" 
                 alt="Style Genie Logo" 
                 width={28} 
                 height={28} 
                 className="h-7 w-7 object-contain"
               />
               <span className="font-bold text-lg tracking-tight text-gray-900">STYLE GENIE</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Redefining style through artificial intelligence. We help you find the perfect outfit for any occasion, tailored to your unique persona.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all duration-200">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all duration-200">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all duration-200">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-500 hover:scale-110 transition-all duration-200">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Shop</Link></li>
              <li><Link href="/stylist" className="text-gray-500 hover:text-green-600 text-sm transition-colors">AI Stylist</Link></li>
              <li><Link href="/collections" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Collections</Link></li>
              <li><Link href="/about" className="text-gray-500 hover:text-green-600 text-sm transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Size Guide</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-green-600 text-sm transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 lg:mt-6 xl:mt-10 border-t border-gray-100 pt-6 lg:pt-5 xl:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} Style Genie. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-2 md:mt-0">
            Designed with <span className="text-green-500">♥</span> by Trae
          </p>
        </div>
      </div>
    </footer>
  );
}
