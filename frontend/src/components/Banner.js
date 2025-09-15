
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Banner({ initialData = {} }) {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    handleResize(); // Initial check
    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [handleResize]);

  // Set images based on initialData or fetch client-side
  useEffect(() => {
    if (initialData?.desktopImages?.length && initialData?.mobileImages?.length) {
      setImages(isMobile ? initialData.mobileImages : initialData.desktopImages);
      return;
    }

    const fetchBannerImages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/banner`, {
          params: { device: isMobile ? 'mobile' : 'desktop' },
        });
        const banner = res.data?.[0];
        if (!banner) {
          setImages([]);
          return;
        }

        const desktop = ['image1', 'image2', 'image3']
          .map((key) => banner[key])
          .filter(Boolean)
          .map((path) => `${API_URL}${path}`);

        const mobile = ['mob_image1', 'mob_image2', 'mob_image3']
          .map((key) => banner[key])
          .filter(Boolean)
          .map((path) => `${API_URL}${path}`);

        setImages(isMobile && mobile.length > 0 ? mobile : desktop);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setImages([]);
      }
    };

    fetchBannerImages();
  }, [isMobile, initialData]);

  // Auto-slide effect
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  // Debounce utility
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  if (images.length === 0) {
    return (
      <div className="relative w-full h-[520px] md:h-[520px] bg-gray-100 flex justify-center items-center">
        <Image
          src="/fallback-banner.webp" // Use WebP for smaller size
          alt="Fallback Banner"
          width={isMobile ? 768 : 1920}
          height={isMobile ? 432 : 520}
          className="w-full h-full object-cover"
          quality={65}
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 1920px"
        />
      </div>
    );
  }

  return (
    <>
      {/* Preconnect to API domain */}
      <link rel="preconnect" href={new URL(API_URL).origin} />
      <div className="relative w-full h-[520px] md:h-[520px] overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, idx) => (
            <div
              key={idx}
              className="w-full flex-shrink-0 flex justify-center items-center h-full"
            >
              <Image
                src={src}
                alt={`slide-${idx}`}
                width={isMobile ? 768 : 1920}
                height={isMobile ? 432 : 520}
                className="w-full h-full object-cover"
                quality={65}
                priority={idx === 0}
                fetchPriority={idx === 0 ? 'high' : 'auto'} // Prioritize LCP image
                loading={idx === 0 ? 'eager' : 'lazy'}
                unoptimized={false}
                sizes="(max-width: 768px) 100vw, 1920px"
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((current - 1 + images.length) % images.length)}
              className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 md:p-2 rounded-full hover:bg-opacity-75"
              aria-label="Previous Slide"
            >
              &#10094;
            </button>
            <button
              onClick={() => setCurrent((current + 1) % images.length)}
              className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 md:p-2 rounded-full hover:bg-opacity-75"
              aria-label="Next Slide"
            >
              &#10095;
            </button>
          </>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const res = await axios.get(`${API_URL}/api/banner`);
    const banner = res.data?.[0];
    if (!banner) return { props: {} };

    const desktopImages = ['image1', 'image2', 'image3']
      .map((key) => banner[key])
      .filter(Boolean)
      .map((path) => `${API_URL}${path}`);

    const mobileImages = ['mob_image1', 'mob_image2', 'mob_image3']
      .map((key) => banner[key])
      .filter(Boolean)
      .map((path) => `${API_URL}${path}`);

    return {
      props: {
        initialData: {
          desktopImages,
          mobileImages: mobileImages.length > 0 ? mobileImages : desktopImages,
        },
      },
    };
  } catch (err) {
    console.error('Error fetching banners server-side:', err);
    return { props: {} };
  }
}
