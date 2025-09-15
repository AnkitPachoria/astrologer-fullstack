import CategoryPageClient from './CategoryPageClient';
import { notFound } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Always fetch fresh data
export const dynamic = 'force-dynamic';

async function fetchCity(slug) {
  const res = await fetch(`${API_URL}/api/cities?slug=${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function fetchCategory(slug) {
  // Query the category by slug or name
  const res = await fetch(`${API_URL}/api/categories?slug=${slug}&name=${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

// SEO metadata
export async function generateMetadata({ params }) {
  const categoryData = await fetchCategory(params.category);

  if (!categoryData) {
    return {
      title: 'Category Not Found',
      description: 'The requested category was not found.',
    };
  }

  return {
    title: categoryData.seo_title || categoryData.title || categoryData.name || 'Category',
    description: categoryData.seo_description
      ? categoryData.seo_description.slice(0, 160)
      : `Explore services in ${categoryData.name}`,
  };
}

export default async function CategoryPage({ params }) {
  const cityData = await fetchCity(params.city);
  const categoryData = await fetchCategory(params.category);

  if (!cityData || !categoryData) return notFound();

  return <CategoryPageClient cityData={cityData} categoryData={categoryData} />;
}