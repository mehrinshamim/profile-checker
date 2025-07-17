'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function RightSide() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode as 'login' | 'signup');
  const [isLoading, setIsLoading] = useState(false);

  // keep url in sync when tab changes
  useEffect(() => {
    const url = `/auth?mode=${mode}`;
    router.replace(url);
  }, [mode, router]);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Add your Google OAuth logic here
      console.log('Initiating Google OAuth...');
      
      // Example: Replace with your actual Google OAuth implementation
      // const result = await signInWithGoogle();
      // if (result.success) {
      //   router.push('/dashboard'); // or wherever you want to redirect after auth
      // }
      
      // For now, just simulate loading
      setTimeout(() => {
        setIsLoading(false);
        // Simulate successful auth - redirect to home
        router.push('/');
      }, 2000);
      
    } catch (error) {
      console.error('Authentication failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-1/2 bg-black flex items-center justify-center p-8 relative">
      <div className="w-full max-w-md">
        {/* Boundary toggle */}
        <div className="absolute left-0 top-[50%] transform -translate-x-full -translate-y-1/2 z-30">
          {/* Toggle Container vertical */}
          <div className="flex flex-col w-56 rounded-l-3xl rounded-r-none overflow-hidden shadow-xl border border-white/50 bg-black/80">
            <button
              onClick={() => setMode('login')}
              className={`py-4 font-fjalla-one text-lg transition-colors ${mode==='login' ? 'bg-white text-black' : 'text-white'}`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`py-4 font-fjalla-one text-lg transition-colors border-t border-white/30 ${mode==='signup' ? 'bg-white text-black' : 'text-white'}`}
            >
              Signup
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-bold font-fjalla-one mb-2 capitalize">
            {mode}
          </h1>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className={`w-full bg-white text-gray-800 font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 mb-6 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              {/* Google Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>{mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}</span>
            </>
          )}
        </button>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium hover:bg-gray-900 px-4 py-2 rounded-lg group"
          >
            <svg 
              className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 