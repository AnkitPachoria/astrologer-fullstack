'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const BestSolutionAdmin = () => {
  const [solutions, setSolutions] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    subtitle: '',
    note: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSolutions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/best_solution`);
      setSolutions(res.data);
    } catch (error) {
      toast.error(`Failed to fetch solutions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSolutions();
  }, [fetchSolutions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    setPreviewImage(file ? URL.createObjectURL(file) : null);
  };

  const openForm = (solution = null) => {
    if (solution) {
      setFormData({
        id: solution.id,
        title: solution.title,
        subtitle: solution.subtitle || '',
        note: solution.note || '',
        image: null,
      });
      setEditingId(solution.id);
      setPreviewImage(solution.image ? `${API}/uploads/best-solution-image/${solution.image}` : null);
    } else {
      setFormData({ id: null, title: '', subtitle: '', note: '', image: null });
      setEditingId(null);
      setPreviewImage(null);
    }
    setViewMode('form');
  };

  const resetForm = () => {
    setFormData({ id: null, title: '', subtitle: '', note: '', image: null });
    setEditingId(null);
    setPreviewImage(null);
    setViewMode('table');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('note', formData.note);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      setLoading(true);
      const url = editingId
        ? `${API}/api/best_solution/${editingId}`
        : `${API}/api/best_solution`;
      const method = editingId ? 'put' : 'post';

      await axios({
        method,
        url,
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(editingId ? 'Solution updated' : 'Solution created');
      resetForm();
      fetchSolutions();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this solution?')) return;
    try {
      setLoading(true);
      await axios.delete(`${API}/api/best_solution/${id}`);
      toast.success('Solution deleted');
      fetchSolutions();
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
          Add Solution
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-6 py-2 rounded-full font-semibold text-white transition duration-300 ${
            viewMode === 'table' ? 'bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          View Solutions
        </button>
      </div>

      {viewMode === 'form' && (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
            {editingId ? 'Edit Solution' : 'Add New Solution'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Title"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <textarea
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="Subtitle"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Note</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Note"
                  rows={5}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full mt-1 border border-gray-300 rounded-md p-2 text-black"
                />
                {previewImage && (
                  <Image
                    src={previewImage}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="mt-2 h-32 object-cover border rounded-md"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
              >
                {editingId ? 'Update Solution' : 'Add Solution'}
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
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Solutions List</h2>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : solutions.length === 0 ? (
            <p className="text-gray-600">No solutions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Image</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Title</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Subtitle</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Note</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {solutions.map((solution) => (
                    <tr key={solution.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {solution.image ? (
                          <Image
                            src={`${API}${solution.image}`}
                            alt={solution.title}
                            width={80}
                            height={64}
                            className="h-16 w-20 object-cover rounded"
                          />
                        ) : (
                          'No Image'
                        )}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">{solution.title}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black truncate max-w-[200px]">
                        {solution.subtitle}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black truncate max-w-[200px]">
                        {solution.note}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 space-x-2">
                        <button
                          onClick={() => openForm(solution)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(solution.id)}
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
};

export default BestSolutionAdmin;