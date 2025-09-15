'use client';

import { useEffect, useState, useCallback } from 'react';
import JoditEditorComponent from '@/components/JoditEditorComponent';
import { Toaster, toast } from 'react-hot-toast';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
export default function CityPage() {
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    title: '',
    sub_title: '',
    slug: '', 
    description: '',
    seo_title: '',
    seo_description: '',
    image: null,
    status: 1,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [imagePreview, setImagePreview] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchCities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/cities`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch cities');
      const data = await res.json();
      setCities(data);
    } catch (error) {
      toast.error(`Failed to fetch cities: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  // Function to generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      // Automatically generate slug when city name changes
      if (name === 'name') {
        updatedFormData.slug = generateSlug(value);
      }
      return updatedFormData;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size exceeds 5MB limit');
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDescriptionChange = (newContent) => {
    setFormData((prev) => ({ ...prev, description: newContent }));
  };
 
  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      title: '',
      sub_title: '',
      slug: '',
      description: '',
      seo_title: '',
      seo_description: '',
      image: null,
      status: 1,
    });
    setImagePreview(null);
    setIsEditing(false);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      toast.error('Name and Slug are required');
      return;
    }
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== 'image' && formData[key] != null) {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (formData.image && typeof formData.image !== 'string') {
        formDataToSend.append('image', formData.image);
      } else if (formData.existingImage) {
        formDataToSend.append('image', formData.existingImage);
      }
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API_URL}/api/cities/${formData.id}` : `${API_URL}/api/cities`;
      const res = await fetch(url, { method, body: formDataToSend });
      if (!res.ok) throw new Error(await res.text());
      toast.success(isEditing ? 'City updated' : 'City created');
      resetForm();
      setViewMode('table');
      await fetchCities();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleEdit = (city) => {
    setFormData({
      ...city,
      image: null,
      existingImage: city.image,
    });
    setImagePreview(city.image ? `${API_URL}${city.image}` : null);
    setIsEditing(true);
    setViewMode('form');
  };

  const handleDelete = async (id) => {
    if (!confirm('Confirm deletion?')) return;
    try {
      const res = await fetch(`${API_URL}/api/cities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('City deleted');
      await fetchCities();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleStatusToggle = async (city) => {
    try {
      const updatedStatus = city.status === 1 ? 0 : 1;
      const formDataToSend = new FormData();
      Object.keys(city).forEach((key) => {
        if (key !== 'status' && key !== 'image' && city[key] != null) {
          formDataToSend.append(key, city[key]);
        }
      });
      formDataToSend.append('status', updatedStatus);
      if (city.image) {
        formDataToSend.append('image', city.image);
      }
      const res = await fetch(`${API_URL}/api/cities/${city.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success('Status updated');
      await fetchCities();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <ProtectedRoute>
    <div className="container  max-w-[1400px]  mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <button
          onClick={() => {
            resetForm();
            setViewMode('form');
          }}
          className={`px-6 py-2 font-semibold text-white transition duration-300 ${
            viewMode === 'form' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          }`} 
        > 
          Add City
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-6 py-2 font-semibold text-white transition duration-300 ${
            viewMode === 'table' ? 'bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          View Details
        </button>
      </div>
             
      {viewMode === 'form' && (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
            {isEditing ? 'Edit City' : 'Add New City'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">City Name</label>
                <input
                  name="name"
                  placeholder="City Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug (Unique)</label>
                <input
                  name="slug"
                  placeholder="Slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sub Title</label>
                <input
                  name="sub_title"
                  placeholder="Sub Title"
                  value={formData.sub_title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SEO Title</label>
                <input
                  name="seo_title"
                  placeholder="SEO Title"
                  value={formData.seo_title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SEO Description</label>
                <input
                  name="seo_description"
                  placeholder="SEO Description"
                  value={formData.seo_description}
                  onChange={handleChange}
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
                        {imagePreview.includes('blob') ? 'New Image' : imagePreview.split('/Uploads/').pop() || 'No image'}
                      </p>
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={80} 
                        height={80}
                        className="object-cover rounded-md shadow mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <JoditEditorComponent value={formData.description} onChange={handleDescriptionChange} />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="flex items-center mt-2">
                  <span className="mr-2 text-sm text-gray-600">{formData.status === 1 ? 'Active' : 'Inactive'}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status === 1}
                      onChange={() => setFormData((prev) => ({ ...prev, status: prev.status === 1 ? 0 : 1 }))}
                      className="sr-only"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition duration-200">
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow transform transition duration-200 ${
                          formData.status === 1 ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
              >
                {isEditing ? 'Update City' : 'Add City'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setViewMode('table');
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {viewMode === 'table' && (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Cities List</h2>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : cities.length === 0 ? (
            <p className="text-gray-600">No cities found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">ID</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Name</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Title</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Sub Title</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Slug</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Description</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">SEO Title</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">SEO Description</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Image</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Status</th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city) => (
                    <tr key={city.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">{city.id}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">{city.name}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">{city.title || '-'}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">{city.sub_title || '-'}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">{city.slug}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          {city.description.replace(/<[^>]+>/g, '').substring(0, 50)}
                          {city.description.length > 50 ? '...' : ''}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">{city.seo_title || '-'}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          {city.seo_description?.substring(0, 50)}
                          {city.seo_description?.length > 50 ? '...' : ''}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3">
                        {city.image ? (
                          <Image
                            src={`${API_URL}${city.image}`}
                            alt={city.name}
                            width={48}
                            height={48}
                            className="object-cover rounded-md"
                          />
                        ) : (
                          'No Image'
                        )}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">{city.status === 1 ? 'Active' : 'Inactive'}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={city.status === 1}
                              onChange={() => handleStatusToggle(city)}
                              className="sr-only"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition duration-200">
                              <div
                                className={`w-5 h-5 bg-white rounded-full shadow transform transition duration-200 ${
                                  city.status === 1 ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </div>
                          </label>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 space-x-2">
                        <button
                          onClick={() => handleEdit(city)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(city.id)}
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