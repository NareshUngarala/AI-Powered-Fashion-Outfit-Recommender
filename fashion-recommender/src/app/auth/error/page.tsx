'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An unknown error occurred';
  
  if (error === 'Configuration') {
    errorMessage = 'There is a problem with the server configuration. Check if your environment variables are set correctly.';
  } else if (error === 'AccessDenied') {
    errorMessage = 'Access denied. You do not have permission to sign in.';
  } else if (error === 'Verification') {
    errorMessage = 'The sign in link is no longer valid. It may have been used already or it may have expired.';
  } else if (error === 'CredentialsSignin') {
    errorMessage = 'Sign in failed. Check the details you provided are correct.';
  } else if (error) {
    errorMessage = error;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-700 mb-6">{errorMessage}</p>
        <div className="space-y-4">
            <Link 
              href="/auth/signin"
              className="inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Try Again
            </Link>
            <div className="block">
                <Link href="/" className="text-sm text-gray-500 hover:underline">
                    Go to Home
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
