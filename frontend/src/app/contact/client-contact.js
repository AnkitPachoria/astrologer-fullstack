"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, User, Send } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export default function ClientContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [homeSettings, setHomeSettings] = useState({
    phone: "",
    email: "",
    address: "",
    mapSrc: "",
  });
  const [seo, setSeo] = useState({ title: "Contact Us", description: "" });
  const [loading, setLoading] = useState(true); // for home settings
  const [seoLoading, setSeoLoading] = useState(true); // for SEO data
  const [error, setError] = useState(null);
  const [seoError, setSeoError] = useState(null);

  useEffect(() => {
    // Fetch contact info (homeSettings)
    const fetchHomeSettings = async () => {
      try {
        const resp = await axios.get(`${API_URL}/api/home-setting`);
        const rawAddress =
          resp.data.address || "Pitampura, Delhi, INDIA PINCODE: 110034";
        const formatted = encodeURIComponent(
          rawAddress.replace(/,/g, " ").replace(/\s+/g, "+").trim()
        );

        const mapSrc = GOOGLE_MAPS_API_KEY
          ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${formatted}`
          : `https://maps.google.com/maps?q=${formatted}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

        setHomeSettings({
          phone: resp.data.phone || "",
          email: resp.data.email || "",
          address: rawAddress,
          mapSrc,
        });
        setError(null);
      } catch (err) {
        console.error("Error loading home settings:", err);
        setError("Failed to load contact info.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch SEO metadata
    const fetchSeo = async () => {
      try {
        const resp = await axios.get(`${API_URL}/api/seo`);
        setSeo({
          title: resp.data.title || resp.data.seo_title || "Contact Us",
          description: resp.data.description || resp.data.seo_description || "",
        });
        setSeoError(null);
      } catch (err) {
        console.error("Error loading SEO data:", err);
        setSeoError("Failed to load SEO data.");
      } finally {
        setSeoLoading(false);
      }
    };

    fetchHomeSettings();
    fetchSeo();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      await axios.post(`${API_URL}/api/contacts`, formData);
      setFeedback({ type: "success", message: "Message sent successfully!" });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Error submitting form:", err);
      setFeedback({
        type: "error",
        message:
          err.response?.data?.error || "Failed to send message. Try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Banner Section with dynamic SEO title & description */}
      <section
        className="relative bg-cover bg-center py-16 px-4 overflow-hidden flex items-center justify-center"
        style={{ backgroundImage: "url('/bg-soln.jpg')" }}
      >
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
          {seoLoading ? (
            <div className="text-white animate-pulse">
              <h2 className="text-3xl md:text-4xl font-bold">Loading...</h2>
            </div>
          ) : seoError ? (
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold">Contact Us</h2>
              <p className="text-lg md:text-xl">
                We&apos;d love to hear from you!
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-[#fcd280]">
                {seo.title}
              </h2>
              <p className="text-lg md:text-xl text-white">
                {seo.description.replace(/'/g, "&apos;")}
              </p>
            </>
          )}

          <button className="bg-gradient-to-r from-[#fcd280] to-[#f39200] text-purple-900 font-semibold px-6 py-2 rounded-full hover:bg-yellow-600 transition duration-300 shadow-md">
            Back to Home
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#fff8ee] py-12 px-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left - Contact Info */}
          <div className="border p-6 bg-white">
            <div className="bg-gradient-to-r from-[#fcd280] to-[#f39200] inline-block px-6 py-2 rounded-full mb-4">
              <h2 className="text-[#31002b] font-bold text-xl font-serif">
                Contact Details
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-4">
                {/* spinner */}
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : (
              <ul className="space-y-4 text-[#1e1e1e] font-medium">
                <li className="flex items-center gap-3">
                  <Phone className="text-orange-400" /> {homeSettings.phone}
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="text-orange-400" /> {homeSettings.address}
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-orange-400" /> {homeSettings.email}
                </li>
              </ul>
            )}

            <div className="mt-6">
              <iframe
                title="Google Map"
                src={homeSettings.mapSrc}
                className="w-full h-[300px] rounded-md"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="bg-[#2e082e] text-white rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="bg-gradient-to-r from-[#fcd280] to-[#f39200] inline-block px-6 py-2 rounded-full mb-4">
                <h2 className="text-[#31002b] font-bold text-xl font-serif">
                  Contact Us
                </h2>
              </div>
              <p className="text-sm font-semibold mb-6">
                Send your message below:
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="flex items-center border border-white rounded-full px-4 py-2">
                  <User className="text-yellow-400 mr-2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="bg-transparent outline-none text-white flex-1"
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex items-center border border-white rounded-full px-4 py-2">
                  <Mail className="text-yellow-400 mr-2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E-mail"
                    className="bg-transparent outline-none text-white flex-1"
                  />
                </div>

                {/* Phone */}
                <div className="flex items-center border border-white rounded-full px-4 py-2">
                  <Phone className="text-yellow-400 mr-2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="bg-transparent outline-none text-white flex-1"
                    required
                  />
                </div>

                {/* Message */}
                <div className="border border-white rounded-md px-4 py-2">
                  <textarea
                    rows="4"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    className="w-full bg-transparent outline-none text-white resize-none"
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-[#fcd280] to-[#f39200] text-[#31002b] font-bold py-3 rounded-full flex justify-center items-center gap-2 text-lg font-serif hover:opacity-90"
                  >
                    <Send className="w-5 h-5" />
                    {submitting ? "Sending..." : "SEND MESSAGE"}
                  </button>
                </div>
              </form>

              {/* Feedback */}
              {feedback && (
                <p
                  className={`mt-4 text-sm font-semibold ${
                    feedback.type === "success"
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  {feedback.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
