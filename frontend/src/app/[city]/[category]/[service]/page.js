import ClientService from './ClientService';
import { notFound } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchCity(slug) {
  console.log(`[${new Date().toISOString()}] Fetching city with slug: ${slug}`);
  const res = await fetch(`${API_URL}/api/cities?slug=${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    console.log(`City fetch failed for slug ${slug}: ${res.status}`);
    return null;
  }
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    console.log(`No city found for slug ${slug}`);
    return null;
  }
  console.log(`Fetched city:`, data[0]);
  return data[0];
}

async function fetchCategory(slug) {
  console.log(`[${new Date().toISOString()}] Fetching category with slug: ${slug}`);
  const res = await fetch(`${API_URL}/api/categories?slug=${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    console.log(`Category fetch failed for slug ${slug}: ${res.status}`);
    return null;
  }
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    console.log(`No category found for slug ${slug}`);
    return null;
  }
  console.log(`Fetched category:`, data[0]);
  return data[0];
}

async function fetchService(citySlug, categorySlug, serviceSlug) {
  console.log(`[${new Date().toISOString()}] Fetching service with slugs: city=${citySlug}, category=${categorySlug}, service=${serviceSlug}`);
  const res = await fetch(`${API_URL}/api/services/${citySlug}/${categorySlug}/${serviceSlug}`, { cache: 'no-store' });
  if (!res.ok) {
    console.log(`Service fetch failed for ${citySlug}/${categorySlug}/${serviceSlug}: ${res.status}`);
    return null;
  }
  const data = await res.json();
  if (!data || data.error) {
    console.log(`No service found for ${citySlug}/${categorySlug}/${serviceSlug}`);
    return null;
  }
  // Validate city and category slugs
  if (data.city_slug !== citySlug || data.category_slug !== categorySlug) {
    console.log(`Service mismatch: expected city ${citySlug}, got ${data.city_slug}; expected category ${categorySlug}, got ${data.category_slug}`);
    return null;
  }
  console.log(`Fetched service:`, data);
  return data;
}

// SEO metadata generation
export async function generateMetadata({ params }) {
  const serviceData = await fetchService(params.city, params.category, params.service);
  const cityData = await fetchCity(params.city);

  if (!serviceData || !cityData) {
    return {
      title: 'Service Not Found',
      description: 'The requested service was not found.',
    };
  }

  // Construct SEO title: Append "in [city]" to seo_title or title
  const baseTitle = serviceData.seo_title || serviceData.title || 'Service';
  const cityName = cityData.name || params.city;
  const seoTitle = `${baseTitle} in ${cityName}`;

  return {
    title: seoTitle,
    description: serviceData.seo_description
      ? serviceData.seo_description.slice(0, 160)
      : `Details and information about ${serviceData.title || 'this service'} in ${cityName}`,
  };
}

export default async function ServicePage({ params }) {
  console.log(`[${new Date().toISOString()}] Rendering ServicePage for:`, params);

  const cityData = await fetchCity(params.city);
  const categoryData = await fetchCategory(params.category);
  const serviceData = await fetchService(params.city, params.category, params.service);

  if (!cityData || !categoryData || !serviceData) {
    console.log(`Not found: city=${params.city}, category=${params.category}, service=${params.service}`);
    return notFound();
  }

  return (
    <div>
      <Toaster position="top-right" />
      <ClientService
        cityData={cityData}
        categoryData={categoryData}
        serviceData={serviceData}
        API_URL={API_URL}
      />
    </div>
  );
}