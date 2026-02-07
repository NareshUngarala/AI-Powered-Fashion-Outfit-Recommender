'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { User, Users } from 'lucide-react';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Unisex');
  const [preferredStyle, setPreferredStyle] = useState('Casual Wear');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) {
      setError('You must agree to the Terms & Conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          gender,
          preferredStyle,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Redirect to sign in page after successful registration
      router.push('/auth/signin?registered=true');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const styleOptions = [
    'Casual Wear', 'Formal Wear', 'Party Wear', 'Traditional Wear', 'Streetwear', 'Bohemian', 'Business'
  ];

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
             <Image 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2074&auto=format&fit=crop"
                alt="Fashion Model"
                fill
                className="object-cover opacity-70"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
           <Image 
             src="/logo.png" 
             alt="Style Genie Logo" 
             width={40} 
             height={40} 
             className="h-10 w-10 object-contain rounded-lg"
           />
           <span className="font-bold text-2xl tracking-tight text-white">Style Genie</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-xl animate-page-enter">
          <h1 className="text-5xl font-medium leading-tight mb-4">
            Join the Fashion Revolution.
          </h1>
          <p className="text-gray-200 text-lg leading-relaxed font-light">
            Create an account to unlock your personal AI stylist and discover outfits tailored just for you. Your wardrobe, reimagined.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Style Genie Inc.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 sm:p-8 lg:px-16 lg:py-4">
        <div className="max-w-md w-full animate-form-enter">
          {/* Mobile Logo/Branding */}
          <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
            <Image 
              src="/logo.png" 
              alt="Style Genie Logo" 
              width={32} 
              height={32} 
              className="h-8 w-8 object-contain rounded-sm"
            />
            <span className="font-bold text-xl tracking-tight text-gray-900">Style Genie</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
            <p className="text-sm text-gray-500">Sign up to get started with your style journey.</p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder-gray-400 text-sm"
                    placeholder="Full Name"
                    required
                />
                
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder-gray-400 text-sm"
                    placeholder="Email Address"
                    required
                />
            </div>

            {/* Gender Selector */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        type="button"
                        onClick={() => setGender('Women')}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                            gender === 'Women' 
                            ? 'border-green-600 bg-green-50 text-green-700' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                    >
                        <User className="h-5 w-5 mb-1" />
                        <span className="text-xs font-medium">Female</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setGender('Men')}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                            gender === 'Men' 
                            ? 'border-green-600 bg-green-50 text-green-700' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                    >
                        <User className="h-5 w-5 mb-1" />
                        <span className="text-xs font-medium">Male</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setGender('Unisex')}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                            gender === 'Unisex' 
                            ? 'border-green-600 bg-green-50 text-green-700' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                    >
                        <Users className="h-5 w-5 mb-1" />
                        <span className="text-xs font-medium">Unisex</span>
                    </button>
                </div>
            </div>

            {/* Style Selector */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Preferred Style</label>
                <div className="flex flex-wrap gap-1.5">
                    {styleOptions.map((style) => (
                        <button
                            key={style}
                            type="button"
                            onClick={() => setPreferredStyle(style)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                preferredStyle === style
                                ? 'bg-green-600 text-white border-green-600 shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {style}
                        </button>
                    ))}
                </div>
            </div>

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder-gray-400 text-sm"
                placeholder="Password"
                required
                minLength={6}
            />

            {/* Terms Checkbox */}
            <div className="flex items-center">
                <input
                    id="terms"
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="h-3.5 w-3.5 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2 block text-xs text-gray-500 cursor-pointer">
                    I agree to the <Link href="#" className="text-green-600 hover:text-green-500">Terms & Conditions</Link>
                </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-base"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-semibold text-green-600 hover:text-green-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
