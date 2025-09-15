// app/page.js



// 'use client';

// import { useEffect, useState } from "react";
// import Slider from "@/components/Slider";
// import Banner from "@/components/Banner";
// import CardsSection from "@/components/CardsSection";
// import Advertisement from "@/components/Advertisement";
// import TestimonialsSection from "@/components/TestimonialsSection";
// import AboutSection from "@/components/AboutSection";
// import OurServices from "@/components/OurServices";
// import GuidanceSection from "@/components/GuidanceSection";
// import InsightsSection from "@/components/Insights";
// // import BestSolutionSection from "@/components/BestSolutionSection"; // if needed

// export default function Home() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate component + image loading delay
//     const timeout = setTimeout(() => {
//       setLoading(false);
//     }, 1000); // change if needed
//     return () => clearTimeout(timeout);
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gray-100">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
//       </div>
//     );
//   }

//   return (
//     <main className="mx-auto w-full">
//       <Banner />
//       <CardsSection />
//       <Advertisement />
//       <AboutSection />
//       <Slider />
//       <OurServices />
//       <GuidanceSection />
//       <TestimonialsSection />
//       <InsightsSection />
//       {/* <BestSolutionSection /> */}
//     </main>
//   );
// }














// import Slider from "@/components/Slider";
// import Banner from "../components/Banner";
// import CardsSection from "../components/CardsSection";
// import Advertisement from "../components/Advertisement";
// import TestimonialsSection from "@/components/TestimonialsSection";
// import AboutSection from "@/components/AboutSection";
// import OurServices from "@/components/OurServices";
// import GuidanceSection from "@/components/GuidanceSection";
// import BestSolutionSection from "@/components/BestSolutionSection";
// import InsightsSection from "@/components/Insights";

// export async function generateMetadata() {
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

//   try {
//     const res = await fetch(`${baseUrl}/api/home-setting`, { cache: 'no-store' });
//     if (!res.ok) throw new Error('Failed to fetch home settings');
//     const data = await res.json();

//     return {
//       title: data.seo_title || 'Astrologer Website',
//       description: data.seo_description || 'Astrology services, kundli, vastu, tarot reading',
//       alternates: {
//         canonical: 'https://loveastrosolutions.com/',
//       },
//     };
//   } catch (error) {
//     return {
//       title: 'Astrologer Website',
//       description: 'Astrology services, kundli, vastu, tarot reading',
//     };
//   }
// }

// export default function Home() {
//   return (
//     <main className="mx-auto w-full">
//       <Banner />
//       <CardsSection />
//       <Advertisement />
//       <AboutSection />
//       <Slider />
//       <OurServices />
//       <GuidanceSection />
//       <TestimonialsSection />
//       <InsightsSection />
//       {/* <BestSolutionSection /> */}
//     </main>
//   );
// }







// app/page.tsx (or app/page.jsx if using JS)

import Slider from "@/components/Slider";
import Banner from "../components/Banner";
import CardsSection from "../components/CardsSection";
import Advertisement from "../components/Advertisement";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import OurServices from "@/components/OurServices";
import GuidanceSection from "@/components/GuidanceSection";
import BestSolutionSection from "@/components/BestSolutionSection";
import InsightsSection from "@/components/Insights";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ✅ SEO metadata — SSR only (no client-side)
export async function generateMetadata() {
  try {
    const res = await fetch(`${API_URL}/api/home-setting`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error("Failed to fetch metadata");

    const data = await res.json();

    return {
      title: data.seo_title || 'Astrologer Website',
      description: data.seo_description || 'Astrology services, kundli, vastu, tarot reading',
      alternates: {
        canonical: 'https://loveastrosolutions.com/',
      },
      openGraph: {
        title: data.seo_title,
        description: data.seo_description,
        url: 'https://loveastrosolutions.com/',
        siteName: 'Love Astro Solutions',
      },
    };
  } catch (err) {
    console.error("Metadata fetch error:", err);
    return {
      title: 'Astrologer Website',
      description: 'Astrology services, kundli, vastu, tarot reading',
    };
  }
}

// ✅ Main Page Component — SSR
export default async function Home() {
  let homeData = null;

  try {
    const res = await fetch(`${API_URL}/api/home-setting`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error("Home data fetch failed");

    homeData = await res.json();
  } catch (err) {
    console.error("Page data fetch error:", err);
  }

  return (
    <main className="mx-auto w-full">
      <Banner data={homeData} />
      <CardsSection data={homeData} />
      <Advertisement />
      <AboutSection />
      <Slider />
      <OurServices />
      <GuidanceSection />
      <TestimonialsSection />
      <InsightsSection />
      {/* <BestSolutionSection /> */}
    </main>
  );
}
