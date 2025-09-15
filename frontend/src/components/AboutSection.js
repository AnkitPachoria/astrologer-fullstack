'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaQuoteLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AboutSection() {
  const [about, setAbout] = useState(null);
  const [homeSetting, setHomeSetting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [aboutRes, homeSettingRes] = await Promise.all([
          fetch(`${API_URL}/api/about`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
          axios.get(`${API_URL}/api/home-setting`),
        ]);

        if (!aboutRes.ok) {
          console.error('Fetch about failed with status:', aboutRes.status, aboutRes.statusText);
          throw new Error(`Failed to fetch about: ${aboutRes.status} ${aboutRes.statusText}`);
        }

        const aboutData = await aboutRes.json();
        console.log('Fetched about data:', aboutData); // Debug log
        const aboutArray = Array.isArray(aboutData) ? aboutData : [aboutData];
        const activeAbout = aboutArray.find((item) => item.status === 1) || aboutArray[0];
        if (!activeAbout) {
          throw new Error('No about data available');
        }

        setAbout(activeAbout);
        setHomeSetting(homeSettingRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load about data. Please try again later.');
        toast.error('Failed to load about data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = () => {
    if (!about) return;
    router.push('/admin/about');
  };

  const handleDelete = async () => {
    if (!about) return;
    if (!confirm('Are you sure you want to delete this about data?')) return;
    try {
      const res = await fetch(`${API_URL}/api/about/${about.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      toast.success('About data deleted');
      setAbout(null);
    } catch (err) {
      console.error('Error deleting about:', err);
      toast.error('Failed to delete about data.');
    }
  };

  if (loading) return <p className="text-center text-gray-600 py-14">Loading...</p>;
  if (error) return <p className="text-center text-red-600 py-14">{error}</p>;
  if (!about) return <p className="text-center text-gray-600 py-14">No about data available.</p>;

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-14">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      {/* Heading */}
      <div className="text-center">
        <h2 
          className="text-3xl font-extrabold uppercase tracking-wider"
          style={{ color: homeSetting?.heading_color || '#000000' }}
        >
          {'About Us'}
        </h2> 
        <div className="w-24 h-[3px] bg-orange-500 mx-auto mt-1 mb-2 rounded-full"></div>
        <div className="text-orange-700 text-3xl font-bold mb-6">ॐ</div>
      </div>

      {/* Main Flex Content */}
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        {/* Left Image */}
        <div className="md:w-1/3 flex justify-center">
          <div className="relative w-40 h-40 rounded-full border-[6px] border-yellow-600 overflow-hidden shadow-md">
            <Image
              src={about.image ? `${API_URL}${about.image}` : '/default-about.jpg'}
              alt={about.short_title || 'About Image'}
              fill
              className="object-cover"
              onError={(e) => {
                console.error('Error loading image:', about.image);
                e.target.src = '/default-about.jpg';
              }}
            />
          </div>
        </div>

        {/* Right Content */}
        <div className="md:w-2/3 text-center md:text-left">
          <p className="text-red-600 font-semibold text-sm tracking-wider uppercase">
            {about.short_title || 'About Us'}
          </p>
          <h3 
            className="text-4xl font-bold mt-1"
            style={{ color: homeSetting?.heading_color || '#000000' }}
          >
            {about.title || 'Our Mission'}
          </h3>
          <p className="mt-3 text-gray-700 leading-relaxed text-[16px]">
            {about.subtitle || 'Discover the power of our services.'}
          </p>
        </div>
      </div>

      {/* Paragraph Section */}
      <div className="mt-10 space-y-8 text-gray-800 text-[15.5px] leading-relaxed">
        <div
          className="text-gray-800 leading-relaxed text-justify"
          dangerouslySetInnerHTML={{ __html: about.description || 'No description available.' }}
        />
      </div>

      {/* Highlight Box */}
      <div className="bg-yellow-50 border-l-[6px] border-orange-500 px-6 py-4 mt-10 text-gray-800 flex items-start gap-3 text-[15px] rounded-md shadow-sm">
        <FaQuoteLeft className="text-orange-500 text-xl mt-1" />
        <p>{about.note || 'No additional notes available.'}</p>
      </div>
    </section>
  );
}