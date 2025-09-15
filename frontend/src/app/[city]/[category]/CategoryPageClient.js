'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CategoryPageClient({ cityData, categoryData }) {
  const [services, setServices] = useState([]);
  const [homeSetting, setHomeSetting] = useState(null);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingHomeSetting, setLoadingHomeSetting] = useState(true);

  useEffect(() => {
    if (!cityData || !categoryData) {
      toast.error('City or category data missing');
      setLoadingServices(false);
      setLoadingHomeSetting(false);
      return;
    }

    // Fetch home-setting for heading_color
    const fetchHomeSetting = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/home-setting`);
        console.log('Fetched home-setting:', res.data);
        setHomeSetting(res.data);
      } catch (err) {
        console.error('Error fetching home-setting:', err);
        toast.error('Failed to load home settings');
        setHomeSetting(null);
      } finally {
        setLoadingHomeSetting(false);
      }
    };

    // Fetch services
    console.log('Fetching services for:', { cityId: cityData.id, categoryId: categoryData.id });
    fetch(
      `${API_URL}/api/services?city_id=${cityData.id}&category_id=${categoryData.id}&t=${Date.now()}`,
      {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch services');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Services fetched:', data);
        setServices(data);
      })
      .catch((err) => {
        console.error('Fetch services error:', err);
        toast.error(`Services Error: ${err.message}`);
        setServices([]);
      })
      .finally(() => setLoadingServices(false));

    fetchHomeSetting();
  }, [cityData, categoryData]);

  // Construct image URLs
  const cityImageUrl = cityData.image
    ? cityData.image.startsWith('http')
      ? cityData.image
      : `${API_URL}${encodeURI(cityData.image)}`
    : '/default-banner.jpg';
  const categoryImageUrl = categoryData.image
    ? categoryData.image.startsWith('http')
      ? categoryData.image
      : `${API_URL}${encodeURI(categoryData.image)}`
    : '/default-banner.jpg';

  // Get dynamic heading color
  const headingColor = homeSetting?.heading_color || '#1E3A8A';
  const serviceTextColor = homeSetting?.service_text_color || '#1E3A8A';

  return (
    <div className="min-h-screen ">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />

      {/* Banner Section */}
      <div className="relative w-full h-[400px] overflow-hidden">
        {console.log('Category image URL:', categoryImageUrl)}
        <Image
          src={categoryImageUrl}
          alt={categoryData.title || categoryData.name}
          fill
          className="object-cover"
          onError={(e) => {
            console.log('Category image load error:', categoryImageUrl);
            e.currentTarget.src = '/default-banner.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-black/70 to-blue-900/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center">
          <h1
            className="text-4xl md:text-5xl font-extrabold drop-shadow-lg animate-fade-in text-white"
            // style={{ color: headingColor }}
          >
            {categoryData.title || categoryData.name}
          </h1>
          <nav className="mt-4 text-sm md:text-base text-gray-200" aria-label="Breadcrumb">
            <Link
              href="/"
              className="text-gray-200 hover:text-blue-300 transition duration-300"
            >
              Home
            </Link>{' '}
            /{' '}
            <Link
              href={`/${cityData.slug}`}
              className="text-gray-200 hover:text-blue-300 transition duration-300"
            >
              {cityData.name}
            </Link>{' '}
            / <span className="text-white">{categoryData.name}</span>
          </nav>
        </div>
      </div>

      {/* Description Section */}
      <section className="max-w-[1400px] mx-auto px-6 py-12 bg-white rounded-lg shadow-lg border border-gray-300 contentarea">
        <h2
          className="text-3xl md:text-3xl font-semibold  text-gray-800"
          style={{ color: headingColor }}
        >
          {categoryData.title || categoryData.name}
        </h2>
        {categoryData.sub_title && (
          <p className="mt-2 text-lg text-gray-600">{categoryData.sub_title}</p>
        )}
        {categoryData.description && (
          <div
            className="mt-4 prose prose-lg text-gray-700"
            dangerouslySetInnerHTML={{
              __html: categoryData.description,
            }}
          />
        )}
      </section>

      {/* Services Section */}
      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <h2
          className="text-3xl md:text-2xl font-semibold  mb-8 text-gray-800"
          style={{ color: headingColor }}
        >
          Services for {categoryData.title || categoryData.name} in {cityData.name}
        </h2>
        {loadingServices ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : services.length === 0 ? (
          <p className="text-gray-600 text-center">No services found for this category in this city.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.id || service._id}
                href={`/${cityData.slug}/${categoryData.slug}/${service.slug}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl hover:scale-105 transition duration-300 transform"
              >
                {service.image && (
                  <div className="relative h-40 w-full rounded-md overflow-hidden">
                    {console.log('Service image URL:', `${API_URL}${encodeURI(service.image)}`)}
                    <Image
                      src={
                        service.image
                          ? service.image.startsWith('http')
                            ? service.image
                            : `${API_URL}${encodeURI(service.image)}`
                          : '/default-service.jpg'
                      }
                      alt={service.title}
                      fill
                      className="object-cover hover:opacity-90 transition duration-300"
                      onError={(e) => {
                        console.log('Service image load error:', `${API_URL}${encodeURI(service.image)}`);
                        e.currentTarget.src = '/default-service.jpg';
                      }}
                    />
                  </div>
                )}
                <h3
                  className="text-xl font-semibold mt-4 text-black"
                  // style={{ color: serviceTextColor }}
                >
                  {service.title}
                </h3>
                <p className="text-gray-600 mt-2">{service.sub_title || 'View details'}</p>
                <span className="inline-block mt-3 text-blue-400 hover:text-blue-500 font-medium">
                  Explore Now →
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
      
    </div>

    
  );
}