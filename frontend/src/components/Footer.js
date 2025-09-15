'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { IoLogoWhatsapp } from 'react-icons/io';
import { BsFillTelephoneFill } from 'react-icons/bs';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function BestSolutionSection() {
  const [homeSetting, setHomeSetting] = useState(null);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [solution, setSolution] = useState({ title: '', subtitle: '', note: '', image: '' });
  const [loading, setLoading] = useState(false);
  const [solutionLoading, setSolutionLoading] = useState(true);
  const [solutionError, setSolutionError] = useState(null);
  const pathname = usePathname();

  // Extract current city from URL (e.g., '/jaipur/healthcare' -> 'jaipur')
  const currentCity = pathname.split('/')[1] || 'jaipur'; // Fallback to 'jaipur'

  // Fetch data
  useEffect(() => {
    const fetchHomeSetting = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/home-setting`);
        console.log('Fetched home setting:', res.data);
        console.log('Footer background color:', res.data.footer_background_color); // Debug
        console.log('Footer heading color:', res.data.footer_heading); // Debug
        console.log('Footer text color:', res.data.footer_text_color); // Debug
        setHomeSetting(res.data);
      } catch (err) {
        console.error('Error fetching home setting:', err);
        setHomeSetting(null);
        toast.error(`Failed to fetch home settings: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const fetchSolution = async () => {
      setSolutionLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/best_solution`);
        console.log('Fetched solutions:', res.data); // Debug
        if (res.data && res.data.length > 0) {
          setSolution({
            title: res.data[0].title || 'Talk To Astrologer And Will Get Your Solutions',
            subtitle: res.data[0].subtitle || 'We Will Transform Your Life\nAnd Give You The Best Solution.',
            note: res.data[0].note || 'Beware of fake names and websites. We do not have any other branch, website, or contact numbers.\nWe will not be responsible for any fraudulent activity done by any third party.',
            image: res.data[0].image || '/bg-soln.jpg',
          });
        } else {
          setSolutionError('No solutions found');
          toast.error('No solutions found');
        }
      } catch (err) {
        console.error('Error fetching solution:', err);
        setSolutionError('Failed to fetch solution');
        toast.error(`Failed to fetch solution: ${err.message}`);
      } finally {
        setSolutionLoading(false);
      }
    };

    const fetchCities = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/cities`, { cache: 'no-store' });
        console.log('Fetched cities:', res.data);
        setCities(res.data.slice(0, 8)); // Limit to 8 cities
      } catch (err) {
        console.error('Error fetching cities:', err);
        setCities([]);
        toast.error(`Failed to fetch cities: ${err.message}`);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`, { cache: 'no-store' });
        console.log('Fetched categories:', res.data);
        setCategories(res.data.slice(0, 8)); // Limit to 8 categories
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
        toast.error(`Failed to fetch categories: ${err.message}`);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/services`, { cache: 'no-store' });
        console.log('Fetched services:', res.data);
        setServices(res.data.slice(0, 8)); // Limit to 8 services
      } catch (err) {
        console.error('Error fetching services:', err);
        setServices([]);
        toast.error(`Failed to fetch services: ${err.message}`);
      }
    };

    fetchHomeSetting();
    fetchSolution();
    fetchCities();
    fetchCategories();
    fetchServices();
  }, []);

  // Define Quick Links with specified structure
  const quickLinks = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { name: 'BLOGS', href: '/blog' },
    { name: 'CONTACT US', href: '/contact' },
  ];

  return (
    <>
      <section className="relative w-full text-white overflow-hidden mt-20">
        {/* 🔹 Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={solution.image ? `${API_URL}${solution.image}` : '/bg-soln.jpg'}
            alt="Background"
            fill
            className="object-cover object-center"
            onError={(e) => {
              console.error('Error loading background image:', solution.image);
              e.target.src = '/bg-soln.jpg'; // Fallback
            }}
          />
          {/* Optional dark overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* 🔹 Main Content */}
        <div className="max-w-[1400px] mx-auto relative z-10 text-center px-4 py-16 md:py-28">
          {solutionLoading ? (
            <p className="text-yellow-400 font-semibold mb-3 text-sm sm:text-base">
              Loading...
            </p>
          ) : solutionError ? (
            <p className="text-red-400 font-semibold mb-3 text-sm sm:text-base">
              Error: {solutionError}
            </p>
          ) : (
            <>
              <p className="text-yellow-400 font-semibold mb-3 text-sm sm:text-base">
                {solution.title}
              </p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
                <span className="text-white">{solution.subtitle}</span>
              </h2>
            </>
          )}

          {/* 🔹 Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <a
              href={`https://wa.me/${homeSetting?.phone ? homeSetting.phone.replace(/^\+/, '') : '917048202004'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-b from-yellow-300 to-orange-600 px-6 py-3 rounded-sm text-black font-bold hover:scale-105 transition w-full sm:w-auto"
            >
              CHAT NOW
            </a>
            <a
              href={`tel:${homeSetting?.phone || '+917048202004'}`}
              className="bg-gradient-to-b from-yellow-300 to-orange-600 px-6 py-3 rounded-sm text-black font-bold hover:scale-105 transition w-full sm:w-auto"
            >
              CONTACT NOW
            </a>
          </div>
        </div>

        {/* 🔹 Note Section */}
        <div className="relative z-10 bg-gradient-to-br from-yellow-300 via-orange-100 to-yellow-200 py-10 px-4 mt-[-2px]">
          <div className="max-w-[1400px] mx-auto bg-white/30 border border-yellow-500 p-6 sm:p-8 rounded-md">
            <h3 className="text-purple-900 text-xl sm:text-2xl font-extrabold mb-2 flex items-center gap-2">
              <span className="text-pink-700 text-2xl sm:text-3xl">☀️</span> Note:
            </h3>
            {solutionLoading ? (
              <p className="text-black text-sm sm:text-base font-semibold leading-relaxed">
                Loading note...
              </p>
            ) : solutionError ? (
              <p className="text-red-600 text-sm sm:text-base font-semibold leading-relaxed">
                Error loading note
              </p>
            ) : (
              <p className="text-black text-sm sm:text-base font-semibold leading-relaxed">
                {solution.note}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 🔹 Footer Section */}
      <footer
        className="pt-16 pb-10 relative z-10 border-t border-[#ddd] text-[18px]"
        style={{
          background: homeSetting?.footer_background_color || '#f9f1e8',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {/* 🔹 Logo & About + Contact Information */}
          <div>
            <Image
              src={homeSetting?.logo && homeSetting.logo !== '' ? `${API_URL}${homeSetting.logo}` : '/logo1.webp'}
              alt="Logo"
              width={220}
              height={134}
              className="mb-6"
              onError={(e) => {
                console.error('Error loading footer logo:', homeSetting?.logo);
                e.target.src = '/logo1.webp'; // Fallback on error
              }}
            />
            <p
              className="leading-8 text-[18px]"
              style={{ color: homeSetting?.footer_text_color || '#2e1c24' }}
            >
              {loading ? 'Loading...' : homeSetting?.subtitle || 'Welcome to Astro Shyamsundar, where you can resolve life’s challenges with a renowned astrologer’s years of expertise in Jyotish Shastra.'}
            </p>
<div className="flex gap-4 mt-6">
  {[
    { Icon: FaInstagram, label: 'Instagram', url: homeSetting?.instagram_link || '#' },
    { Icon: FaFacebookF, label: 'Facebook', url: homeSetting?.facebook_link || '#' },
    { Icon: FaYoutube, label: 'YouTube', url: homeSetting?.youtube_link || '#' }
  ].map(({ Icon, label, url }, i) => (
    <a
      key={i}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-full border border-[#7d0a1e] hover:bg-[#7d0a1e] transition"
      aria-label={`Visit our ${label}`}
    >
      <Icon className="text-[#7d0a1e] hover:text-white text-xl" />
    </a>
  ))}
</div>

            <div className="mt-8">
              <h3
                className="font-semibold text-2xl mb-5"
                style={{ color: homeSetting?.footer_heading || '#7d0a1e' }}
              >
                Contact Information
              </h3>
              <ul className="space-y-6 text-[18px]">
                <li className="flex items-start gap-4">
                  <FaMapMarkerAlt className="mt-1 text-[#7d0a1e]" />
                  <span style={{ color: homeSetting?.footer_text_color || '#2e1c24' }}>
                    {loading ? 'Loading...' : homeSetting?.address || '50, Ambika Society, opp. Nishan school, Nr. Balolnager Nagar Circle, Ranip, Ahmedabad.'}
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <FaPhoneAlt className="text-[#7d0a1e]" />
                  <a
                    href={`tel:${homeSetting?.phone || '+917048202004'}`}
                    className="hover:text-[#7d0a1e]"
                    style={{ color: homeSetting?.footer_text_color || '#2e1c24' }}
                  >
                    {loading ? 'Loading...' : homeSetting?.phone || '+91 70482 02004'}
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <FaEnvelope className="text-[#7d0a1e]" />
                  <a
                    href={`mailto:${homeSetting?.email || 'astroshyamjoshi@gmail.com'}`}
                    className="hover:text-[#7d0a1e]"
                    style={{ color: homeSetting?.footer_text_color || '#2e1c24' }}
                  >
                    {loading ? 'Loading...' : homeSetting?.email || 'astroshyamjoshi@gmail.com'}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 🔹 Quick Links */}
          <div>
            <h3
              className="font-semibold text-3xl mb-5"
              style={{ color: homeSetting?.footer_heading || '#7d0a1e' }}
            >
              Quick Links
            </h3>
            <ul className="space-y-4 text-[18px]">
              {quickLinks.map(({ name, href }, i) => (
                <li key={i} className="hover:text-[#7d0a1e] transition">
                  <Link
                    href={href}
                    className="block"
                    style={{ color: homeSetting?.footer_text_color || '#2e1c24' }}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 🔹 Services */}
          <div>
            <h3
              className="font-semibold text-3xl mb-5"
              style={{ color: homeSetting?.footer_heading || '#7d0a1e' }}
            >
              Highlight Services
            </h3>
            <ul className="space-y-4 text-[18px]">
              {services.length > 0 ? (
                services.map((service, i) => (
                  <li key={i} className="hover:text-[#7d0a1e] transition">
                    <Link
                      href={`/${service.city_slug || 'jaipur'}/${service.category_slug || 'astrologer'}/${service.slug}`}
                      className="block"
                      style={{ color: homeSetting?.footer_text_color || '#2e1c24' }}
                    >
                      {service.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li style={{ color: homeSetting?.footer_text_color || '#2e1c24' }}>
                  Loading...
                </li>
              )}
            </ul>
          </div>

          {/* 🔹 Astrology Category */}
          <div>
            <h3
              className="font-semibold text-3xl mb-5"
              style={{ color: homeSetting?.footer_heading || '#7d0a1e' }}
            >
              Category
            </h3>
            <ul className="space-y-4 text-[18px]">
              {categories.length > 0 ? (
                categories.map((category, i) => (
                  <li key={i} className="hover:text-[#7d0a1e] transition">
                    <Link
                      href={`/${currentCity}/${category.slug}`}
                      className="block"
                      style={{ color: homeSetting?.footer_text_color || '#2e1c24' }}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li style={{ color: homeSetting?.footer_text_color || '#2e1c24' }}>
                  Loading...
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* 🔹 Bottom Footer */}
        <div
          className="text-center text-[18px] py-6 mt-12 border-t border-gray-300"
          style={{ color: homeSetting?.footer_text_color || '#2e1c24' }}
        >
          {loading ? (
            <p>Loading...</p>
          ) : homeSetting?.web_info ? (
            <div dangerouslySetInnerHTML={{ __html: homeSetting.web_info }} />
          ) : (
            <p>{new Date().getFullYear()} <strong>Astro Shyamsundar</strong></p>
          )}
        </div>

        {/* 🔹 Floating WhatsApp & Call */}
        <div
          className="fixed bottom-5 right-5 flex flex-col gap-3 z-50 w-[60px]"
          style={{ minHeight: '130px' }} // Ensure enough space
        >
          <a
            href={`https://wa.me/${homeSetting?.phone?.replace(/^\+/, '') || '917048202004'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25d366] w-[60px] h-[60px] flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition"
            aria-label="Chat on WhatsApp"
          >
            <IoLogoWhatsapp className="text-white" style={{ fontSize: '28px' }} />
          </a>
          <a
            href={`tel:${homeSetting?.phone || '+917048202004'}`}
            className="bg-black w-[60px] h-[60px] flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition"
            aria-label="Call Now"
          >
            <BsFillTelephoneFill className="text-white" style={{ fontSize: '26px' }} />
          </a>
        </div>
      </footer>
    </>
  );
}