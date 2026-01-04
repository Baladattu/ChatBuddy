'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function RootPage() {
  const router = useRouter();
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!authUser) {
        // User is not authenticated, redirect to login
        router.push('/login');
      }
      // If authenticated, just stay on this page (which will show the chat)
    }
  }, [authUser, isCheckingAuth, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // User is not authenticated, they'll be redirected by the useEffect
  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // User is authenticated, but the actual chat UI is in (chat)/page.tsx
  // This root page should not be reached for authenticated users
  // Let's redirect them properly
  return null;
}
