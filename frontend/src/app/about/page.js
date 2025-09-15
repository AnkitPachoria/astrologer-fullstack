
// src/app/about/page.js
import axios from 'axios';
import ClientAbout from './clientAbout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function generateMetadata() {
  try {
    const response = await axios.get(`${API_URL}/api/about`);
    const aboutData = Array.isArray(response.data) ? response.data : [response.data];
    const activeAbout = aboutData.find((item) => item.status === 1) || aboutData[0];

    return {
      title: activeAbout?.seo_title || activeAbout?.title || 'About Us',
      description: activeAbout?.seo_description || activeAbout?.subtitle || 'Discover the power of our services.',
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      title: 'About Us',
      description: 'Discover the power of our services.',
    };
  }
}

export default function AboutPage() {
  return <ClientAbout />;
}
// "use client";

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import Head from 'next/head';
// import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// export default function AboutPage() {
//   const [homeSetting, setHomeSetting] = useState(null);
//   const [about, setAbout] = useState(null);
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Function to strip HTML tags
//   const stripHtml = (html) => {
//     return html.replace(/<[^>]+>/g, '');
//   };

//   // Fetch about, home-setting, and services
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [aboutRes, homeRes, servicesRes] = await Promise.all([
//           axios.get(`${API_URL}/api/about`),
//           axios.get(`${API_URL}/api/home-setting`),
//           axios.get(`${API_URL}/api/services`),
//         ]);

//         console.log('Fetched about:', aboutRes.data);
//         console.log('Fetched home-setting:', homeRes.data);
//         console.log('Fetched services:', servicesRes.data);

//         // Handle about data (find active or first item)
//         const aboutData = Array.isArray(aboutRes.data) ? aboutRes.data : [aboutRes.data];
//         const activeAbout = aboutData.find((item) => item.status === 1) || aboutData[0];

//         setAbout(activeAbout);
//         setHomeSetting(homeRes.data);
//         setServices(servicesRes.data.slice(0, 8)); // Limit to 8 services
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gray-100">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gray-100">
//         <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">{error}</div>
//       </div>
//     );
//   }

//   // Split services into left and right (4 each)
//   const leftServices = services.slice(0, 4);
//   const rightServices = services.slice(4, 8);

//   // Format phone for WhatsApp link
//   const whatsappNumber = homeSetting?.phone
//     ? homeSetting.phone.replace(/[+-\s]/g, '')
//     : '+919915014230';

//   // Default astrologer name
//   const astrologerName = homeSetting?.astrologer_name || 'Astrologer Karan Sharma';

//   return (
//     <>
//       <Head>
//         <title>{about?.seo_title || about?.title || 'About Us'}</title>
//         <meta name="description" content={about?.seo_description || about?.subtitle || 'Discover the power of our services.'} />
//       </Head>
//       <div className="">
//         {/* Banner Section */}
//         <section
//           className="relative bg-cover bg-center py-16 px-4 overflow-hidden"
//           style={{ backgroundImage: "url('/bg-soln.jpg')" }}
//         >
//           <div className="absolute inset-0 bg-black/50 z-0"></div>
//           <div className="relative z-10 max-w-[1400px] mx-auto px-4 py-14">
//             <div className="flex flex-col md:flex-row md:items-center gap-8">
//               <div className="md:w-1/3 flex justify-center">
//                 <div className="relative w-40 h-40 rounded-full border-[6px] border-yellow-600 overflow-hidden shadow-md">
//                   <Image
//                     src={about?.image ? `${API_URL}${about.image}` : '/default-about.jpg'}
//                     alt={about?.short_title || 'About Image'}
//                     fill
//                     className="object-cover"
//                     onError={(e) => {
//                       console.error('Error loading image:', about?.image);
//                       e.target.src = '/default-about.jpg';
//                     }}
//                   />
//                 </div>
//               </div>
//               <div className="md:w-2/3 text-center md:text-left">
//                 <p className="text-red-600 font-semibold text-sm tracking-wider uppercase">
//                   {about?.short_title || 'About Us'}
//                 </p>
//                 <h3 className="text-4xl font-bold text-yellow-500 mt-1">
//                   {about?.title || 'Our Mission'}
//                 </h3>
//                 <p className="mt-3 text-white leading-relaxed text-[16px]">
//                   {about?.subtitle || 'Discover the power of our services.'}
//                 </p>
//                 <Link
//                   href={`tel:${homeSetting?.phone || '+91-9915014230'}`}
//                   className="mt-4 inline-block bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-semibold px-6 py-3 rounded-full transition duration-300 shadow-md"
//                 >
//                   Book Appointment Now
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Description Section */}
//         <div className="mt-10 flex justify-center">
//           <div className="bg-grey shadow-md rounded-lg p-8 max-w-[1400px] w-full text-gray-800 text-[15.5px] leading-relaxed">
//             <div
//               className="text-justify"
//               dangerouslySetInnerHTML={{
//                 __html: about?.description || 'No description available.',
//               }}
//             />
//           </div>
//         </div>

//         {/* Who is Astrologer */}
//         <section className="flex max-w-[1400px] mx-auto flex-col md:flex-row justify-between items-start md:p-10 bg-white gap-6 p-4 sm:p-6 rounded-lg shadow-md">
//           <div className="w-full md:w-1/3 space-y-4">
//             {leftServices.map((service, index) => (
//               <Link
//                 key={index}
//                 href={`/${service.city_slug || 'jaipur'}/${service.category_slug || 'astrologer'}/${service.slug}`}
//                 className="flex items-center bg-purple-800 text-white p-3 rounded-lg shadow-md hover:bg-purple-700 hover:text-yellow-300 transition"
//               >
//                 <span className="text-[#fbae3c] text-xl mr-3">⭐</span>
//                 <span className="text-sm md:text-base font-medium">{service.title}</span>
//               </Link>
//             ))}
//             <div className="flex items-start bg-[#fbae3c] text-black p-4 rounded-lg shadow-md mt-4">
//               <span className="text-2xl mr-3">📞</span>
//               <div className="text-sm md:text-base leading-snug">
//                 Are You Tired Of Your Life Problems? & Want To Fix Everything?
//                 <br />
//                 <a
//                   href={`tel:${homeSetting?.phone || '+91-9915014230'}`}
//                   className="text-lg text-purple-900 font-bold block mt-1 hover:underline"
//                 >
//                   CALL NOW
//                 </a>
//               </div>
//             </div>
//           </div>

//           <div className="w-full md:w-1/3 bg-gradient-to-br from-[#fbae3c]/30 via-[#fbae3c]/20 to-[#fbae3c]/10 p-6 border-4 border-[#fbae3c] rounded-xl shadow-lg">
//             <h2 className="text-2xl md:text-3xl font-extrabold text-purple-900 mb-3 text-center">
//               Who Is <span className="text-[#fbae3c]">{astrologerName}</span>?
//             </h2>
//             <p className="text-gray-800 text-sm md:text-base leading-relaxed mb-2 text-justify">
//               {astrologerName} is a renowned astrologer who simplifies the power of astrology by removing myths and misconceptions. His mission is to bring positive change in people&apos;s lives through trusted astrological guidance.
//             </p>
//             <p className="text-gray-800 text-sm md:text-base leading-relaxed text-justify">
//               {homeSetting?.description
//                 ? stripHtml(homeSetting.description)
//                 : 'With years of experience, his clients trust him deeply. He combines dedication with divine science to bring clarity and peace in personal and professional lives.'}
//             </p>
//           </div>

//           <div className="w-full md:w-1/3 space-y-4">
//             {rightServices.map((service, index) => (
//               <Link
//                 key={index}
//                 href={`/${service.city_slug || 'jaipur'}/${service.category_slug || 'astrologer'}/${service.slug}`}
//                 className="flex items-center bg-purple-800 text-white p-3 rounded-lg shadow-md hover:bg-purple-700 hover:text-yellow-300 transition"
//               >
//                 <span className="text-[#fbae3c] text-xl mr-3">⭐</span>
//                 <span className="text-sm md:text-base font-medium">{service.title}</span>
//               </Link>
//             ))}
//             <div className="flex items-start bg-[#fbae3c] text-black p-4 rounded-lg shadow-md mt-4">
//               <span className="text-2xl mr-3">💬</span>
//               <div className="text-sm md:text-base leading-snug">
//                 We Will Transform Your Life And
//                 <br />
//                 <a
//                   href={`https://wa.me/${whatsappNumber}`}
//                   className="text-lg text-purple-900 font-bold block mt-1 hover:underline"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   GIVE ONLINE CHAT
//                 </a>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// }