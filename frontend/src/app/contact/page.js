// ❌ DO NOT use "use client" here!

import ClientContact from './client-contact';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ✅ Server-only SEO metadata
export async function generateMetadata() {
  try {
    const res = await fetch(`${API_URL}/api/seo`, { cache: 'no-store' });
    const data = await res.json();

    return {
      title: data.seo_title || data.title || 'Contact Us',
      description: data.seo_description || data.description || 'Get in touch with us today.',
    };
  } catch (err) {
    console.error('Metadata SEO fetch error:', err);
    return {
      title: 'Contact Us',
      description: 'Get in touch with us today.',
    };
  }
}

// ✅ Server component
export default async function Page() {
  let seoData = { seo_title: '', seo_description: '' };

  try {
    const res = await fetch(`${API_URL}/api/seo`, { cache: 'no-store' });
    const data = await res.json();
    seoData = {
      seo_title: data.seo_title || '',
      seo_description: data.seo_description || '',
    };
  } catch (err) {
    console.error('Error fetching SEO data:', err);
  }

  return <ClientContact seoTitle={seoData.seo_title} seoDescription={seoData.seo_description} />;
}
 