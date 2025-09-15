'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function InsightsSection() {
  const [blogs, setBlogs] = useState([]);
  const [homeSetting, setHomeSetting] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  function stripHtmlTags(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>?/gm, '');
  }

  function createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/blogs`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setBlogs(data.slice(0, 3)); // Limit to 3 blogs
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setBlogs([]);
    }
  }, []);

  const fetchHomeSetting = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/home-setting`);
      setHomeSetting(res.data);
    } catch (err) {
      console.error('Error fetching home setting:', err);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchBlogs(), fetchHomeSetting()]).finally(() => setLoading(false));
  }, [fetchBlogs, fetchHomeSetting]);

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-12">
      {/* Blog Section Title */}
      <h2 
        className="text-3xl md:text-4xl font-bold text-center mb-2"
        style={{ color: homeSetting?.heading_color || '#000000' }}
      >
        <span className="border-l-4 border-yellow-400 pl-3">
          {homeSetting?.blog_title || 'Astrology Insights'}
        </span>
      </h2>

      {/* Blog Description */}
      <p className="text-center text-sm text-gray-600 mb-10 max-w-2xl mx-auto">
        {homeSetting?.blog_description || 'Explore our latest insights, tips, and articles to understand how astrology can impact and guide your life.'}
      </p>

      {/* Blog Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading insights...</p>
      ) : blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(({ id, title, subtitle, image }) => {
              const slug = createSlug(title);

              return (
                <article
                  key={id}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer"
                  onClick={() => router.push(`/blog/${slug}`)}
                >
                  <div className="h-48 overflow-hidden">
                    <Image
                      src={image ? `${API_URL}${image}` : '/default.jpg'}
                      alt={title}
                      width={400}
                      height={192}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color: homeSetting?.heading_color || '#000000' }}
                    >
                      {title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-1">{stripHtmlTags(subtitle)}</p>
                    <span
                      className="mt-auto inline-block text-sm font-semibold hover:text-yellow-500 transition"
                      style={{ color: homeSetting?.heading_color || '#000000' }}
                    >
                      Read More →
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* 🌟 Explore More Button */}
          <div className="flex justify-center mt-10">
<Link
  href="/blog"
  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-full transition-colors duration-300"
>
  Explore More
</Link>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No insights found.</p>
      )}
    </section>
  );
}