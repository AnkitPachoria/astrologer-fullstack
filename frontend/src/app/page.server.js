// This file handles SEO
export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${baseUrl}/api/home-setting`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch home settings');
    const data = await res.json();

    return {
      title: data.seo_title || 'Astrologer Website',
      description: data.seo_description || 'Astrology services, kundli, vastu, tarot reading',
      alternates: {
        canonical: 'https://loveastrosolutions.com',
      },
    };
  } catch (error) {
    return {
      title: 'Astrologer Website',
      description: 'Astrology services, kundli, vastu, tarot reading',
    };
  }
}
