'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaBars, FaTimes, FaSignOutAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState({
    astroServices: true,
    homepage: true,
  });

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const toggleAccordion = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (path) => pathname === path;

  return (
    <ProtectedRoute>
      <>
        {/* Mobile Toggle */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 transition"
          >
            <FaBars className="text-xl" />
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 z-50 transform transition-transform duration-300 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 md:w-60 md:shadow-xl md:rounded-r-xl border-r border-gray-700 flex flex-col justify-between`}
        >
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <button
                onClick={toggleSidebar}
                className="md:hidden text-gray-300 hover:text-white transition"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Astro Services */}
            <div>
              <button
                onClick={() => toggleAccordion('astroServices')}
                className="flex items-center justify-between w-full px-4 py-2 rounded-md text-left text-gray-300 hover:bg-gray-700"
              >
                <span>Astro Services</span>
                {expanded.astroServices ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expanded.astroServices && (
                <div className="pl-4 mt-1 space-y-1">
                  <SidebarLink label="City" path="/admin-dashboard/city" active={isActive('/admin-dashboard/city')} />
                  <SidebarLink label="Service" path="/admin-dashboard/service" active={isActive('/admin-dashboard/service')} />
                  <SidebarLink label="Category" path="/admin-dashboard/category" active={isActive('/admin-dashboard/category')} />
                </div>
              )}
            </div>

            {/* Home Page Settings */}
            <div className="mt-4">
              <button
                onClick={() => toggleAccordion('homepage')}
                className="flex items-center justify-between w-full px-4 py-2 rounded-md text-left text-gray-300 hover:bg-gray-700"
              >
                <span>Home Page</span>
                {expanded.homepage ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expanded.homepage && (
                <div className="pl-4 mt-1 space-y-1">
                  <SidebarLink label="Banner" path="/admin-dashboard/banner-image" active={isActive('/admin-dashboard/banner-image')} />
                  <SidebarLink label="About" path="/admin-dashboard/about" active={isActive('/admin-dashboard/about')} />
                  <SidebarLink label="Awards" path="/admin-dashboard/awards" active={isActive('/admin-dashboard/awards')} />
                  <SidebarLink label="Testimonials" path="/admin-dashboard/testimonials" active={isActive('/admin-dashboard/testimonials')} />
                </div>
              )}
            </div>

            {/* Other Sections */}
            <div className="mt-6 space-y-1">
              <SidebarLink label="Home Setting" path="/admin-dashboard/home-setting" active={isActive('/admin-dashboard/home-setting')} />
              <SidebarLink label="Blogs" path="/admin-dashboard/blogs" active={isActive('/admin-dashboard/blogs')} />
              <SidebarLink label="Footer Call Section" path="/admin-dashboard/best-solution" active={isActive('/admin-dashboard/best-solution')} />
              <SidebarLink label="Contact" path="/admin-dashboard/contact" active={isActive('/admin-dashboard/contact')} />
              <SidebarLink label="Admin Appointments" path="/admin-dashboard/AdminAppointments" active={isActive('/admin-dashboard/AdminAppointments')} />
               <SidebarLink label="menu" path="/admin-dashboard/menu" active={isActive('/admin-dashboard/menu')} />
            </div>
          </div>

          {/* Logout */}
          <div className="mt-6 border-t border-gray-700 pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-md w-full transition"
            >
              <FaSignOutAlt className="text-base" />
              Logout
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {isOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={toggleSidebar}
          />
        )}
      </>
    </ProtectedRoute>
  );
}

function SidebarLink({ label, path, active }) {
  return (
    <Link
      href={path}
      className={`block px-4 py-2 rounded-md text-[15px] font-medium transition ${
        active
          ? 'bg-gray-700 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}
