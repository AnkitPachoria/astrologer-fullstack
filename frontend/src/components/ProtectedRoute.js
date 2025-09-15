'use client';  // सबसे ऊपर डालो

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Note: Next.js App Router में 'next/navigation' से आता है

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;
