'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CardsSection() {
  const [homeSetting, setHomeSetting] = useState(null);

  useEffect(() => {
    const fetchHomeSetting = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/home-setting`);
        setHomeSetting(res.data);
      } catch (err) {
        console.error("Error fetching home setting:", err);
      }
    };
    fetchHomeSetting();
  }, []);

if (!homeSetting) {
  return (
    <section className="w-full bg-white py-12 min-h-[500px]">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Placeholder left box */}
        <div className="border-8 p-6 min-h-[420px] animate-pulse bg-gray-100 rounded-md" />
        
        {/* Placeholder right box */}
        <div className="text-center min-h-[420px] animate-pulse bg-gray-100 rounded-md" />
      </div>
    </section>
  );
} 
   
    
  const omTextColor = (homeSetting?.service_background_color?.includes('gradient') || homeSetting?.service_background_color === '#ff4242') ? '#ffffff' : '#000000';

  return (
    <section className="w-full bg-white py-12 min-h-[500px]">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div
          className="border-8 p-6 relative min-h-[420px]"
          style={{
            borderImage: `${homeSetting?.service_background_color || 'linear-gradient(to bottom right, #4B0082, #800080, #FFA500)'} 1`,
            borderImageSlice: 1,
          }}
        >
          {/* Ribbon Heading */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-4 text-center min-w-[280px]">
            <h3
              className="text-3xl font-extrabold uppercase tracking-wide min-h-[42px]"
              style={{ color: homeSetting?.heading_color || "#000000" }}
            >
              {homeSetting?.astrologer_name || "Famous Pandit"}
            </h3>
            <div
              className="w-8 h-8 mx-auto mt-1 text-center rounded-full text-xl leading-8 font-bold"
              style={{
                background: homeSetting?.service_background_color || 'linear-gradient(to bottom right, #4B0082, #800080, #FFA500)',
                border: `2px solid ${homeSetting?.service_background_color || '#4B0082'}`,
                color: omTextColor,
              }}
            >
              ॐ
            </div>
            <hr className="mt-1 border-t-[2px] border-orange-400 w-32 mx-auto" />
          </div>

          {/* Title & Paragraph */}
          <div className="mt-20">
            <h2
              className="text-3xl md:text-4xl font-bold mb-2 text-center md:text-left py-5 min-h-[64px]"
              style={{ color: homeSetting?.heading_color || "#000000" }}
            >
              {homeSetting?.title || "Reshape Your Life Through Astrology"}
            </h2>

            <div
              className="text-gray-800 leading-relaxed text-justify min-h-[160px]"
              dangerouslySetInnerHTML={{
                __html: homeSetting?.description ||
                  `<p>When life has some unexpected things for you, never worry, and must consider using astrology...</p>`,
              }}
            />
          </div>
        </div>

        {/* RIGHT IMAGE & HEADING */}
        <div className="text-center relative min-h-[420px] flex flex-col justify-start">
          <h2
            className="text-2xl md:text-3xl font-bold py-3 px-4 inline-block rounded-md mb-6 min-h-[40px]"
            style={{ color: homeSetting?.heading_color || "#000000" }}
          >
            {homeSetting?.subtitle || "Get In-Depth Horoscope With 10 Years Predictions."}
          </h2>

          <div className="relative w-full h-[400px] mx-auto flex justify-center items-center">
            <div className="w-[350px] h-[350px] min-w-[350px] min-h-[350px] rounded-full overflow-hidden">
              <Image
                src={
                  homeSetting?.image && homeSetting.image !== ""
                    ? `${API_URL}${homeSetting.image}`
                    : "/AstroShyamsundar.jpg"
                }
                alt="Rotating Religion Symbols"
                width={350}
                height={350}
                className="object-contain w-full h-full"
                priority
                placeholder="blur"
                blurDataURL="/placeholder.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
