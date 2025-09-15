'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function OurServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [homeSetting, setHomeSetting] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const currentCity = pathname.split('/')[1] || 'jaipur';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesRes, categoriesRes, homeSettingRes] = await Promise.all([
          fetch(`${API_URL}/api/services`),
          fetch(`${API_URL}/api/categories`),
          fetch(`${API_URL}/api/home-setting`),
        ]);

        if (!servicesRes.ok || !categoriesRes.ok || !homeSettingRes.ok)
          throw new Error('Failed to fetch one or more resources');

        const [servicesData, categoriesData, homeSettingData] = await Promise.all([
          servicesRes.json(),
          categoriesRes.json(),
          homeSettingRes.json(),
        ]);

        console.log('Fetched service background color:', homeSettingData.service_background_color); // Debug

        const chunked = [];
        for (let i = 0; i < servicesData.length; i += 2) {
          chunked.push(servicesData.slice(i, i + 2));
        }

        setServices(chunked);
        setCategories(categoriesData.slice(0, 6));
        setHomeSetting(homeSettingData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % services.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [services]);

  if (!homeSetting || loading)
    return <div className="text-center py-16 text-gray-600">Loading...</div>;

  // Extract dynamic colors from homeSetting
  const bgColor = homeSetting.service_background_color || 'linear-gradient(to bottom right, #4B0082, #800080, #FFA500)';
  const textColor = homeSetting.service_text_color || '#ffffff';

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
      {/* 🔹 Left Section */}
      <div className="md:col-span-2">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center uppercase"
          style={{ color: homeSetting.heading_color || '#ffb84c' }}
        >
          {homeSetting.service_title || 'Our Services'}
        </h2>
        <div className="w-24 sm:w-36 h-1 bg-orange-400 mx-auto my-2 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-orange-500 px-2 py-1 text-xl sm:text-2xl">ॐ</div>
        </div>
        <h3 className="text-center text-xl sm:text-2xl font-bold text-purple-900 mt-4 mb-2">
          {homeSetting.service_subtitle || 'Personalized Astrological Guidance'}
        </h3>

        {/* 🔸 Desktop Carousel */}
        <div className="relative hidden md:block mt-8 h-[420px] overflow-hidden">
          {services.map((pair, index) => (
            <div
              key={index}
              className={`absolute w-full grid grid-cols-2 gap-6 transition-all duration-1000 ease-in-out ${
                activeSlide === index
                  ? 'opacity-100 translate-x-0'
                  : index < activeSlide
                  ? 'opacity-0 -translate-x-10 pointer-events-none'
                  : 'opacity-0 translate-x-10 pointer-events-none'
              }`}
            >
              {pair.map((item, idx) => (
                <Link
                  key={item._id || idx}
                  href={`/${item.city_slug || currentCity}/${item.category_slug || 'astrologer'}/${item.slug}`}
                  className="block rounded-lg overflow-hidden shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
                  style={{ background: bgColor, color: textColor }}
                >
                  <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-yellow-400">
                    <Image
                      src={
                        item.image && item.image !== ''
                          ? `${API_URL}${item.image}`
                          : '/AstroShyamsundar.jpg'
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-white">{item.title}</h4>
                  <p className="text-sm mb-4">{item.subtitle}</p>
                  <button className="bg-[#ffb84c] text-black font-semibold px-4 py-2 rounded-full hover:bg-orange-900 hover:text-white text-sm transition-colors duration-300">
                    Contact Us
                  </button>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* 🔹 Mobile: Stacked */}
        <div className="md:hidden mt-8 space-y-6">
          {services[activeSlide]?.map((item, idx) => (
            <Link
              key={item._id || idx}
              href={`/${item.city_slug || currentCity}/${item.category_slug || 'astrologer'}/${item.slug}`}
              className={`block rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-all duration-500 ease-in-out ${
                activeSlide === services.indexOf(services[activeSlide])
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ background: bgColor, color: textColor }}
            >
              <div className="relative w-28 h-28 mb-4 rounded-full overflow-hidden border-4 border-yellow-400">
                <Image
                  src={
                    item.image && item.image !== ''
                      ? `${API_URL}${item.image}`
                      : '/AstroShyamsundar.jpg'
                  }
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-white">{item.title}</h4>
              <p className="text-sm mb-4">{item.subtitle}</p>
              <button className="bg-[#ffb84c] text-black font-semibold px-4 py-2 rounded-full hover:bg-orange-900 hover:text-white text-sm transition-colors duration-300">
                Contact Us
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* 🔹 Right Section */}
      <div className="bg-white border rounded-xl shadow-md p-4 w-full max-w-md mx-auto md:mx-0">
        {/* 🔸 Top: Categories */}
        <div className="bg-[#ffb84c] rounded-t-xl p-3 text-center font-bold text-lg sm:text-xl">
          {homeSetting?.heading || 'Categories'}
        </div>
        <div className="space-y-2 mt-4 text-sm text-black">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/${currentCity}/${cat.slug}`}
              className="block bg-yellow-100 px-3 py-2 rounded-full shadow-sm hover:bg-yellow-200 cursor-pointer text-center transition-colors duration-300"
            >
              ✨ {cat.name}
            </Link>
          ))}
        </div>

        {/* 🔸 Bottom: Home setting info card */}
        <div className="mt-6">
          <div className="bg-black text-white rounded-lg p-4 flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-4 rounded-xl overflow-hidden">
              <Image
                src={
                  homeSetting.image && homeSetting.image !== ''
                    ? `${API_URL}${homeSetting.image}`
                    : '/AstroShyamsundar.jpg'
                }
                alt={homeSetting.title}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm">{homeSetting.subtitle}</p>
            <h4 className="text-base font-semibold mt-2">{homeSetting.title}</h4>
            <div className="text-yellow-400 font-bold mt-1 text-lg">+91-9915014230</div>
          </div>
        </div>
      </div>
    </section>
  );
}