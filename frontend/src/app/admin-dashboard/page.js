'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/login');  
    } else {
      router.replace('/admin-dashboard/city'); 
    }
  }, [router]);

  return null;
}
