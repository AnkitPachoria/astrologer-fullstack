"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import {
  FaHeart,
  FaComments,
  FaUserSecret,
  FaHandHoldingHeart,
} from "react-icons/fa";
import {
  FaUsers,
  FaRing,
  FaStar,
  FaBriefcase,
  FaPassport,
  FaChild,
} from "react-icons/fa";
import Image from "next/image";

// FaqSection Component
function FaqSection() {
  const faqs = [
    {
      question: "What is Kundali Matching and why is it important?",
      answer:
        "Kundali Matching is a Vedic astrology method used to check compatibility between two individuals before marriage. It helps ensure a harmonious, happy, and long-lasting relationship.",
    },
    {
      question: "What is Guna Milan in Kundali Matching?",
      answer:
        "Guna Milan is the process of matching 36 points between two horoscopes. The higher the score, the better the compatibility between the couple.",
    },
    {
      question: "What is Manglik Dosha?",
      answer:
        "Manglik Dosha is a condition in astrology where Mars is placed in certain houses of the birth chart. It can affect marriage life unless remedial steps are taken.",
    },
    {
      question: "Can Kundali Matching help in love marriages too?",
      answer:
        "Yes! Kundali Matching is helpful in both arranged and love marriages. It gives insights into compatibility and possible future challenges.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className="bg-[#fff8ee] py-12 px-4">
      <div className=" max-w-[1400px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#7a001f] mb-8 font-serif">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[#dcbda1] rounded-md shadow-sm bg-white"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center px-5 py-4 text-left text-[#7a001f] font-semibold text-lg"
              >
                {faq.question}
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-[#7a001f]" />
                ) : (
                  <Plus className="w-5 h-5 text-[#7a001f]" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-5 pb-4 text-gray-700">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    icon: <FaHeart className="text-4xl text-pink-600 mb-4" />,
    title: "Love Problem Solutions",
    description:
      "Feeling lost in love? Reignite your relationship spark. Clarity awaits you.",
  },
  {
    icon: <FaComments className="text-4xl text-indigo-600 mb-4" />,
    title: "Relationship Advice",
    description:
      "Honest guidance for couples and individuals navigating emotional challenges.",
  },
  {
    icon: <FaUserSecret className="text-4xl text-yellow-500 mb-4" />,
    title: "Personalized Astrology",
    description:
      "Unlock the secrets of your stars. Tailored insights for your unique path.",
  },
  {
    icon: <FaHandHoldingHeart className="text-4xl text-red-500 mb-4" />,
    title: "Marriage Compatibility",
    description:
      "Discover if your love is written in the stars. Vedic matching for lasting bonds.",
  },
];

// Services Component
export default function Services() {
  return (
    <div className="space-y-12">
      {/* BestSolution Section */}
      <section
        className="bestsolution-section relative bg-cover bg-center py-16 px-4 overflow-hidden flex items-center justify-center"
        style={{ backgroundImage: "url('/bg-soln.jpg')" }}
      >
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400">
            Relationship Problems
          </h2>
          <p className="text-lg md:text-xl text-white">
            Most Popular & Celebrity Astrologer
          </p>
          <button className="bg-yellow-500 text-purple-900 font-semibold px-6 py-2 rounded-full hover:bg-yellow-600 transition duration-300 shadow-md">
            Back to Home
          </button>
        </div>
        {/* Optional dark overlay */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>
      </section>

      {/* Kundali Matching Section */}
      <section className="bg-[#fff8ee] py-12 px-4">
        <div className=" grid md:grid-cols-2 gap-10 items-center max-w-[1400px] mx-auto">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#7a001f] font-serif">
              Kundali Matching for Marriage
            </h2>
            <hr className="border-[#7a001f] w-24 mt-2 mb-6" />
            <h3 className="text-[#7a001f] font-semibold text-lg mt-6 mb-2">
              The Process of Kundali Matching and Guna Milan
            </h3>
            <p className="text-gray-800 mb-4">
              The steps of the Kundali Matching start with an extensive study of
              the birth charts of the two people. Among the most famous ones is
              <strong> Guna Milan</strong>, in which 36 attributes (gunas) are
              paired between the two charts.
            </p>
            <p className="text-gray-800 mb-4">
              The more points a couple gets, the more harmonious they would be
              on issues such as emotional harmony, mental compatibility,
              physical attraction, and family values. However, compatibility is
              not only about numbers. Planetary position, presence of
              <strong> Manglik dosha</strong>, and other astrological factors
              that may have influence on marital life are also studied by Astro
              Shyamsundar.
            </p>
            <p className="text-gray-800">
              Take the example of Manglik Dosha, which may invoke imbalance in
              any relationship unless given proper attention. At Astro
              Shyamsundar, we not only diagnose such doshas but also prescribe
              proven, time-tested solutions that nullify their impact. We do not
              simply highlight issues; we provide answers that will help achieve
              a harmonious and successful marriage over the long term.
            </p>
          </div>
          {/* Right Image */}
          <div>
            <Image
              src="/Kundli.jpg"
              alt="Kundali Matching"
              width={600}
              height={400}
              className="w-full h-auto rounded-md shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-br from-purple-900 via-purple-700 to-orange-400 py-10 text-white ">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* Heading */}
          <div className="text-center py-3">
            <h1 className="text-4xl font-bold uppercase">
              Recommended Services
            </h1>
          </div>

          {/* Feature Grid Section - 8 Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
            {/* Box 1 */}
            <div className="border border-yellow-300 bg-white/10 p-5 rounded-lg hover:bg-white/20 transition">
              <FaHeart className="text-red-400 text-3xl mb-3" />
              <h3 className="font-bold mb-1">Love Problem Solutions</h3>
              <p className="text-sm">
                Feeling lost in love? Reignite your relationship spark. Clarity
                awaits you.
              </p>
            </div>

            {/* Box 2 */}
            <div className="border border-yellow-300 bg-white/10 p-5 rounded-lg hover:bg-white/20 transition">
              <FaUsers className="text-pink-400 text-3xl mb-3" />
              <h3 className="font-bold mb-1">Relationship Problem</h3>
              <p className="text-sm">
                Planetary placements may cause family stress. Let astrology
                guide you.
              </p>
            </div>

            {/* Box 3 */}
            <div className="border border-yellow-300 bg-white/10 p-5 rounded-lg hover:bg-white/20 transition">
              <FaRing className="text-yellow-300 text-3xl mb-3" />
              <h3 className="font-bold mb-1">Love Marriage</h3>
              <p className="text-sm">
                Facing marriage obstacles? Achieve your love goals with
                astrological support.
              </p>
            </div>

            {/* Box 4 */}
            <div className="border border-yellow-300 bg-white/10 p-5 rounded-lg hover:bg-white/20 transition">
              <FaStar className="text-purple-300 text-3xl mb-3" />
              <h3 className="font-bold mb-1">Kundali Matching</h3>
              <p className="text-sm">
                Marriage match matters! Ensure compatibility before commitment.
              </p>
            </div>

            {/* Box 5 */}
            <div className="border border-yellow-300 bg-white/10 p-5 rounded-lg hover:bg-white/20 transition">
              <FaBriefcase className="text-green-300 text-3xl mb-3" />
              <h3 className="font-bold mb-1">Job Problems</h3>
              <p className="text-sm">
                Opportunities slipping away? Discover what the stars say about
                your career.
              </p>
            </div>

            {/* Box 6 */}
            <div className="border border-yellow-300 bg-white/10 p-5 rounded-lg hover:bg-white/20 transition">
              <FaPassport className="text-orange-300 text-3xl mb-3" />
              <h3 className="font-bold mb-1">Visa Problem</h3>
              <p className="text-sm">
                Tired of visa rejections? Astrological solutions may open your
                path abroad.
              </p>
            </div>

            {/* Box 7 */}
            <div className="border border-yellow-300 bg-white/10 p-5 rounded-lg hover:bg-white/20 transition">
              <FaHandHoldingHeart className="text-red-300 text-3xl mb-3" />
              <h3 className="font-bold mb-1">Couple Dispute</h3>
              <p className="text-sm">
                Disputes ruining your bond? Heal your relationship with divine
                guidance.
              </p>
            </div>

            {/* Box 8 */}
            <div className="border border-yellow-300 bg-white/10 p-5 rounded-lg hover:bg-white/20 transition">
              <FaChild className="text-blue-300 text-3xl mb-3" />
              <h3 className="font-bold mb-1">Parents & Children</h3>
              <p className="text-sm">
                Facing emotional distance with kids or parents? Balance your
                family energies.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-purple-900 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Explore trusted solutions guided by astrology and spiritual wisdom.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition duration-300"
              >
                {service.icon}
                <h3 className="text-xl font-semibold text-purple-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm text-center">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />
    </div>
  );
}