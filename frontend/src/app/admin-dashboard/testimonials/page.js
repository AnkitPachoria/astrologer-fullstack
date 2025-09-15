'use client';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import JoditEditorComponent from '@/components/JoditEditorComponent';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function TestimonialsAdmin() {
  const [list, setList] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', country: '', description: '', date: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/testimonials`);
      setList(res.data);
    } catch (error) {
      toast.error(`Failed to fetch testimonials: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const openForm = (item = null) => {
    setEditItem(item);
    setForm({
      name: item?.name || '',
      country: item?.country || '',
      description: item?.description || '',
      date: item?.date?.slice(0, 10) || '',
      image: null,
    });
    setImagePreview(item?.image ? `${API}${item.image}` : null);
    setViewMode('form');
  };

  const resetForm = () => {
    setForm({ name: '', country: '', description: '', date: '', image: null });
    setImagePreview(null);
    setEditItem(null);
    setViewMode('table');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size exceeds 5MB limit');
        return;
      }
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDescriptionChange = (newContent) => {
    setForm((prev) => ({ ...prev, description: newContent }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.country || !form.description || !form.date) {
      toast.error('All fields are required');
      return;
    }
    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v != null) fd.append(k, v);
      });
      if (editItem && !form.image && editItem.image) {
        fd.append('existingImage', editItem.image);
      }
      const url = editItem ? `${API}/api/testimonials/${editItem.id}` : `${API}/api/testimonials`;
      const method = editItem ? axios.put : axios.post;
      await method(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(editItem ? 'Testimonial updated' : 'Testimonial created');
      await fetchList();
      resetForm();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Confirm deletion?')) return;
    try {
      setLoading(true);
      await axios.delete(`${API}/api/testimonials/${id}`);
      toast.success('Testimonial deleted');
      await fetchList();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
    <div className="container mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <button
          onClick={() => openForm()}
          className={`px-6 py-2 rounded-full font-semibold text-white transition duration-300 ${
            viewMode === 'form' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Add Testimonial
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-6 py-2 rounded-full font-semibold text-white transition duration-300 ${
            viewMode === 'table' ? 'bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          View Testimonials
        </button>
      </div>

      {viewMode === 'form' && (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
            {editItem ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  required
                  name="country"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <JoditEditorComponent
                  value={form.description}
                  onChange={handleDescriptionChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  required
                  name="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Image Upload (Max 5MB)</label>
                <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <div>
                      <p className="text-sm text-gray-600">
                        {imagePreview.includes('blob') ? 'New Image' : imagePreview.split('/uploads/').pop() || 'No image'}
                      </p>
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="h-20 w-20 object-cover rounded-md shadow mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-60"
              >
                {editItem ? 'Update Testimonial' : 'Add Testimonial'}
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
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Testimonials List</h2>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : list.length === 0 ? (
            <p className="text-gray-600">No testimonials found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Name</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Country</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Date</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Image</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Description</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">{item.name}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">{item.country}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">{item.date?.slice(0, 10)}</td>
                      <td className="border border-gray-200 p-2 sm:p-3">
                        {item.image ? (
                          <Image
                            src={`${API}${item.image}`}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                        ) : (
                          'No Image'
                        )}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          {item.description.replace(/<[^>]+>/g, '').substring(0, 50)}
                          {item.description.length > 50 ? '...' : ''}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 space-x-2">
                        <button
                          onClick={() => openForm(item)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                        >
                          Delete
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
    </div>
    </ProtectedRoute>
  );
}