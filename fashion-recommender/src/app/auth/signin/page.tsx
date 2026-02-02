'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
             <Image 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                alt="Fashion Model"
                fill
                className="object-cover opacity-60"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
           <Image 
             src="/logo.jpg" 
             alt="Style Genie Logo" 
             width={32} 
             height={32} 
             className="h-8 w-8 object-contain rounded-sm"
           />
           <span className="font-bold text-xl tracking-tight text-white">STYLE GENIE</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Elevate Your Wardrobe with AI.
          </h1>
          <p className="text-gray-200 text-lg leading-relaxed">
            Experience a new era of personalized fashion. Log in to access your curated style feed and AI recommendations.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Style Genie Inc.</p>
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 sm:p-8 lg:p-12">
        <div className="max-w-md w-full">
          {/* Mobile Logo/Branding (Visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Image 
              src="/logo.jpg" 
              alt="Style Genie Logo" 
              width={32} 
              height={32} 
              className="h-8 w-8 object-contain rounded-sm"
            />
            <span className="font-bold text-xl tracking-tight text-gray-900">STYLE GENIE</span>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-600 focus:ring-0 transition-all outline-none text-gray-900 placeholder-gray-400 bg-gray-50"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-600 focus:ring-0 transition-all outline-none text-gray-900 placeholder-gray-400 bg-gray-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end mt-1">
                <button type="button" className="text-sm font-medium text-green-600 hover:text-green-500">
                  Forgot password?
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Stay signed in for 30 days
              </label>
            </div>

            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-[#0EA5E9] hover:bg-[#0284c7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0EA5E9] transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In ->'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium text-[10px] tracking-widest uppercase">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-full shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-full shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.24.75-.42 1.56-.81 2.27-.38.76-.74 1.55-1.72 1.81zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Apple
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            New to Style Genie?{' '}
            <Link href="#" className="font-semibold text-green-600 hover:text-green-500">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
