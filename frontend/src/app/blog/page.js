"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function InsightsSection() {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  function stripHtmlTags(str) {
    if (!str) return "";
    return str.replace(/<[^>]*>?/gm, "");
  }

  function createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/blogs`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-900 mb-10">
        <span className="border-l-4 border-yellow-400 pl-3">Our Blogs</span>
      </h2>

      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(({ id, title, subtitle, image }) => {
            const slug = createSlug(title);

            return (
              <article
                key={id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer"
                onClick={() => router.push(`/blog/${slug}`)} // <-- fixed
              >
                <div className="h-48 overflow-hidden">
                  <Image
                    src={image ? `${API_URL}${image}` : "/default.jpg"} // <-- fixed
                    alt={title}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">{title}</h3>
                  <p className="text-gray-600 mb-4 flex-1">{stripHtmlTags(subtitle)}</p>
                  <span className="mt-auto inline-block text-sm font-semibold text-purple-900 hover:text-yellow-500 transition">
                    Read More →
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading insights...</p>
      )}
    </section>
  );
}
