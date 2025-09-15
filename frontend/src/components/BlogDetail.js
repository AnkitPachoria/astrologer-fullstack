import Image from 'next/image';

export default function BlogDetail({ blog }) {
  // No fetching here — blog is already passed as prop
  if (!blog) return <p>Loading...</p>;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />

      {blog.image && (
        <Image
          src={`${API_URL}${blog.image}`}
          alt={blog.title}
          width={672}
          height={378}
          className="mt-6 w-full max-w-xl rounded-lg shadow"
        />
      )}
    </div>
  );
}