'use client';

import React, { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ✅ Custom Previous Arrow with aria-label
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Previous Slide"
    className="absolute left-[-20px] top-[40%] z-10 bg-white text-purple-700 border shadow p-2 rounded-full hover:bg-purple-700 hover:text-white transition"
  >
    <IoIosArrowBack size={16} />
  </button>
);

// ✅ Custom Next Arrow with aria-label
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="Next Slide"
    className="absolute right-[-20px] top-[40%] z-10 bg-white text-purple-700 border shadow p-2 rounded-full hover:bg-purple-700 hover:text-white transition"
  >
    <IoIosArrowForward size={16} />
  </button>
);

export default function SliderSlick() {
  const [slides, setSlides] = useState([]);
  const [homeSetting, setHomeSetting] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAwards = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/awards`);
      setSlides(res.data);
    } catch (err) {
      console.error("Error fetching awards:", err);
    }
  }, []);

  const fetchHomeSetting = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/home-setting`);
      setHomeSetting(res.data);
    } catch (err) {
      console.error("Error fetching home setting:", err);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchAwards(), fetchHomeSetting()]).finally(() => setLoading(false));
  }, [fetchAwards, fetchHomeSetting]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: slides.length > 1,
    autoplaySpeed: 3000,
    slidesToShow: slides.length >= 3 ? 3 : slides.length,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: slides.length >= 2 ? 2 : slides.length },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="w-full bg-white py-12 min-h-[150px]">
      <div className="max-w-[1400px] mx-auto px-4 relative">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-10"
          style={{ color: homeSetting?.heading_color || '#000000' }}
        >
          <span className="border-l-4 border-yellow-400 pl-3">
            Achievement & Awards
          </span>
        </h2>

        {loading ? (
          <p className="text-center">Loading awards...</p>
        ) : slides.length === 0 ? (
          <p className="text-center">No awards found.</p>
        ) : (
          <div className="relative">
            <Slider {...settings}>
              {slides.map((award) => (
                <div key={award.id} className="px-2">
                  <div className="bg-white rounded-lg shadow-md p-4 text-center flex flex-col h-full border border-gray-200">
                    <Image
                      src={`${API_URL}${award.image}`}
                      alt={award.title}
                      width={300}
                      height={224}
                      className="h-56 object-contain mx-auto mb-4"
                    />
                    <h3 className="font-semibold text-lg text-purple-800">
                      {award.title}
                    </h3>
                    <p className="text-sm text-red-600 mt-1">
                      {award.short_description.replace(/<[^>]+>/g, "")}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </section>
  );
}