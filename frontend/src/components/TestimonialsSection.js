'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [homeSetting, setHomeSetting] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const currentCity = pathname.split('/')[1] || 'jaipur';
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [testimonialsRes, homeSettingRes] = await Promise.all([
          axios.get(`${API}/api/testimonials`),
          axios.get(`${API}/api/home-setting`),
        ]);

        if (testimonialsRes.status !== 200) {
          throw new Error('Failed to fetch testimonials');
        }

        setTestimonials(testimonialsRes.data);
        setHomeSetting(homeSettingRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 640;

  const next = () => {
    setStartIndex((prev) => {
      if (isMobile()) {
        return prev + 1 >= testimonials.length ? 0 : prev + 1;
      }
      return prev + 2 >= testimonials.length ? 0 : prev + 2;
    });
  };

  const prev = () => {
    setStartIndex((prev) => {
      if (isMobile()) {
        return prev - 1 < 0 ? Math.max(testimonials.length - 1, 0) : prev - 1;
      }
      return prev - 2 < 0 ? Math.max(testimonials.length - 2, 0) : prev - 2;
    });
  };

  const getToday = () => {
    const now = new Date();
    return now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-12">
      <Toaster position="top-right" />

      <div className="md:w-2/3 mx-auto">
        {/* Main Heading */}
        <h2 className="text-3xl font-bold text-yellow-700 text-center">CLIENT WORDS</h2>

        <div className="w-24 h-1 bg-orange-400 mx-auto my-2"></div>

        {/* Dynamic Testimonials Title */}
        <h3
          className="text-4xl font-bold text-center mt-4 mb-2"
          style={{ color: homeSetting?.heading_color || '#000000' }}
        >
          {homeSetting?.testimonials_title || 'Testimonials'}
        </h3>

        {/* Dynamic Testimonials Description */}
        <p className="text-center text-sm text-gray-600 mb-6 max-w-xl mx-auto">
          {homeSetting?.testimonials_description ||
            'What our clients say about our services and us. Sharing their views makes it easy for others to take decisions and bring improvement in their life by taking the right decisions.'}
        </p>

        {/* Slider Container */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-all duration-500 ease-in-out"
            style={{ transform: `translateX(-${startIndex * (isMobile() ? 100 : 50)}%)` }}
          >
            {testimonials.length === 0 ? (
              <p className="text-gray-600 text-center w-full">No testimonials found.</p>
            ) : (
              testimonials.map((item, i) => (
                <div
                  key={item.id || i}
                  className="p-4 w-full md:w-1/2 flex-shrink-0"
                >
                  <Link
                    href={`/${item.city_slug || currentCity}/${item.category_slug || 'astrologer'}/${item.service_slug || 'default-service'}`}
                    className="block bg-white shadow-xl rounded-xl border-[3px] border-yellow-400 p-4 flex flex-col justify-start hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      {item.image ? (
                        <Image
                          src={`${API}${item.image}`}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-full border-2 border-white shadow-md"
                          onError={(e) => (e.target.src = '/bg-pandit.png')}
                        />
                      ) : (
                        <Image
                          src="/bg-pandit.png"
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-full border-2 border-white shadow-md"
                        />
                      )}
                      <div>
                        <div
                          className="text-base font-bold text-purple-900"
                          style={{ color: homeSetting?.heading_color || '#000000' }}
                        >
                          {item.name}
                        </div>
                        <div className="text-red-600 text-sm">{item.country}</div>
                        <div className="text-gray-500 text-xs">{item.date ? item.date.slice(0, 10) : getToday()}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 leading-snug">
                      {item.description?.replace(/<[^>]+>/g, '')}
                    </p>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        {testimonials.length > (isMobile() ? 1 : 2) && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="bg-yellow-500 px-6 py-2 rounded-full font-semibold text-purple-900 hover:bg-yellow-600 transition-colors duration-300"
            >
              Prev
            </button>
<button
  className="bg-orange-700 px-6 py-2 rounded-full font-semibold text-white hover:bg-orange-800 transition-colors duration-300"
>
  Next
</button>
          </div>
        )}
      </div>
    </section>
  );
}    