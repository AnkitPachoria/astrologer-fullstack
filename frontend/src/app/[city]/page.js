import ClientCity from './ClientCity';

export async function generateMetadata({ params }) {
  const citySlug = params.city;
  const res = await fetch(`http://localhost:5000/api/cities?slug=${citySlug}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  const city = data?.[0];

  return {
    title: city?.seo_title || `Explore services in ${city?.name || citySlug}`,
    description: city?.seo_description || `Find top-rated service categories in ${city?.name || citySlug}.`,
  };
}

export default function CityPage({ params }) {
  return <ClientCity city={params.city} />;
}
