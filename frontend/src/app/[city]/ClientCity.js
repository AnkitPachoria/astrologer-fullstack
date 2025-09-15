'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ClientCity({ city }) {
  const [cityData, setCityData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [homeSetting, setHomeSetting] = useState(null);
  const [loadingCity, setLoadingCity] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingHomeSetting, setLoadingHomeSetting] = useState(true);

  useEffect(() => {
    // Reset states when city changes
    setCityData(null);
    setCategories([]);
    setHomeSetting(null);
    setLoadingCity(true);
    setLoadingCategories(true);
    setLoadingHomeSetting(true);

    // Fetch home-setting for heading_color, service_text_color, and astrologer_name
    async function fetchHomeSetting() {
      try {
        console.log('Attempting to fetch home-setting from:', `${API_URL}/api/home-setting`);
        const res = await axios.get(`${API_URL}/api/home-setting`, {
          timeout: 10000, // 10-second timeout
        });
        console.log('Home-setting API response:', res.status, res.data);
        if (!res.data || Object.keys(res.data).length === 0) {
          throw new Error('Empty or invalid response from home-setting API');
        }
        setHomeSetting(res.data);
      } catch (err) {
        console.error('Error fetching home-setting:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          code: err.code,
        });
        toast.error(`Failed to load home settings: ${err.message}`);
        setHomeSetting({
          heading_color: '#1E3A8A',
          service_text_color: '#1E3A8A',
          astrologer_name: 'Astrologer Pawan Acharya',
        });
      } finally {
        setLoadingHomeSetting(false);
      }
    }

    // Fetch city data
    async function fetchCityData() {
      try {
        console.log('Fetching city data for slug:', city);
        const res = await fetch(`${API_URL}/api/cities?slug=${city}&t=${Date.now()}`, {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        const data = await res.json();
        console.log('City API response:', res.status, data);
        if (!res.ok || !Array.isArray(data) || data.length === 0) {
          throw new Error(data?.error || 'City not found');
        }
        setCityData(data[0]);
      } catch (error) {
        console.error('Error fetching city:', error.message);
        toast.error(`Error fetching city: ${error.message}`);
        setCityData(null);
      } finally {
        setLoadingCity(false);
      }
    }

    // Fetch categories data
    async function fetchCategories() {
      try {
        console.log('Fetching categories from:', `${API_URL}/api/categories`);
        const res = await fetch(`${API_URL}/api/categories?t=${Date.now()}`, {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        const data = await res.json();
        console.log('Categories API response:', res.status, data);
        if (!res.ok || !Array.isArray(data)) {
          throw new Error(data?.error || 'Failed to fetch categories');
        }
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
        toast.error(`Error fetching categories: ${error.message}`);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchHomeSetting();
    fetchCityData();
    fetchCategories();
  }, [city]);

  // Get dynamic colors and titles
  const headingColor = homeSetting?.heading_color || '#1E3A8A';
  const serviceTextColor = homeSetting?.service_text_color || '#1E3A8A';
  const astrologerName = homeSetting?.astrologer_name || 'Astrologer Pawan Acharya';

  // Static services data with image URLs
  const services = [
    {
      title: 'Horoscope Analysis',
      image: '/horoscope.png',
    },
    {
      title: 'Birth Chart Analysis',
      image: '/birth.png',
    },
    {
      title: 'Kundali Matching',
      image: '/Kundali-Matching.png',
    },
    {
      title: 'Career Problems',
      image: '/portfolio.png',
    },
     {
      title: 'Vastu Consultation',
      image: '/Vastu-Consultation.png',
    },
     {
      title: 'Relationship Astrology',
      image: '/relationship.png',
    },
     {
      title: 'Medical Astrology',
      image: '/healthcare1.png',
    },
     {
      title: 'Spiritual Astrologys',
      image: '/Spiritual-Astrology.png',
    },
  ];

  if (loadingCity || loadingHomeSetting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!cityData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-700 px-4">
        <h2
          className="text-2xl md:text-3xl font-semibold mb-4"
          style={{ color: headingColor }}
        >
          City not found
        </h2>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-500 font-medium transition duration-300"
        >
          Go back to Home
        </Link>
      </div>
    );
  }

  const imageUrl = cityData.image
    ? cityData.image.startsWith('http')
      ? cityData.image
      : `${API_URL}${encodeURI(cityData.image)}`
    : '/default-banner.jpg';

  return (
    <div className="min-h-screen ">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

      {/* Banner */}
      <div className="relative w-full h-[400px] overflow-hidden">
        {console.log('City image URL:', imageUrl)}
        <Image
          src={imageUrl}
          alt={cityData.name}
          fill
          className="object-cover"
          onError={(e) => {
            console.log('City image load error:', imageUrl);
            e.currentTarget.src = '/default-banner.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-black/70 to-blue-900/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <h1
            className="text-4xl md:text-5xl font-extrabold drop-shadow-lg animate-fade-in text-white"
            // style={{ color: headingColor }}
          >
            {cityData.title || cityData.name}
          </h1>
          <nav
            className="mt-4 text-sm md:text-base text-gray-200"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-gray-200 hover:text-blue-300 transition duration-300"
            >
              Home
            </Link>{' '}
            / <span className="text-white">{cityData.name}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12 contentarea">
        {cityData.description && (
          <section className="mb-12 bg-white rounded-lg shadow-lg border border-gray-300 p-8 prose prose-lg max-w-none text-gray-700">
            {cityData.sub_title && (
              <h2
                className="text-2xl md:text-4xl font-semibold mb-4 text-black"
                // style={{ color: headingColor }}
              >
                {cityData.sub_title}
              </h2>
            )}
            <div
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: cityData.description }}
            />
          </section>
        )}

        {/* Categories */}
        <section>
          <h3
            className="text-xl md:text-3xl font-semibold mb-8 "
            style={{ color: headingColor }}
          >
            Explore Our Services in {cityData.name}
          </h3>
          {loadingCategories ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-600 text-center">
              No categories found for {cityData.name}.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => {
                const catImage = category.image
                  ? category.image.startsWith('http')
                    ? category.image
                    : `${API_URL}${encodeURI(category.image)}`
                  : '/default-category.jpg';
                return (
                  <Link
                    key={category.id || category._id}
                    href={`/${city}/${category.slug}`}
                    className="block bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <div className="h-48 w-full relative overflow-hidden">
                      {console.log('Category image URL:', catImage)}
                      <Image
                        src={catImage}
                        alt={category.title || category.name}
                        fill
                        className="object-cover hover:opacity-90 transition duration-300"
                        loading="lazy"
                        onError={(e) => {
                          console.log('Category image load error:', catImage);
                          e.currentTarget.src = '/default-category.jpg';
                        }}
                      />
                    </div>
                    <div className="p-6 flex flex-col items-center text-center">
                      <h3
                        className="text-xl font-semibold text-black"
                        // style={{ color: headingColor }}
                      >
                        {category.title || category.name}
                      </h3>
                      {category.sub_title && (
                        <p className="mt-2 text-gray-600">{category.sub_title}</p>
                      )}
                      <span className="inline-block mt-3 text-blue-600 hover:text-blue-500 font-medium">
                        Explore Now →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Static Services Section */}
   <section className="py-16 bg-gradient-to-b from-white to-purple-50 mt-12">
  <div className="w-full px-4 sm:px-6 lg:px-8 text-left">
    <h2
      className="text-3xl sm:text-4xl font-bold text-purple-900 mb-4"
      style={{ color: headingColor }}
    >
      Astrology Services Provided by {astrologerName}
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service, index) => (
        <div
          key={index}
          className="bg-white shadow-lg p-10 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition duration-300"
        >
          <div className="relative h-18 w-18 mb-2">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              onError={(e) => {
                console.log('Service image load error:', service.image);
                // This fallback won't work with <Image> from next/image
                // You’d need to handle it differently (see below)
              }}
            />
          </div>
          <h3
            className="text-base font-semibold text-black"
            // style={{ color: headingColor }}
          >
            {service.title}
          </h3>
        </div>
      ))}
    </div>
  </div>
</section>
      </div>
    </div>
  );
}