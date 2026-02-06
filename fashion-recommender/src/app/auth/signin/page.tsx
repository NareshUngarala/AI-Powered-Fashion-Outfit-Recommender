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
      console.error("Sign in error:", result.error);
      setError(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error);
      setLoading(false);
    } else {
      router.push('/shop');
      router.refresh();
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden">
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
             width={40} 
             height={40} 
             className="h-10 w-10 object-contain rounded-lg"
           />
           <span className="font-bold text-2xl tracking-tight text-white">Style Genie</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-medium leading-tight mb-6">
            Elevate Your Wardrobe with AI.
          </h1>
          <p className="text-gray-200 text-lg leading-relaxed">
            Experience a new era of personalized fashion. Log in to access your curated style feed and proprietary AI recommendations.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Style Genie Inc.</p>
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 lg:p-12 h-full overflow-hidden">
        <div className="max-w-md w-full flex flex-col justify-center h-full max-h-[800px]">
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Image 
              src="/logo.jpg" 
              alt="Style Genie Logo" 
              width={32} 
              height={32} 
              className="h-8 w-8 object-contain rounded-sm"
            />
            <span className="font-bold text-xl tracking-tight text-gray-900">Style Genie</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
            <p className="text-sm text-gray-500">Enter your credentials to access your studio.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder-gray-400 text-sm"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <button type="button" className="text-xs font-bold text-green-600 hover:text-green-500">
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder-gray-400 text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-3.5 w-3.5 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-500 cursor-pointer">
                Stay signed in for 30 days
              </label>
            </div>

            {error && <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-md hover:shadow-lg text-base font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-400 font-medium text-[10px] tracking-widest uppercase">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-full shadow-sm bg-white hover:bg-gray-50 transition-all"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
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
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-full shadow-sm bg-white hover:bg-gray-50 transition-all text-gray-900"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.39-1.09-.52-2.04-.48-3.24 0-1.44.58-2.2.08-3.08-.88-1.91-2.05-1.42-5.96 1.48-6.12 1.28-.07 2.15.54 2.89.54.71 0 1.94-.65 3.33-.55 2.13.15 3.06 1.15 3.52 1.84-2.88 1.55-2.39 5.37.64 6.42-.64 1.41-1.49 2.8-2.46 3.82zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
                New to Style Genie?{' '}
                <Link href="/auth/signup" className="font-bold text-gray-900 border-b border-gray-900 hover:text-green-600 hover:border-green-600 transition-all">
                Create an account
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
