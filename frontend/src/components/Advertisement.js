"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AstrologyCollage() {
  const [services, setServices] = useState([]);
  const [homeSetting, setHomeSetting] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHomeSetting = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/home-setting`);
      console.log('Fetched home setting:', res.data);
      console.log('Service background color:', res.data.service_background_color); // Debug
      setHomeSetting(res.data);
    } catch (err) {
      console.error('Error fetching home setting:', err);
      setHomeSetting(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/services`);
      console.log('Fetched services:', res.data);
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  }, []);

  useEffect(() => {
    fetchHomeSetting();
    fetchServices();
  }, [fetchHomeSetting, fetchServices]);

  return (
    <section 
      className="py-10 text-white"
      style={{ 
        background: homeSetting?.service_background_color || 'linear-gradient(to bottom right, #4B0082, #800080, #FFA500)' 
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase"
            style={{ color: homeSetting?.service_text_color || '#FFD700' }}
          >
            {loading ? 'Loading...' : homeSetting?.service_title || 'Our Services'}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold mt-2 text-white/90">
            {loading ? 'Loading...' : homeSetting?.service_subtitle || 'Personalized Astrological Guidance'}
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {services.slice(0, 8).map((service) => (
            <Link
              key={service.id}
              href={`/${service.city_slug || 'jaipur'}/${service.category_slug || 'astrologer'}/${service.slug}`}
              className="block bg-white/10 border border-yellow-400 rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {service.image ? (
                <div className="w-40 h-40 mx-auto mb-4">
                  <Image
                    src={`${API_URL}${service.image}`}
                    alt={service.title}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover rounded-full border-2 border-white shadow-md"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
                  ?
                </div>
              )}
              <h3 className="text-lg font-bold text-white">{service.title}</h3>
              <p className="text-sm text-white/80 mt-2">{service.sub_title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  ); 
}