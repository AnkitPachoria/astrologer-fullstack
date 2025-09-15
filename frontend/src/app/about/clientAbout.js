'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export default function ClientAbout() {
  const [homeSetting, setHomeSetting] = useState(null);
  const [about, setAbout] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Function to strip HTML tags
  const stripHtml = (html) => {
    return html ? html.replace(/<[^>]+>/g, "") : "";
  };
  // Fetch about, home-setting, and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [aboutRes, homeRes, servicesRes] = await Promise.all([
          axios.get(`${API_URL}/api/about`),
          axios.get(`${API_URL}/api/home-setting`),
          axios.get(`${API_URL}/api/services`),
        ]);

        console.log("Fetched about:", aboutRes.data);
        console.log("Fetched home-setting:", homeRes.data);
        console.log("Fetched services:", servicesRes.data);

        // Handle about data (find active or first item)
        const aboutData = Array.isArray(aboutRes.data)
          ? aboutRes.data
          : [aboutRes.data];
        const activeAbout =
          aboutData.find((item) => item.status === 1) || aboutData[0];

        setAbout(activeAbout);
        setHomeSetting(homeRes.data);
        setServices(servicesRes.data.slice(0, 8)); // Limit to 8 services
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }
  // Split services into left and right (4 each)
  const leftServices = services.slice(0, 4);
  const rightServices = services.slice(4, 8);

  // Format phone for WhatsApp link
  const whatsappNumber = homeSetting?.phone
    ? homeSetting.phone.replace(/[+-\s]/g, "")
    : "+919915014230";

  // Get dynamic heading color
  const headingColor = homeSetting?.heading_color || "#1E3A8A";

  return (
    <div className="bg-gray-100">
      {/* Banner Section */}
      <section
        className="relative bg-gradient-to-r from-purple-900 via-black to-purple-900 py-16 px-4 overflow-hidden"
        style={{
          backgroundImage:
            "url('/bg-soln.jpg'), linear-gradient(to right, #1e3a8a, #000000, #1e3a8a)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gray Overlay */}
        <div className="absolute inset-0 bg-gray-900/50 z-0"></div>

        {/* Content Layer */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 py-14">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* Left Image */}
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-40 h-40 rounded-full border-[6px] border-gray-300 overflow-hidden shadow-lg">
                {console.log(
                  "About image URL:",
                  about?.image && typeof about.image === "string"
                    ? about.image.startsWith("http")
                      ? about.image
                      : `${API_URL}${encodeURI(about.image)}`
                    : "/default-about.jpg"
                )}
                <Image
                  src={
                    about?.image && typeof about.image === "string"
                      ? about.image.startsWith("http")
                        ? about.image
                        : `${API_URL}${encodeURI(about.image)}`
                      : "/default-about.jpg"
                  }
                  alt={about?.short_title || "About Image"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.error("Error loading image:", about?.image);
                    e.target.src = "/default-about.jpg";
                  }}
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="md:w-2/3 text-center md:text-left">
              <p className="text-gray-300 font-semibold text-sm tracking-wider uppercase">
                {about?.short_title || "About Us"}
              </p>
              <h3
                className="text-4xl font-bold mt-1"
                style={{ color: headingColor }}
              >
                {about?.title || "Our Mission"}
              </h3>
              <p className="mt-3 text-white leading-relaxed text-[16px]">
                {about?.subtitle || "Discover the power of our services."}
              </p>
              <Link
                href={`tel:${homeSetting?.phone || "+91-9915014230"}`}
                className="mt-4 inline-block bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-full transition duration-300 shadow-md"
              >
                Book Appointment Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <div className="mt-10 flex justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-[1400px] w-full text-gray-700 text-[15.5px] leading-relaxed border border-gray-300">
          <div
            className="text-justify"
            dangerouslySetInnerHTML={{
              __html: about?.description || "No description available.",
            }}
          />
        </div>
      </div>

      {/* Who is Astrologer */}
      <section className="flex max-w-[1400px] mx-auto flex-col md:flex-row justify-between items-start md:p-10 bg-gray-100 gap-6 p-4 sm:p-6">
        {/* Left Column - Problem Categories */}
        <div className="w-full md:w-1/3 space-y-4">
          {leftServices.map((service, index) => (
            <Link
              key={service.id || service._id || index}
              href={`/${service.city_slug || "jaipur"}/${
                service.category_slug || "astrologer"
              }/${service.slug}`}
              className="flex items-center bg-purple-800 text-white p-3 rounded-lg shadow-md hover:bg-purple-700 hover:text-gray-200 transition"
            >
              <span className="text-gray-300 text-xl mr-3">⭐</span>
              <span className="text-sm md:text-base font-medium">
                {service.title}
              </span>
            </Link>
          ))}
          <div className="flex items-start bg-gray-300 text-black p-4 rounded-lg shadow-md mt-4">
            <span className="text-2xl mr-3">📞</span>
            <div className="text-sm md:text-base leading-snug">
              Are You Tired Of Your Life Problems? & Want To Fix Everything?
              <br />
              <a
                href={`tel:${homeSetting?.phone || "+91-9915014230"}`}
                className="text-lg font-bold block mt-1 hover:underline"
                style={{ color: headingColor }}
              >
                CALL NOW
              </a>
            </div>
          </div>
        </div>

        {/* Center Column - Astrologer Info */}
        <div className="w-full md:w-1/3 bg-white p-6 border-4 border-gray-300 rounded-xl shadow-lg">
          <h2
            className="text-2xl md:text-3xl font-extrabold mb-3 text-center"
            style={{ color: headingColor }}
          >
            Who Is{" "}
            <span className="text-purple-600">
              {homeSetting?.astrologer_name || "Astrologer Karan Sharma"}?
            </span>
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-2 text-justify">
            Don&apos;t Lose Hope
          </p>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
            {homeSetting?.astrologer_name || "Astrologer Karan Sharma"} is a
            renowned astrologer who simplifies the power of astrology by
            removing myths and misconceptions. His mission is to bring positive
            change in people&apos;s lives through trusted astrological guidance.
          </p>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
            {homeSetting?.description
              ? stripHtml(homeSetting.description)
              : "With years of experience, his clients trust him deeply. He combines dedication with divine science to bring clarity and peace in personal and professional lives."}
          </p>
        </div>

        {/* Right Column - Additional Services */}
        <div className="w-full md:w-1/3 space-y-4">
          {rightServices.map((service, index) => (
            <Link
              key={service.id || service._id || index}
              href={`/${service.city_slug || "jaipur"}/${
                service.category_slug || "astrologer"
              }/${service.slug}`}
              className="flex items-center bg-purple-800 text-white p-3 rounded-lg shadow-md hover:bg-purple-700 hover:text-gray-200 transition"
            >
              <span className="text-gray-300 text-xl mr-3">⭐</span>
              <span className="text-sm md:text-base font-medium">
                {service.title}
              </span>
            </Link>
          ))}
          <div className="flex items-start bg-gray-300 text-black p-4 rounded-lg shadow-md mt-4">
            <span className="text-2xl mr-3">💬</span>
            <div className="text-sm md:text-base leading-snug">
              We Will Transform Your Life And
              <br />
              <a
                href={`https://wa.me/${whatsappNumber}`}
                className="text-lg font-bold block mt-1 hover:underline"
                style={{ color: headingColor }}
                  target="_blank"
                rel="noopener noreferrer"
              >
                GIVE ONLINE CHAT
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}