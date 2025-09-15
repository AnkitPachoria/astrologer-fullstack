'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Image from 'next/image';
import { FaSave, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import ProtectedRoute from '@/components/ProtectedRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function BannerAdmin() {
  const [viewMode, setViewMode] = useState('table'); // Set default to 'table'
  const [banners, setBanners] = useState([]);
  const [formFiles, setFormFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
    mob_image1: null,
    mob_image2: null,
    mob_image3: null,
  });
  const [imagePreviews, setImagePreviews] = useState({
    image1: null,
    image2: null,
    image3: null,
    mob_image1: null,
    mob_image2: null,
    mob_image3: null,
  });
  const [loading, setLoading] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/banner`);
      if (res.status !== 200) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setBanners(data);
    } catch (err) {
      console.error('Fetch banner error:', err);
      toast.error(`Failed to load banners: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormFiles((prev) => ({ ...prev, [name]: files[0] }));
      setImagePreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(files[0]) }));
    }
  };

  const resetForm = () => {
    setFormFiles({
      image1: null,
      image2: null,
      image3: null,
      mob_image1: null,
      mob_image2: null,
      mob_image3: null,
    });
    setImagePreviews({
      image1: null,
      image2: null,
      image3: null,
      mob_image1: null,
      mob_image2: null,
      mob_image3: null,
    });
    setViewMode('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formFiles.image1 && !formFiles.image2 && !formFiles.image3 && 
        !formFiles.mob_image1 && !formFiles.mob_image2 && !formFiles.mob_image3) {
      toast.error('At least one image is required');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      ['image1', 'image2', 'image3', 'mob_image1', 'mob_image2', 'mob_image3'].forEach((key) => {
        if (formFiles[key]) fd.append(key, formFiles[key]);
      });
      const bannerId = banners.length > 0 ? banners[0].id : null;
      const method = bannerId ? 'PUT' : 'POST';
      const url = bannerId ? `${API_URL}/api/banner/${bannerId}` : `${API_URL}/api/banner`;
      const res = await axios({
        method,
        url,
        data: fd,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
      }
      toast.success(bannerId ? 'Banner updated' : 'Banner created');
      resetForm();
      await fetchBanners();
      setViewMode('table');
    } catch (err) {
      console.error('Error saving banner:', err);
      toast.error(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setFormFiles({
      image1: null,
      image2: null,
      image3: null,
      mob_image1: null,
      mob_image2: null,
      mob_image3: null,
    });
    setImagePreviews({
      image1: banner.image1 ? `${API_URL}${banner.image1}` : null,
      image2: banner.image2 ? `${API_URL}${banner.image2}` : null,
      image3: banner.image3 ? `${API_URL}${banner.image3}` : null,
      mob_image1: banner.mob_image1 ? `${API_URL}${banner.mob_image1}` : null,
      mob_image2: banner.mob_image2 ? `${API_URL}${banner.mob_image2}` : null,
      mob_image3: banner.mob_image3 ? `${API_URL}${banner.mob_image3}` : null,
    });
    setViewMode('form');
  };

  const handleDelete = async (id) => {
    if (!confirm('Confirm deletion of banner?')) return;
    try {
      const res = await axios.delete(`${API_URL}/api/banner/${id}`);
      if (res.status !== 200) throw new Error(`Delete failed: ${res.status}`);
      toast.success('Banner deleted');
      await fetchBanners();
    } catch (err) {
      console.error('Error deleting banner:', err);
      toast.error(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleView = (banner) => {
    setSelectedBanner(banner);
  };

  return (
    <ProtectedRoute>
      <div className="container max-w-[1400px] mx-auto p-4 sm:p-6 bg-gray-50 rounded-lg shadow-lg">
        <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <button
            onClick={() => { resetForm(); setViewMode('form'); }}
            disabled={viewMode === 'form'}
            className={`px-6 py-2 rounded-full font-semibold text-white transition duration-300 ${
              viewMode === 'form' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {banners.length > 0 ? 'Update Banner' : 'Add Banner'}
          </button>
          <button
            onClick={() => setViewMode('table')}
            disabled={viewMode === 'table'}
            className={`px-6 py-2 rounded-full font-semibold text-white transition duration-300 ${
              viewMode === 'table' ? 'bg-gray-700' : 'bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            View Banners
          </button>
        </div>

        {viewMode === 'form' && (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
              {banners.length > 0 ? 'Update Banner Images' : 'Add Banner Images'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Desktop Images */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Desktop Images</h2>
                  {['image1', 'image2', 'image3'].map((key, idx) => (
                    <div key={key} className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Desktop Image {idx + 1}
                      </label>
                      <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <input
                          type="file"
                          name={key}
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                          required={banners.length === 0 && idx === 0}
                        />
                        {imagePreviews[key] && (
                          <div className="mt-2">
                            <Image
                              src={imagePreviews[key]}
                              alt={`Desktop Preview ${idx + 1}`}
                              width={150}
                              height={150}
                              className="h-40 w-40 object-cover rounded-lg shadow-md border border-gray-200"
                              onError={(e) => {
                                console.error(`Error loading preview ${key}:`, imagePreviews[key]);
                                e.target.src = '/default-banner.jpg';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column: Mobile Images */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Mobile Images</h2>
                  {['mob_image1', 'mob_image2', 'mob_image3'].map((key, idx) => (
                    <div key={key} className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Mobile Image {idx + 1}
                      </label>
                      <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <input
                          type="file"
                          name={key}
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                        />
                        {imagePreviews[key] && (
                          <div className="mt-2">
                            <Image
                              src={imagePreviews[key]}
                              alt={`Mobile Preview ${idx + 1}`}
                              width={150}
                              height={150}
                              className="h-40 w-40 object-cover rounded-lg shadow-md border border-gray-200"
                              onError={(e) => {
                                console.error(`Error loading preview ${key}:`, imagePreviews[key]);
                                e.target.src = '/default-banner.jpg';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : <><FaSave /> {banners.length > 0 ? 'Update Banner' : 'Add Banner'}</>}
                </button>
                {banners.length > 0 && (
                  <button
                    type="button"
                    onClick={resetForm}
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
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
              Banner List
            </h2>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : banners.length === 0 ? (
              <p className="text-gray-600">No banner data found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">ID</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Desktop Image 1</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Desktop Image 2</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Desktop Image 3</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Mobile Image 1</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Mobile Image 2</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Mobile Image 3</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map((banner) => (
                      <tr key={banner.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 p-2 sm:p-3 text-gray-800">{banner.id}</td>
                        {['image1', 'image2', 'image3', 'mob_image1', 'mob_image2', 'mob_image3'].map((key) => (
                          <td key={key} className="border border-gray-200 p-2 sm:p-3">
                            {banner[key] ? (
                              <Image
                                src={`${API_URL}${banner[key]}`}
                                alt={`${key.startsWith('mob_') ? 'Mobile' : 'Desktop'} Banner ${key}`}
                                width={100}
                                height={100}
                                className="h-24 w-24 object-cover rounded-lg shadow-md border border-gray-200"
                                onError={(e) => {
                                  console.error(`Error loading ${key}:`, banner[key]);
                                  e.target.src = '/default-banner.jpg';
                                }}
                              />
                            ) : (
                              'No Image'
                            )}
                          </td>
                        ))}
                        <td className="border border-gray-200 p-2 sm:p-3 space-x-2">
                          <button
                            onClick={() => handleView(banner)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(banner)}
                            className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition duration-300"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(banner.id)}
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

        {selectedBanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Banner Details</h2>
              <div className="space-y-4">
                <p><strong>ID:</strong> {selectedBanner.id}</p>
                {['image1', 'image2', 'image3', 'mob_image1', 'mob_image2', 'mob_image3'].map((key, idx) => (
                  <div key={key}>
                    <strong>{key.startsWith('mob_') ? 'Mobile' : 'Desktop'} Image {Math.floor(idx % 3) + 1}:</strong>
                    {selectedBanner[key] ? (
                      <Image
                        src={`${API_URL}${selectedBanner[key]}`}
                        alt={`${key.startsWith('mob_') ? 'Mobile' : 'Desktop'} Banner ${key}`}
                        width={300}
                        height={300}
                        className="object-cover rounded-lg shadow-md border border-gray-200 mt-2"
                        onError={(e) => {
                          console.error(`Error loading ${key}:`, selectedBanner[key]);
                          e.target.src = '/default-banner.jpg';
                        }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSelectedBanner(null)}
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
}