"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import ProtectedRoute from '@/components/ProtectedRoute';
export default function AwardsManager() {
  const [awards, setAwards] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    short_description: "",
    image: null,
    status: 1,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const JoditEditorComponent = dynamic(() => import("@/components/JoditEditorComponent"), {
    ssr: false,
  });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchAwards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/awards`);
      setAwards(res.data);
    } catch (err) {
      toast.error(`Failed to fetch awards: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchAwards();
  }, [fetchAwards]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size exceeds 5MB limit");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDescriptionChange = (newContent) => {
    setFormData((prev) => ({ ...prev, short_description: newContent }));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      short_description: "",
      image: null,
      status: 1,
    });
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "image" && formData[key] != null) {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (formData.image && typeof formData.image !== "string") {
        formDataToSend.append("image", formData.image);
      } else if (formData.existingImage) {
        formDataToSend.append("image", formData.existingImage);
      }
      setLoading(true);
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${API_URL}/api/awards/${formData.id}`
        : `${API_URL}/api/awards`;
      const res = await axios({
        method,
        url,
        data: formDataToSend,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(isEditing ? "Award updated" : "Award created");
      resetForm();
      setViewMode("table");
      await fetchAwards();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (award) => {
    setFormData({
      ...award,
      image: null,
      existingImage: award.image,
    });
    setImagePreview(award.image ? `${API_URL}${award.image}` : null);
    setIsEditing(true);
    setViewMode("form");
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirm deletion?")) return;
    try {
      setLoading(true);
      const res = await axios.delete(`${API_URL}/api/awards/${id}`);
      toast.success("Award deleted");
      await fetchAwards();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (award) => {
    try {
      const updatedStatus = award.status === 1 ? 0 : 1;
      const formDataToSend = new FormData();
      Object.keys(award).forEach((key) => {
        if (key !== "status" && key !== "image" && award[key] != null) {
          formDataToSend.append(key, award[key]);
        }
      });
      formDataToSend.append("status", updatedStatus);
      if (award.image) {
        formDataToSend.append("image", award.image);
      }
      setLoading(true);
      const res = await axios.put(`${API_URL}/api/awards/${award.id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Status updated");
      await fetchAwards();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
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
          onClick={() => {
            resetForm();
            setViewMode("form");
          }}
          className={`px-6 py-2 rounded-full font-semibold text-white transition duration-300 ${
            viewMode === "form"
              ? "bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Add Award
        </button>
        <button
          onClick={() => setViewMode("table")}
          className={`px-6 py-2 rounded-full font-semibold text-white transition duration-300 ${
            viewMode === "table"
              ? "bg-gray-700"
              : "bg-gray-500 hover:bg-gray-600"
          }`}
        >
          View Details
        </button>
      </div>

      {viewMode === "form" && (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
            {isEditing ? "Edit Award" : "Add New Award"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image Upload (Max 5MB)
                </label>
                <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <div>
                      <p className="text-sm text-gray-600">
                        {imagePreview.includes("blob")
                          ? "New Image"
                          : imagePreview.split("/Uploads/").pop() || "No image"}
                      </p>
                      <Image
                        src={imagePreview.includes("blob") ? imagePreview : `${API_URL}${formData.existingImage}`}
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
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <JoditEditorComponent
                  value={formData.short_description}
                  onChange={handleDescriptionChange}
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="flex items-center mt-2">
                  <span className="mr-2 text-sm text-gray-600">
                    {formData.status === 1 ? "Active" : "Inactive"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status === 1}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          status: prev.status === 1 ? 0 : 1,
                        }))
                      }
                      className="sr-only"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition duration-200">
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow transform transition duration-200 ${
                          formData.status === 1 ? "translate-x-5" : "translate-x-0"
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
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-60 transition duration-300"
              >
                {isEditing ? "Update Award" : "Add Award"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setViewMode("table");
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

      {viewMode === "table" && (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
            Awards List
          </h2>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : awards.length === 0 ? (
            <p className="text-gray-600">No awards found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      ID
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Title
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Description
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Image
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Status
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {awards.map((award) => (
                    <tr key={award.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {award.id}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {award.title}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          {award.short_description.replace(/<[^>]+>/g, "").substring(0, 50)}
                          {award.short_description.length > 50 ? "..." : ""}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3">
                        {award.image ? (
                          <Image
                            src={`${API_URL}${award.image}`}
                            alt={award.title}
                            width={48}
                            height={48}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">
                            {award.status === 1 ? "Active" : "Inactive"}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={award.status === 1}
                              onChange={() => handleStatusToggle(award)}
                              className="sr-only"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition duration-200">
                              <div
                                className={`w-5 h-5 bg-white rounded-full shadow transform transition duration-200 ${
                                  award.status === 1 ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </div>
                          </label>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 space-x-2">
                        <button
                          onClick={() => handleEdit(award)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(award.id)}
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