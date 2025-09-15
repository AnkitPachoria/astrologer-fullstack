'use client';

import { usePathname } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Jahan header-footer nahi chahiye:
  const hideLayoutFor = ['/login', '/admin-dashboard'];

  // Check if current path starts with any of these:
  const hideLayout = hideLayoutFor.some(path => pathname === path || pathname.startsWith(path + '/'));

  if (hideLayout) {
    // sirf children render karo bina header footer ke
    return <>{children}</>;
  }

  // Otherwise, header footer ke sath render karo
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
 