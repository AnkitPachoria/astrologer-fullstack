'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientBlogDetail({ slug }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  function stripHtmlTags(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>?/gm, '');
  }

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`${API_URL}/api/blogs`);
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const data = await res.json();

        const createSlug = (title) =>
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const foundBlog = data.find((b) => createSlug(b.title) === slug);

        if (!foundBlog) throw new Error('Blog not found');

        setBlog(foundBlog);
      } catch (error) {
        alert(error.message);
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [slug, router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!blog) return <p className="text-center mt-10">Blog not found.</p>;

  return (
    <div className="max-w-[1400px] mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 text-purple-900 hover:text-yellow-500"
      >
        ← Back
      </button>

      <div
        className="relative h-96 rounded-lg overflow-hidden mb-12"
        style={{
          backgroundImage: blog.image ? `url(${API_URL}${blog.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="absolute bottom-6 left-6 z-10 max-w-3xl">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2">{blog.title}</h1>
          {blog.subtitle && (
            <p className="text-lg text-gray-300 drop-shadow-md">{stripHtmlTags(blog.subtitle)}</p>
          )}
        </div>
      </div>

      <div
        className="prose max-w-none mx-auto"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}



// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import Head from 'next/head';

// export default function BlogDetailPage({ params }) {
//   const { slug } = params;
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   function stripHtmlTags(str) {
//     if (!str) return '';
//     return str.replace(/<[^>]*>?/gm, '');
//   }

//   useEffect(() => {
//     async function fetchBlog() {
//       try {
//         const res = await fetch('http://localhost:5000/api/blogs');
//         if (!res.ok) throw new Error('Failed to fetch blogs');
//         const data = await res.json();

//         const createSlug = (title) =>
//           title
//             .toLowerCase()
//             .replace(/[^a-z0-9]+/g, '-')
//             .replace(/^-+|-+$/g, '');

//         const foundBlog = data.find((b) => createSlug(b.title) === slug);

//         if (!foundBlog) throw new Error('Blog not found');

//         setBlog(foundBlog);
//       } catch (error) {
//         alert(error.message);
//         router.push('/');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchBlog();
//   }, [slug, router]);

//   if (loading) return <p className="text-center mt-10">Loading...</p>;
//   if (!blog) return <p className="text-center mt-10">Blog not found.</p>;

//   return (
//     <>
//       <Head>
//         <title>{blog.seo_title || blog.title}</title>
//         <meta name="description" content={blog.seo_description || stripHtmlTags(blog.subtitle)} />
//       </Head>
//       <div className="max-w-[1400px] mx-auto p-6">
//         <button
//           onClick={() => router.back()}
//           className="mb-6 text-purple-900 hover:text-yellow-500"
//         >
//           ← Back
//         </button>

//         {/* Background image with gradient overlay at bottom */}
//         <div
//           className="relative h-96 rounded-lg overflow-hidden mb-12"
//           style={{
//             backgroundImage: blog.image
//               ? `url(http://localhost:5000${blog.image})`
//               : 'none',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//           }}
//         >
//           {/* Gradient overlay only at bottom */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

//           {/* Title and subtitle at bottom-left */}
//           <div className="absolute bottom-6 left-6 z-10 max-w-3xl">
//             <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2">
//               {blog.title}
//             </h1>
//             {blog.subtitle && (
//               <p className="text-lg text-gray-300 drop-shadow-md">{stripHtmlTags(blog.subtitle)}</p>
//             )}
//           </div>
//         </div>

//         {/* Blog content */}
//         <div
//           className="prose max-w-none mx-auto"
//           dangerouslySetInnerHTML={{ __html: blog.content }}
//         />
//       </div>
//     </>
//   );
//}
