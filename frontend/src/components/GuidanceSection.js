'use client';

import { useEffect, useState, useCallback } from 'react';
import { FaStarOfDavid } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';

export default function GuidanceSection() {
  const [servicesByCity, setServicesByCity] = useState({});
  const [loading, setLoading] = useState(true);
  const [bgColor, setBgColor] = useState('linear-gradient(to bottom right, #4B0082, #800080, #FFA500)'); // Default fallback gradient
  const [textColor, setTextColor] = useState('#ffffff'); // Default fallback

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/home-setting`);
      if (!res.ok) throw new Error(`Failed to fetch settings: ${res.status}`);
      const data = await res.json();
      console.log('Fetched service background color:', data.service_background_color); // Debug
      setBgColor(data.service_background_color || 'linear-gradient(to bottom right, #4B0082, #800080, #FFA500)');
      setTextColor(data.service_text_color || '#ffffff');
    } catch (error) {
      toast.error(`Error fetching settings: ${error.message}`);
    }
  }, [API_URL]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/services`);
      if (!res.ok) throw new Error(`Failed to fetch services: ${res.status}`);
      const data = await res.json();

      const grouped = data.reduce((acc, service) => {
        const city = service.city_name || 'Uncategorized';
        if (!acc[city]) acc[city] = [];
        acc[city].push(service);
        return acc;
      }, {});

      // Limit to 5 services per city
      Object.keys(grouped).forEach(city => {
        grouped[city] = grouped[city].slice(0, 5);
      });

      setServicesByCity(grouped);
    } catch (error) {
      toast.error(`Error fetching services: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchSettings();
    fetchServices();
  }, [fetchSettings, fetchServices]);

  // Determine a contrasting color for FaStarOfDavid based on textColor
  const starColor = textColor === '#ffffff' || textColor === '#FFD700' ? '#FFD700' : textColor;

  return (
    <section
      className="py-16 px-4 text-white"
      style={{ background: bgColor }}
    >
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      <div className="max-w-[1400px] mx-auto">
        {loading ? (
          <p className="text-center text-xl">Loading services...</p>
        ) : Object.keys(servicesByCity).length === 0 ? (
          <p className="text-center text-xl">No services found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(servicesByCity).map(([cityName, services], idx) => (
              <div key={idx} className="space-y-4">
                <h3
                  className="text-2xl font-bold uppercase mb-4 flex items-center gap-2"
                  style={{ color: textColor }}
                >
                  {cityName}
                  <FaStarOfDavid style={{ color: starColor }} />
                </h3>
                {services.map((service, i) => (
                  <Link
                    key={i}
                    href={`/${service.city_slug || 'jaipur'}/${service.category_slug || 'astrologer'}/${service.slug}`}
                    className="rounded-full px-5 py-2 shadow-md flex items-center gap-3 hover:scale-[1.02] transition text-sm font-medium"
                    style={{
                      backgroundColor: '#fff9e8',
                      color: '#000000',
                    }}
                  >
                    <FaStarOfDavid style={{ color: starColor }} />
                    <span>{service.title}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );  
}