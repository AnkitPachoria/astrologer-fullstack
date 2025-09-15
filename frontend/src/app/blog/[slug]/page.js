import ClientBlogDetail from './ClientBlogDetail';

export async function generateMetadata({ params }) {
  const slug = params.slug;

  try {
    const res = await fetch('http://localhost:5000/api/blogs', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch blogs');
    const data = await res.json();

    const createSlug = (title) =>
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const blog = data.find((b) => createSlug(b.title) === slug);

    if (!blog) throw new Error('Blog not found');

    return {
      title: blog.seo_title || blog.title,
      description: (blog.seo_description || blog.subtitle || '').replace(/<[^>]*>?/gm, ''),
    };
  } catch {
    return {
      title: 'Blog not found',
      description: 'Blog details are not available',
    };
  }
}

export default function BlogPage({ params }) {
  return <ClientBlogDetail slug={params.slug} />;
}
