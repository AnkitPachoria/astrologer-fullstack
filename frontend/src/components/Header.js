'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const [openMain, setOpenMain] = useState(null);
  const [openSub, setOpenSub] = useState(null);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [categoryToServices, setCategoryToServices] = useState({});
  const [homeSetting, setHomeSetting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    dob: '',
    otherRequest: '',
    confirmDetails: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const pathname = usePathname();
  const navRef = useRef(null);

  // Default gradient in case API fails or returns invalid gradient
  const defaultGradient = 'linear-gradient(90deg, #3056b0 0%, #631abd 50%, #000000 100%)';

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine current city, defaulting to 'jaipur' if not a valid city
  const currentCity = useCallback(() => {
    const firstSegment = pathname.split('/')[1];
    const isValidCity = cities.some(city => city.slug === firstSegment && city.status === 1);
    const validCity = isValidCity ? firstSegment : 'jaipur';
    console.log('Current city:', validCity, 'First segment:', firstSegment);
    return validCity;
  }, [pathname, cities])();

  const toggleDropdown = (item) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const fetchHomeSetting = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/home-setting`);
      console.log('Fetched home setting:', res.data);
      // Validate gradient string
      const gradient = res.data.navbar_background_color && res.data.navbar_background_color.includes('linear-gradient')
        ? res.data.navbar_background_color
        : defaultGradient;
      setHomeSetting({
        ...res.data,
        phone: res.data.phone || '+91-7425021519',
        email: res.data.email || 'loveastrosolutions@gmail.com',
        title: res.data.title || "INDIA'S BEST CELEBRITY ASTROLOGER",
        navbar_title: res.data.navbar_title || 'Happiness Can Come Again In Your Life',
        confidence: res.data.confidence || '100% Confidential',
        logo: res.data.logo || '',
        instagram_link: res.data.instagram_link || '#',
        facebook_link: res.data.facebook_link || '#',
        youtube_link: res.data.youtube_link || '#',
        icon_image: res.data.icon_image || '',
        navbar_background_color: gradient,
      });
    } catch (err) {
      console.error('Error fetching home setting:', err);
      setHomeSetting({
        phone: '+91-7425021519',
        email: 'loveastrosolutions@gmail.com',
        title: "INDIA'S BEST CELEBRITY ASTROLOGER",
        navbar_title: 'Happiness Can Come Again In Your Life',
        confidence: '100% Confidential',
        logo: '',
        instagram_link: '#',
        facebook_link: '#',
        youtube_link: '#',
        icon_image: '',
        navbar_background_color: defaultGradient,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCities = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/cities`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch cities');
      const data = await res.json();
      console.log('Fetched cities:', data);
      // Filter cities with status === 1
      const activeCities = data.filter(city => city.status === 1);
      setCities(activeCities.slice(0, 8));
    } catch (err) {
      console.error('Error fetching cities:', err);
      setCities([]);
    }
  }, []);  

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      console.log('Fetched categories:', data);
      // Filter categories with status === 1
      const activeCategories = data.filter(category => category.status === 1);
      setCategories(activeCategories.slice(0, 8));
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/services`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      console.log('Fetched services:', data);
      // Filter services with status === 1 (no slice, fetch all for dynamic submenus)
      const activeServices = data.filter(service => service.status === 1);
      setServices(activeServices);

      // Group services by category_slug
      const catToServ = {};
      activeServices.forEach(service => {
        const catSlug = service.category_slug;
        if (catSlug) {
          if (!catToServ[catSlug]) catToServ[catSlug] = [];
          catToServ[catSlug].push(service);
        }
      });
      setCategoryToServices(catToServ);
    } catch (err) {
      console.error('Error fetching services:', err);
      setServices([]);
      setCategoryToServices({});
    }
  }, []);

  useEffect(() => {
    fetchHomeSetting();
    fetchCities();
    fetchCategories();
    fetchServices();
  }, [fetchHomeSetting, fetchCities, fetchCategories, fetchServices]);

  const dropdowns = {
    'OUR SERVICES': services.slice(0, 10).map((service) => ({
      name: service.title,
      href: `/${service.city_slug || currentCity}/${service.category_slug || 'astrologer'}/${service.slug}`,
      submenu: null, // No further submenus for services
    })),
    'CITIES': cities.map((city) => ({
      name: city.name,
      href: `/${city.slug}`,
      submenu: null,
    })),
    'CATEGORIES': categories.map((category) => ({
      name: category.name,
      href: `/${currentCity}/${category.slug}`,
      submenu: categoryToServices[category.slug] ? categoryToServices[category.slug].map((s) => ({
        name: s.title,
        href: `/${s.city_slug || currentCity}/${category.slug}/${s.slug}`,
      })) : [],
    })),
  };

  const navItems = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT US', href: '/about' },
    { name: 'CITIES', href: '#', dropdown: dropdowns['CITIES'] },
    { name: 'ASTEOLOGY SERVICES', href: '#', dropdown: dropdowns['CATEGORIES'] },
    { name: 'TOP SERVICES', href: '#', dropdown: dropdowns['OUR SERVICES'] },
    { name: 'BLOGS', href: '/blog' },
    { name: 'CONTACT US', href: '/contact' },
  ];

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.contact.trim()) {
      errors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact)) {
      errors.contact = 'Contact number must be 10 digits';
    }
    if (!formData.dob) errors.dob = 'Date of birth is required';
    if (!formData.confirmDetails) errors.confirmDetails = 'You must confirm the details';
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/appointments`, formData);
      if (response.status === 201) {
        toast.success('Appointment submitted successfully!');
        setFormData({
          name: '',
          email: '',
          contact: '',
          dob: '',
          otherRequest: '',
          confirmDetails: false,
        });
        setFormErrors({});
        setIsPopupOpen(false);
      } else {
        throw new Error('Failed to submit appointment');
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleFormReset = () => {
    setFormData({
      name: '',
      email: '',
      contact: '',
      dob: '',
      otherRequest: '',
      confirmDetails: false,
    });
    setFormErrors({});
  };

  return (
    <header className="w-full font-sans relative z-50">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      {/* 🔹 Top Contact Bar */}
      <div
        className="text-white text-sm"
        style={{ background: homeSetting?.navbar_background_color || defaultGradient }}
      >
        <div className="max-w-[1400px] mx-auto flex justify-between items-center px-6 py-3">
          <div className="flex items-center space-x-8">
            {isMobile ? (
              <>
               <div className="flex items-center gap-2">
  <Link href={`tel:${homeSetting?.phone || '+91-7425021519'}`} className="flex items-center">
    <FaPhoneAlt className="text-yellow-400" />
    <span className="sr-only">Call us</span> {/* This is screen-reader only text */}
  </Link>
</div>

<div className="flex items-center gap-2">
  <Link href={`mailto:${homeSetting?.email || 'loveastrosolutions@gmail.com'}`} className="flex items-center">
    <FaEnvelope className="text-yellow-400" />
    <span className="sr-only">Email us</span>
  </Link>
</div>

              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <FaPhoneAlt className="text-yellow-400" />
                  <Link href={`tel:${homeSetting?.phone || '+91-7425021519'}`} className="hover:text-yellow-400 transition">
                    <span>{loading ? 'Loading...' : homeSetting?.phone || '+91-7425021519'}</span>
                  </Link>
                </div>
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="text-yellow-400" />
                  <Link href={`mailto:${homeSetting?.email || 'loveastrosolutions@gmail.com'}`} className="hover:text-yellow-400 transition">
                    <span>{loading ? 'Loading...' : homeSetting?.email || 'loveastrosolutions@gmail.com'}</span>
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <span className="text-yellow-300 font-semibold drop-shadow">
              {loading ? 'Loading...' : homeSetting?.title || "INDIA'S BEST CELEBRITY ASTROLOGER"}
            </span>
            <div className="flex space-x-5 text-lg">
              <Link href={homeSetting?.instagram_link || '#'} className="hover:text-pink-500">
                <FaInstagram />
              </Link>
              <Link href={homeSetting?.facebook_link || '#'} className="hover:text-blue-500">
                <FaFacebookF />
              </Link>
              <Link href={homeSetting?.youtube_link || '#'} className="hover:text-red-500">
                <FaYoutube />
              </Link>
            </div>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="ml-4 bg-yellow-400 text-black px-4 py-1.5 rounded font-bold text-sm hover:bg-yellow-500 transition"
            >
              Book Now
            </button>
          </div>
          <div className="md:hidden ml-auto">
            <button onClick={() => setMenuOpen(true)} aria-label="Open Menu">
              <FaBars className="cursor-pointer text-2xl text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Popup Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-purple-900">Book an Appointment</h2>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-red-500 hover:text-red-700"
                aria-label="Close Popup"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your name"
                  required
                />
                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your email"
                  required
                />
                {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your contact number"
                  required
                />
                {formErrors.contact && <p className="text-red-500 text-sm">{formErrors.contact}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
                {formErrors.dob && <p className="text-red-500 text-sm">{formErrors.dob}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Other Requests</label>
                <textarea
                  name="otherRequest"
                  value={formData.otherRequest}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Any additional requests"
                  rows="4"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="confirmDetails"
                    checked={formData.confirmDetails}
                    onChange={handleFormChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  Confirm details meet requirements
                </label>
                {formErrors.confirmDetails && (
                  <p className="text-red-500 text-sm">{formErrors.confirmDetails}</p>
                )}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleFormReset}
                  className="bg-gray-500 text-white px-4 py-2 rounded font-semibold hover:bg-gray-600 transition"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded font-semibold hover:bg-purple-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 Main Header Section */}
      <div className="bg-white py-4">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-64 cursor-pointer">
              <Link href="/" aria-label="Home">
                <Image
                  src={homeSetting?.logo && homeSetting.logo !== '' ? `${API_URL}${homeSetting.logo}` : '/logo1.webp'}
                  alt="Logo"
                  width={256}
                  height={156}
                  onError={(e) => {
                    console.error('Error loading logo:', homeSetting?.logo);
                    e.target.src = '/logo1.webp';
                  }}
                />
              </Link>
            </div>
          </div>

          <div className="text-center hidden md:block">
            {/* <p className="text-xl font-bold text-purple-800">&quot;Don&apos;t Lose Hope&quot;</p> */}
            <p className="text-purple-600 font-semibold text-lg">
              {loading ? 'Loading...' : homeSetting?.navbar_title || 'Happiness Can Come Again In Your Life'}
            </p>
            <div className="inline-block mt-2 px-4 py-2 border border-yellow-400 text-purple-900 font-bold rounded-full">
              {loading ? 'Loading...' : homeSetting?.confidence || '100% Confidential'}
            </div>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-6">
            {homeSetting?.icon_image ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                  <Image
                    src={`${API_URL}${homeSetting.icon_image}`}
                    alt="Icon Image"
                    width={96}
                    height={96}
                    onError={(e) => {
                      console.error('Error loading icon image:', homeSetting?.icon_image);
                      e.target.src = '/icon-placeholder.png';
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* 🔹 Desktop Navbar */}
      <nav
        ref={navRef}
        className="p-2 text-white hidden lg:flex w-[1100px] mx-auto rounded-[35px] mb-[-30px]"
        style={{ background: homeSetting?.navbar_background_color || defaultGradient }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-center px-6 py-3 space-x-8 text-sm sm:text-base font-medium relative">
          {navItems.map(({ name, href, dropdown }, idx) => (
            <div key={idx} className="relative">
              {dropdown ? (
                <div className="relative">
                  <div className="group inline-block">
                    <Link
                      href={href}
                      className="relative flex items-center gap-1 cursor-pointer hover:text-yellow-400 transition-all duration-300"
                      onMouseEnter={() => setOpenMain(idx)}
                      onMouseLeave={() => setOpenMain(null)}
                    >
                      <span>{name}</span>
                      <span className="text-xs">▼</span>
                    </Link>

                    <div
                      className={`absolute top-full left-0 bg-white text-purple-900 rounded-md shadow-lg mt-2 transition-all duration-200 min-w-[200px] z-50 ${
                        openMain === idx ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
                      }`}
                      onMouseEnter={() => setOpenMain(idx)}
                      onMouseLeave={() => {
                        setOpenMain(null);
                        setOpenSub(null);
                      }}
                    >
                      <ul className="flex flex-col py-2">
                        {dropdown.map((item, subIdx) => (
                          <li key={subIdx} className="relative group">
                            <Link
                              href={item.href}
                              className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-900 transition"
                              onMouseEnter={() => setOpenSub(subIdx)}
                              onMouseLeave={() => setOpenSub(null)}
                            >
                              {item.name}
                            </Link>
                            {item.submenu && item.submenu.length > 0 && (
                              <div
                                className={`absolute top-0 left-full bg-white text-purple-900 rounded-md shadow-lg ml-2 transition-all duration-200 min-w-[200px] z-50 ${
                                  openSub === subIdx ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
                                }`}
                                onMouseEnter={() => setOpenSub(subIdx)}
                                onMouseLeave={() => setOpenSub(null)}
                              >
                                <ul className="flex flex-col py-2">
                                  {item.submenu.map((subItem, subSubIdx) => (
                                    <li key={subSubIdx}>
                                      <Link
                                        href={subItem.href}
                                        className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-900 transition"
                                      >
                                        {subItem.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={href}
                  className="hover:text-yellow-400 transition cursor-pointer"
                >
                  {name}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* 🔹 Mobile Slide-in Menu */}
      <div
        className={`fixed overflow-scroll top-0 left-0 w-72 h-full z-50 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } text-white shadow-2xl rounded-r-2xl backdrop-blur-sm`}
        style={{ background: homeSetting?.navbar_background_color || defaultGradient }}
      >
        <div className="flex justify-between items-center p-3 border-b border-purple-700">
          <div className="bg-white/80 p-2 rounded-xl shadow-md w-50">
            <Link href="/" aria-label="Home">
              <Image
                src={homeSetting?.logo && homeSetting.logo !== '' ? `${API_URL}${homeSetting.logo}` : '/logo.png'}
                alt="Logo"
                width={200}
                height={100}
                className="rounded-lg"
                onError={(e) => {
                  console.error('Error loading mobile logo:', homeSetting?.logo);
                  e.target.src = '/logo.png';
                }}
              />
            </Link>
          </div>
          <button onClick={() => setMenuOpen(false)} aria-label="Close Menu">
            <FaTimes className="text-2xl text-red-400 hover:text-red-600 transition" />
          </button>
        </div>

        <ul className="flex flex-col px-4 py-6 font-medium space-y-3 text-sm">
          {navItems.map(({ name, href, dropdown }, idx) => (
            <li key={idx} className="group">
              {dropdown ? (
                <>
                  <button
                    onClick={() => toggleDropdown(name)}
                    className="flex justify-between items-center w-full text-left text-white hover:text-yellow-300 transition"
                  >
                    <span>{name}</span>
                    {mobileDropdowns[name] ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      mobileDropdowns[name] ? 'max-h-96 mt-2' : 'max-h-0'
                    }`}
                  >
                    <ul className="pl-3 py-2 bg-white/10 rounded-lg backdrop-blur-sm shadow-inner space-y-2 text-purple-100">
                      {dropdown.map((item, subIdx) => (
                        <li key={subIdx}>
                          {item.submenu && item.submenu.length > 0 ? (
                            <>
                              <button
                                onClick={() => toggleDropdown(item.name)}
                                className="flex justify-between items-center w-full text-left text-purple-100 hover:text-yellow-300 transition"
                              >
                                <span>{item.name}</span>
                                {mobileDropdowns[item.name] ? <FaChevronUp /> : <FaChevronDown />}
                              </button>
                              <div
                                className={`overflow-hidden transition-all duration-300 ${
                                  mobileDropdowns[item.name] ? 'max-h-96 mt-2' : 'max-h-0'
                                }`}
                              >
                                <ul className="pl-6 py-2 bg-white/20 rounded-lg backdrop-blur-sm shadow-inner space-y-2 text-purple-100">
                                  {item.submenu.map((subItem, subSubIdx) => (
                                    <li key={subSubIdx}>
                                      <Link
                                        href={subItem.href}
                                        className="block py-1 px-2 hover:bg-yellow-400/20 rounded transition"
                                        onClick={() => setMenuOpen(false)}
                                      >
                                        {subItem.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          ) : (
                            <Link
                              href={item.href}
                              className="block py-1 px-2 hover:bg-yellow-400/20 rounded transition"
                              onClick={() => setMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link
                  href={href}
                  className="block hover:text-yellow-300 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}







































// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import {
//   FaPhoneAlt,
//   FaEnvelope,
//   FaInstagram,
//   FaFacebookF,
//   FaYoutube,
//   FaBars,
//   FaTimes,
//   FaChevronDown,
//   FaChevronUp,
// } from 'react-icons/fa';
// import axios from 'axios';
// import { Toaster, toast } from 'react-hot-toast';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [mobileDropdowns, setMobileDropdowns] = useState({});
//   const [cities, setCities] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [services, setServices] = useState([]);
//   const [menus, setMenus] = useState([]);
//   const [homeSetting, setHomeSetting] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     contact: '',
//     dob: '',
//     otherRequest: '',
//     confirmDetails: false,
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const pathname = usePathname();

//   const defaultGradient = 'linear-gradient(90deg, #3056b0 0%, #631abd 50%, #000000 100%)';

//   // Detect mobile view
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Determine current city
//   const currentCity = useCallback(() => {
//     const firstSegment = pathname.split('/')[1];
//     const isValidCity = cities.some(city => city.slug === firstSegment && city.status === 1);
//     const validCity = isValidCity ? firstSegment : 'jaipur';
//     console.log('Current city:', validCity, 'First segment:', firstSegment, 'Cities:', cities);
//     return validCity;
//   }, [pathname, cities])();

//   // Toggle dropdown for mobile menu
//   const toggleDropdown = (item) => {
//     setMobileDropdowns((prev) => ({
//       ...prev,
//       [item]: !prev[item],
//     }));
//   };

//   // Fetch home settings
//   const fetchHomeSetting = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_URL}/api/home-setting`);
//       console.log('Fetched home setting:', res.data);
//       const gradient = res.data.navbar_background_color && res.data.navbar_background_color.includes('linear-gradient')
//         ? res.data.navbar_background_color
//         : defaultGradient;
//       setHomeSetting({
//         ...res.data,
//         phone: res.data.phone || '+91-7425021519',
//         email: res.data.email || 'loveastrosolutions@gmail.com',
//         navbar_background_color: gradient,
//       });
//     } catch (err) {
//       console.error('Error fetching home setting:', err);
//       toast.error('Error fetching home settings');
//       setHomeSetting({
//         phone: '+91-7425021519',
//         email: 'loveastrosolutions@gmail.com',
//         title: "INDIA'S BEST CELEBRITY ASTROLOGER",
//         logo: '',
//         instagram_link: '#',
//         facebook_link: '#',
//         youtube_link: '#',
//         icon_image: '',
//         navbar_background_color: defaultGradient,
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch cities
//   const fetchCities = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/cities`, { cache: 'no-store' });
//       if (!res.ok) throw new Error(`Failed to fetch cities: ${res.status} ${res.statusText}`);
//       const data = await res.json();
//       console.log('Fetched cities:', data);
//       const activeCities = data.filter(city => city.status === 1);
//       setCities(activeCities.slice(0, 8));
//     } catch (err) {
//       console.error('Error fetching cities:', err);
//       toast.error('Error fetching cities');
//       setCities([]);
//     }
//   }, []);

//   // Fetch categories
//   const fetchCategories = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/categories`, { cache: 'no-store' });
//       if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
//       const data = await res.json();
//       console.log('Fetched categories:', data);
//       const activeCategories = data.filter(category => category.status === 1);
//       setCategories(activeCategories.slice(0, 8));
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//       toast.error('Error fetching categories');
//       setCategories([]);
//     }
//   }, []);

//   // Fetch services
//   const fetchServices = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/services`, { cache: 'no-store' });
//       if (!res.ok) throw new Error(`Failed to fetch services: ${res.status} ${res.statusText}`);
//       const data = await res.json();
//       console.log('Fetched services:', data);
//       const activeServices = data.filter(service => service.status === 1);
//       setServices(activeServices.slice(0, 8));
//     } catch (err) {
//       console.error('Error fetching services:', err);
//       toast.error('Error fetching services');
//       setServices([]);
//     }
//   }, []);

//   // Fetch menus
//   const fetchMenus = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/menu`, { cache: 'no-store' });
//       if (!res.ok) throw new Error(`Failed to fetch menus: ${res.status} ${res.statusText}`);
//       const data = await res.json();
//       console.log('Fetched menus:', data);
//       setMenus(data.map(menu => ({
//         ...menu,
//         name: menu.name.trim().toUpperCase(),
//       })));
//     } catch (err) {
//       console.error('Error fetching menus:', err);
//       toast.error('Error fetching menus');
//       setMenus([]);
//     }
//   }, []);

//   // Fetch all data on mount
//   useEffect(() => {
//     fetchHomeSetting();
//     fetchCities();
//     fetchCategories();
//     fetchServices();
//     fetchMenus();
//   }, [fetchHomeSetting, fetchCities, fetchCategories, fetchServices, fetchMenus]);

//   // Define dropdowns dynamically
//   const dropdowns = {
//     'CITIES': cities.length > 0 ? cities.map((city) => ({
//       name: city.name,
//       href: `/${city.slug}`,
//     })) : [],
//     'CATEGORIES': categories.length > 0 ? categories.map((category) => ({
//       name: category.name,
//       href: `/${currentCity}/${category.slug}`,
//     })) : [],
//     'OUR SERVICES': services.length > 0 ? services.map((service) => ({
//       name: service.title,
//       href: `/${service.city_slug || currentCity}/${service.category_slug || 'astrologer'}/${service.slug}`,
//     })) : [],
//   };

//   // Map menu items to navItems dynamically
//   const getHref = (name) => {
//     const normalizedName = name.trim().toUpperCase();
//     switch (normalizedName) {
//       case 'HOME':
//         return '/';
//       case 'ABOUT US':
//         return '/about';
//       case 'BLOGS':
//         return '/blog';
//       case 'CONTACT US':
//         return '/contact';
//       case 'CITIES':
//       case 'CATEGORIES':
//       case 'OUR SERVICES':
//         return '#';
//       default:
//         return '/';
//     }
//   };

//   // Dynamic navItems from fetched menus
//   const navItems = menus.length > 0
//     ? menus.map((menu) => ({
//         name: menu.name,
//         href: getHref(menu.name),
//         dropdown: dropdowns[menu.name],
//       }))
//     : [
//         { name: 'HOME', href: '/', dropdown: null },
//         { name: 'ABOUT US', href: '/about', dropdown: null },
//         { name: 'CITIES', href: '#', dropdown: dropdowns['CITIES'] },
//         { name: 'CATEGORIES', href: '#', dropdown: dropdowns['CATEGORIES'] },
//         { name: 'OUR SERVICES', href: '#', dropdown: dropdowns['OUR SERVICES'] },
//         { name: 'BLOGS', href: '/blog', dropdown: null },
//         { name: 'CONTACT US', href: '/contact', dropdown: null },
//       ];

//   // Log for debugging
//   console.log('API_URL:', API_URL);
//   console.log('Menus:', menus);
//   console.log('NavItems:', navItems);
//   console.log('Cities:', cities);
//   console.log('Categories:', categories);
//   console.log('Services:', services);

//   // Form handling
//   const handleFormChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//     setFormErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!formData.name.trim()) errors.name = 'Name is required';
//     if (!formData.email.trim()) {
//       errors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       errors.email = 'Invalid email format';
//     }
//     if (!formData.contact.trim()) {
//       errors.contact = 'Contact number is required';
//     } else if (!/^\d{10}$/.test(formData.contact)) {
//       errors.contact = 'Contact number must be 10 digits';
//     }
//     if (!formData.dob) errors.dob = 'Date of birth is required';
//     if (!formData.confirmDetails) errors.confirmDetails = 'You must confirm the details';
//     return errors;
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       toast.error('Please fill in all required fields correctly');
//       return;
//     }

//     try {
//       const response = await axios.post(`${API_URL}/api/appointments`, formData);
//       if (response.status === 201) {
//         toast.success('Appointment submitted successfully!');
//         setFormData({
//           name: '',
//           email: '',
//           contact: '',
//           dob: '',
//           otherRequest: '',
//           confirmDetails: false,
//         });
//         setFormErrors({});
//         setIsPopupOpen(false);
//       } else {
//         throw new Error('Failed to submit appointment');
//       }
//     } catch (error) {
//       toast.error(`Error: ${error.response?.data?.error || error.message}`);
//     }
//   };

//   const handleFormReset = () => {
//     setFormData({
//       name: '',
//       email: '',
//       contact: '',
//       dob: '',
//       otherRequest: '',
//       confirmDetails: false,
//     });
//     setFormErrors({});
//   };

//   return (
//     <header className="w-full font-sans relative z-50">
//       <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
//       <div
//         className="text-white text-sm"
//         style={{ background: homeSetting?.navbar_background_color || defaultGradient }}
//       >
//         <div className="max-w-[1400px] mx-auto flex justify-between items-center px-6 py-3">
//           <div className="flex items-center space-x-8">
//             {isMobile ? (
//               <>
//                 <div className="flex items-center">
//                   <Link href={`tel:${homeSetting?.phone || '+91-7425021519'}`} className="flex items-center">
//                     <FaPhoneAlt className="text-yellow-400" />
//                   </Link>
//                 </div>
//                 <div className="flex items-center">
//                   <Link href={`mailto:${homeSetting?.email || 'loveastrosolutions@gmail.com'}`} className="flex items-center">
//                     <FaEnvelope className="text-yellow-400" />
//                   </Link>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="flex items-center space-x-2">
//                   <FaPhoneAlt className="text-yellow-400" />
//                   <Link href={`tel:${homeSetting?.phone || '+91-7425021519'}`} className="hover:text-yellow-400 transition">
//                     <span>{loading ? 'Loading...' : homeSetting?.phone || '+91-7425021519'}</span>
//                   </Link>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <FaEnvelope className="text-yellow-400" />
//                   <Link href={`mailto:${homeSetting?.email || 'loveastrosolutions@gmail.com'}`} className="hover:text-yellow-400 transition">
//                     <span>{loading ? 'Loading...' : homeSetting?.email || 'loveastrosolutions@gmail.com'}</span>
//                   </Link>
//                 </div>
//               </>
//             )}
//           </div>
//           <div className="hidden md:flex items-center space-x-8">
//             <span className="text-yellow-300 font-semibold drop-shadow">
//               {loading ? 'Loading...' : homeSetting?.title || "INDIA'S BEST CELEBRITY ASTROLOGER"}
//             </span>
//             <div className="flex space-x-5 text-lg">
//               <Link href={homeSetting?.instagram_link || '#'} className="hover:text-pink-500">
//                 <FaInstagram />
//               </Link>
//               <Link href={homeSetting?.facebook_link || '#'} className="hover:text-blue-500">
//                 <FaFacebookF />
//               </Link>
//               <Link href={homeSetting?.youtube_link || '#'} className="hover:text-red-500">
//                 <FaYoutube />
//               </Link>
//             </div>
//             <button
//               onClick={() => setIsPopupOpen(true)}
//               className="ml-4 bg-yellow-400 text-black px-4 py-1.5 rounded font-bold text-sm hover:bg-yellow-500 transition"
//             >
//               Book Now
//             </button>
//           </div>
//           <div className="md:hidden ml-auto">
//             <button onClick={() => setMenuOpen(true)} aria-label="Open Menu">
//               <FaBars className="cursor-pointer text-2xl text-white" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {isPopupOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-2xl font-bold text-purple-900">Book an Appointment</h2>
//               <button
//                 onClick={() => setIsPopupOpen(false)}
//                 className="text-red-500 hover:text-red-700"
//                 aria-label="Close Popup"
//               >
//                 <FaTimes className="text-xl" />
//               </button>
//             </div>
//             <form onSubmit={handleFormSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleFormChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
//                   placeholder="Enter your name"
//                   required
//                 />
//                 {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleFormChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
//                   placeholder="Enter your email"
//                   required
//                 />
//                 {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//                 <input
//                   type="text"
//                   name="contact"
//                   value={formData.contact}
//                   onChange={handleFormChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
//                   placeholder="Enter your contact number"
//                   required
//                 />
//                 {formErrors.contact && <p className="text-red-500 text-sm">{formErrors.contact}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//                 <input
//                   type="date"
//                   name="dob"
//                   value={formData.dob}
//                   onChange={handleFormChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
//                   required
//                 />
//                 {formErrors.dob && <p className="text-red-500 text-sm">{formErrors.dob}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Other Requests</label>
//                 <textarea
//                   name="otherRequest"
//                   value={formData.otherRequest}
//                   onChange={handleFormChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
//                   placeholder="Any additional requests"
//                   rows="4"
//                 />
//               </div>
//               <div>
//                 <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                   <input
//                     type="checkbox"
//                     name="confirmDetails"
//                     checked={formData.confirmDetails}
//                     onChange={handleFormChange}
//                     className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                   />
//                   Confirm details meet requirements
//                 </label>
//                 {formErrors.confirmDetails && (
//                   <p className="text-red-500 text-sm">{formErrors.confirmDetails}</p>
//                 )}
//               </div>
//               <div className="flex justify-end gap-4">
//                 <button
//                   type="button"
//                   onClick={handleFormReset}
//                   className="bg-gray-500 text-white px-4 py-2 rounded font-semibold hover:bg-gray-600 transition"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-purple-600 text-white px-4 py-2 rounded font-semibold hover:bg-purple-700 transition"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="bg-white py-4">
//         <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row justify-between items-center gap-4">
//           <div className="flex items-center gap-4">
//             <div className="w-64 cursor-pointer">
//               <Link href="/" aria-label="Home">
//                 <Image
//                   src={homeSetting?.logo && homeSetting.logo !== '' ? `${API_URL}${homeSetting.logo}` : '/logo1.webp'}
//                   alt="Logo"
//                   width={256}
//                   height={156}
//                   onError={(e) => {
//                     console.error('Error loading logo:', homeSetting?.logo);
//                     e.target.src = '/logo1.webp';
//                   }}
//                 />
//               </Link>
//             </div>
//           </div>

//           <div className="text-center hidden md:block">
//             <p className="text-xl font-bold text-purple-800">&quot;Don&apos;t Lose Hope&quot;</p>
//             <p className="text-purple-600 font-semibold text-lg">
//               Happiness Can Come Again In Your Life
//             </p>
//             <div className="inline-block mt-2 px-4 py-2 border border-yellow-400 text-purple-900 font-bold rounded-full">
//               100% Confidential
//             </div>
//           </div>
//           <div className="flex flex-wrap justify-center sm:justify-start gap-6">
//             {homeSetting?.icon_image ? (
//               <div className="flex flex-col items-center">
//                 <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
//                   <Image
//                     src={`${API_URL}${homeSetting.icon_image}`}
//                     alt="Icon Image"
//                     width={96}
//                     height={96}
//                     onError={(e) => {
//                       console.error('Error loading icon image:', homeSetting?.icon_image);
//                       e.target.src = '/icon-placeholder.png';
//                     }}
//                   />
//                 </div>
//               </div>
//             ) : null}
//           </div>
//         </div>
//       </div>

//       <nav
//         className="p-2 text-white hidden lg:flex w-[1100px] mx-auto rounded-[35px] mb-[-30px]"
//         style={{ background: homeSetting?.navbar_background_color || defaultGradient }}
//       >
//         <div className="max-w-[1400px] mx-auto flex items-center justify-center px-6 py-3 space-x-8 text-sm sm:text-base font-medium relative">
//           {navItems.map(({ name, href, dropdown }, idx) => (
//             <div key={idx} className="relative">
//               {dropdown && dropdown.length > 0 ? (
//                 <div className="relative">
//                   <div className="group inline-block">
//                     <Link
//                       href={href}
//                       className="relative flex items-center gap-1 cursor-pointer hover:text-yellow-400 transition-all duration-300"
//                     >
//                       <span>{name}</span>
//                       <span className="text-xs">▼</span>
//                     </Link>
//                     <div className="absolute top-full left-0 bg-white text-purple-900 rounded-md shadow-lg mt-2 opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:scale-100 transform scale-95 transition-all duration-200 min-w-[200px] z-50">
//                       <ul className="flex flex-col py-2">
//                         {dropdown.map((item, subIdx) => (
//                           <li key={subIdx}>
//                             <Link
//                               href={item.href}
//                               className="block px-4 py-2 hover:bg-purple-100 hover:text-purple-900 transition"
//                             >
//                               {item.name}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <Link
//                   href={href}
//                   className="hover:text-yellow-400 transition cursor-pointer"
//                 >
//                   {name}
//                 </Link>
//               )}
//             </div>
//           ))}
//         </div>
//       </nav>

//       <div
//         className={`fixed overflow-scroll top-0 left-0 w-72 h-full z-50 transform transition-transform duration-300 ${
//           menuOpen ? 'translate-x-0' : '-translate-x-full'
//         } text-white shadow-2xl rounded-r-2xl backdrop-blur-sm`}
//         style={{ background: homeSetting?.navbar_background_color || defaultGradient }}
//       >
//         <div className="flex justify-between items-center p-3 border-b border-purple-700">
//           <div className="bg-white/80 p-2 rounded-xl shadow-md w-50">
//             <Link href="/" aria-label="Home">
//               <Image
//                 src={homeSetting?.logo && homeSetting.logo !== '' ? `${API_URL}${homeSetting.logo}` : '/logo.png'}
//                 alt="Logo"
//                 width={200}
//                 height={100}
//                 className="rounded-lg"
//                 onError={(e) => {
//                   console.error('Error loading mobile logo:', homeSetting?.logo);
//                   e.target.src = '/logo.png';
//                 }}
//               />
//             </Link>
//           </div>
//           <button onClick={() => setMenuOpen(false)} aria-label="Close Menu">
//             <FaTimes className="text-2xl text-red-400 hover:text-red-600 transition" />
//           </button>
//         </div>

//         <ul className="flex flex-col px-4 py-6 font-medium space-y-3 text-sm">
//           {navItems.map(({ name, href, dropdown }, idx) => (
//             <li key={idx} className="group">
//               {dropdown && dropdown.length > 0 ? (
//                 <>
//                   <button
//                     onClick={() => toggleDropdown(name)}
//                     className="flex justify-between items-center w-full text-left text-white hover:text-yellow-300 transition"
//                   >
//                     <span>{name}</span>
//                     {mobileDropdowns[name] ? <FaChevronUp /> : <FaChevronDown />}
//                   </button>
//                   <div
//                     className={`overflow-hidden transition-all duration-300 ${
//                       mobileDropdowns[name] ? 'max-h-96 mt-2' : 'max-h-0'
//                     }`}
//                   >
//                     <ul className="pl-3 py-2 bg-white/10 rounded-lg backdrop-blur-sm shadow-inner space-y-2 text-purple-100">
//                       {dropdown.map((item, subIdx) => (
//                         <li key={subIdx}>
//                           <Link
//                             href={item.href}
//                             className="block py-1 px-2 hover:bg-yellow-400/20 rounded transition"
//                             onClick={() => setMenuOpen(false)}
//                           >
//                             {item.name}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </>
//               ) : (
//                 <Link
//                   href={href}
//                   className="block hover:text-yellow-300 transition"
//                   onClick={() => setMenuOpen(false)}
//                 >
//                   {name}
//                 </Link>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {menuOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40"
//           onClick={() => setMenuOpen(false)}
//         />
//       )}
//     </header>
//   );
// }