'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import JoditEditorComponent from '@/components/JoditEditorComponent';
import Image from 'next/image';
import { FaSave, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import ProtectedRoute from '@/components/ProtectedRoute';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    subtitle: '',
    content: '',
    status: 'active',
    image: null,
    seo_title: '',
    seo_description: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API}/api/blogs`);
      setBlogs(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (error) {
      toast.error(`Failed to fetch blogs: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (file && file.size > 5 * 1024 * 1024) {
        toast.error('Image size exceeds 5MB limit');
        return;
      }
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubtitleChange = (newContent) => {
    setFormData((prev) => ({ ...prev, subtitle: newContent }));
  };

  const handleContentChange = (newContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const openForm = (blog = null) => {
    if (blog) {
      setFormData({
        id: blog.id,
        title: blog.title,
        subtitle: blog.subtitle,
        content: blog.content || '',
        status: blog.status,
        image: null,
        seo_title: blog.seo_title || '',
        seo_description: blog.seo_description || '',
      });
      setImagePreview(blog.image ? `${API}${blog.image}` : null);
      setEditItem(blog);
    } else {
      setFormData({
        id: null,
        title: '',
        subtitle: '',
        content: '',
        status: 'active',
        image: null,
        seo_title: '',
        seo_description: '',
      });
      setImagePreview(null);
      setEditItem(null);
    }
    setViewMode('form');
  };

  const resetForm = () => {
    setFormData({
      id: null,
      title: '',
      subtitle: '',
      content: '',
      status: 'active',
      image: null,
      seo_title: '',
      seo_description: '',
    });
    setImagePreview(null);
    setEditItem(null);
    setViewMode('table');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subtitle || !formData.content) {
      toast.error('Title, Subtitle, and Content are required');
      return;
    }
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('content', formData.content);
      data.append('status', formData.status);
      data.append('seo_title', formData.seo_title);
      data.append('seo_description', formData.seo_description);
      if (formData.image && typeof formData.image !== 'string') {
        data.append('image', formData.image);
      }
      const url = formData.id ? `${API}/api/blogs/${formData.id}` : `${API}/api/blogs`;
      const method = formData.id ? 'put' : 'post';
      const res = await axios({
        method,
        url,
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(`Request failed: ${res.status}`);
      }
      toast.success(formData.id ? 'Blog updated' : 'Blog created');
      resetForm();
      fetchBlogs();
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete?')) return;
    try {
      const res = await axios.delete(`${API}/api/blogs/${id}`);
      if (res.status !== 200) throw new Error(`Delete failed: ${res.status}`);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleView = (blog) => {
    setSelectedBlog(blog);
  };

  return (
     <ProtectedRoute>
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50 rounded-lg shadow-lg">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <button
          onClick={() => openForm()}
          className={`px-6 py-2 rounded-full font-semibold text-white transition duration-300 ${
            viewMode === 'form' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Add Blog
        </button>
        <button
          onClick={() => setViewMode('table')}
          disabled={viewMode === 'table'}
          className={`px-6 py-2 rounded-full font-semibold text-white transition duration-300 ${
            viewMode === 'table'
              ? 'bg-gray-700'
              : 'bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          View Blogs
        </button>
      </div>

      {viewMode === 'form' && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
            {editItem ? 'Edit Blog' : 'Add New Blog'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Title"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <JoditEditorComponent
                  value={formData.subtitle}
                  onChange={handleSubtitleChange}
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <JoditEditorComponent
                  value={formData.content}
                  onChange={handleContentChange}
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">SEO Title</label>
                <input
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleChange}
                  placeholder="SEO Title (up to 60 characters)"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">SEO Description</label>
                <textarea
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleChange}
                  placeholder="SEO Description (up to 160 characters)"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Image Upload (Max 5MB)</label>
                <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={150}
                        height={150}
                        className="h-40 w-40 object-cover rounded-lg shadow-md border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 flex items-center gap-2"
              >
                <FaSave /> {editItem ? 'Update Blog' : 'Add Blog'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {viewMode === 'table' && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Blogs List</h2>
          {blogs.length === 0 ? (
            <p className="text-gray-600">No blogs found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Title</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Subtitle</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Content</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Status</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">SEO Title</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">SEO Description</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Image</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800">{blog.title}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          {blog.subtitle.replace(/<[^>]+>/g, '').substring(0, 50)}
                          {blog.subtitle.length > 50 ? '...' : ''}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          {blog.content ? blog.content.replace(/<[^>]+>/g, '').substring(0, 50) : ''}
                          {blog.content && blog.content.length > 50 ? '...' : ''}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800">{blog.status}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          {blog.seo_title ? blog.seo_title.substring(0, 50) : ''}
                          {blog.seo_title && blog.seo_title.length > 50 ? '...' : ''}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          {blog.seo_description ? blog.seo_description.substring(0, 50) : ''}
                          {blog.seo_description && blog.seo_description.length > 50 ? '...' : ''}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3">
                        {blog.image ? (
                          <Image
                            src={`${API}${blog.image}`}
                            alt={blog.title}
                            width={100}
                            height={100}
                            className="h-24 w-24 object-cover rounded-lg shadow-md border border-gray-200"
                          />
                        ) : (
                          'No Image'
                        )}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 space-x-2">
                        <button
                          onClick={() => handleView(blog)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => openForm(blog)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition duration-300"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Blog Details</h2>
            <div className="space-y-4">
              <p><strong>Title:</strong> {selectedBlog.title}</p>
              <div>
                <strong>Subtitle:</strong>
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.subtitle }}
                />
              </div>
              <div>
                <strong>Content:</strong>
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content || 'No content' }}
                />
              </div>
              <p><strong>Status:</strong> {selectedBlog.status}</p>
              <p><strong>SEO Title:</strong> {selectedBlog.seo_title || 'N/A'}</p>
              <p><strong>SEO Description:</strong> {selectedBlog.seo_description || 'N/A'}</p>
              <div>
                <strong>Image:</strong>
                {selectedBlog.image ? (
                  <Image
                    src={`${API}${selectedBlog.image}`}
                    alt={selectedBlog.title}
                    width={300}
                    height={300}
                    className="object-cover rounded-lg shadow-md border border-gray-200 mt-2"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedBlog(null)}
              className="mt-4 bg-gray-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
};

export default AdminBlog;