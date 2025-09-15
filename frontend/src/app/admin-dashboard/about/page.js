"use client";

import { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FaSave, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";
import ProtectedRoute from '@/components/ProtectedRoute';
const JoditEditorComponent = dynamic(() => import("@/components/JoditEditorComponent"), {
  ssr: false,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AboutForm() {
  const [formData, setFormData] = useState({
    id: null,
    short_title: "",
    title: "",
    subtitle: "",
    description: "",
    note: "",
    image: null,
    seo_title: "",
    seo_description: "",
    existingImage: null,
  });
  const [abouts, setAbouts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [viewMode, setViewMode] = useState("form");
  const [selectedAbout, setSelectedAbout] = useState(null);
  const router = useRouter();

  const fetchAbouts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/about/all`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      const aboutsArray = Array.isArray(data) ? data : [data];
      setAbouts(aboutsArray);
      if (aboutsArray.length > 0) {
        const about = aboutsArray[0];
        setFormData({
          id: about.id,
          short_title: about.short_title || "",
          title: about.title || "",
          subtitle: about.subtitle || "",
          description: about.description || "",
          note: about.note || "",
          image: null,
          seo_title: about.seo_title || "",
          seo_description: about.seo_description || "",
          existingImage: about.image || null,
        });
        setImagePreview(about.image ? `${API_URL}${about.image}` : null);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(`Fetch error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbouts();
  }, [fetchAbouts]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    if (files) {
      setImagePreview(files[0] ? URL.createObjectURL(files[0]) : null);
    }
  };

  const handleDescriptionChange = (newContent) => {
    setFormData((prev) => ({ ...prev, description: newContent }));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      short_title: "",
      title: "",
      subtitle: "",
      description: "",
      note: "",
      image: null,
      seo_title: "",
      seo_description: "",
      existingImage: null,
    });
    setImagePreview(null);
    setIsEditing(false);
    setViewMode("form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.short_title ||
      !formData.title ||
      !formData.subtitle ||
      !formData.description ||
      !formData.note ||
      !formData.seo_title ||
      !formData.seo_description
    ) {
      toast.error("All fields are required except image");
      return;
    }
    if (!formData.id) {
      toast.error("No about data to update");
      return;
    }
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "image" && formData[key] != null && formData[key] !== 'undefined') {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      // Always send existingImage if it exists
      if (formData.existingImage) {
        formDataToSend.append("existingImage", formData.existingImage);
      }
      // Log FormData for debugging
      console.log('Sending PUT request with:', Object.fromEntries(formDataToSend));
      const res = await fetch(`${API_URL}/api/about/${formData.id}`, {
        method: "PUT",
        body: formDataToSend,
      });
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || `Request failed: ${res.status}`);
      }
      toast.success("About data updated");
      resetForm();
      await fetchAbouts();
      setViewMode("table");
    } catch (error) {
      console.error('Error updating about:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (about) => {
    setFormData({
      id: about.id,
      short_title: about.short_title || "",
      title: about.title || "",
      subtitle: about.subtitle || "",
      description: about.description || "",
      note: about.note || "",
      image: null,
      seo_title: about.seo_title || "",
      seo_description: about.seo_description || "",
      existingImage: about.image || null,
    });
    setImagePreview(about.image ? `${API_URL}${about.image}` : null);
    setIsEditing(true);
    setViewMode("form");
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirm deletion?")) return;
    try {
      const res = await fetch(`${API_URL}/api/about/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      toast.success("About data deleted");
      await fetchAbouts();
    } catch (error) {
      console.error('Error deleting about:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleView = (about) => {
    setSelectedAbout(about);
  };

  return (
     <ProtectedRoute>
    <div className="container w-full mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        {abouts.length === 0 && (
          <button
            onClick={() => {
              resetForm();
              setViewMode("form");
            }}
            className="px-6 py-2 rounded-full font-semibold text-white bg-gray-400 cursor-not-allowed"
            disabled
          >
            Add About
          </button>
        )}
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
            Edit About Section
          </h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Short Title
                </label>
                <input
                  name="short_title"
                  placeholder="Short Title"
                  value={formData.short_title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subtitle
                </label>
                <input
                  name="subtitle"
                  placeholder="Subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SEO Title
                </label>
                <input
                  name="seo_title"
                  placeholder="SEO Title"
                  value={formData.seo_title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <JoditEditorComponent
                  value={formData.description}
                  onChange={handleDescriptionChange}
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  SEO Description
                </label>
                <textarea
                  name="seo_description"
                  placeholder="SEO Description"
                  value={formData.seo_description}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Note
                </label>
                <textarea
                  name="note"
                  placeholder="Note"
                  value={formData.note}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image Upload (Optional)
                </label>
                <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <div>
                      <p className="text-sm text-gray-600">
                        Current Image:{" "}
                        {imagePreview.split("/Uploads/about-image/").pop() || "No image"}
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
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <FaSave /> Update About
                  </>
                )}
              </button>
              {isEditing && (
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

      {viewMode === "table" && (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
            About List
          </h2>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : abouts.length === 0 ? (
            <p className="text-gray-600">No about data found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      ID
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Short Title
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Title
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Subtitle
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Description
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      SEO Title
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      SEO Description
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Note
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Image
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {abouts.map((about) => (
                    <tr key={about.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {about.id}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {about.short_title || "N/A"}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {about.title || "N/A"}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {about.subtitle || "N/A"}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          {about.description
                            ? about.description.replace(/<[^>]+>/g, "").substring(0, 50)
                            : "N/A"}
                          {about.description && about.description.length > 50 ? "..." : ""}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          {about.seo_title ? about.seo_title.substring(0, 50) : "N/A"}
                          {about.seo_title && about.seo_title.length > 50 ? "..." : ""}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          {about.seo_description ? about.seo_description.substring(0, 50) : "N/A"}
                          {about.seo_description && about.seo_description.length > 50 ? "..." : ""}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          {about.note ? about.note.substring(0, 50) : "N/A"}
                          {about.note && about.note.length > 50 ? "..." : ""}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3">
                        {about.image ? (
                          <Image
                            src={`${API_URL}${about.image}`}
                            alt={about.short_title || "About Image"}
                            width={48}
                            height={48}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 space-x-2">
                        <button
                          onClick={() => handleView(about)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(about)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition duration-300"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(about.id)}
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

      {selectedAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              About Details
            </h2>
            <div className="space-y-4">
              <p>
                <strong>ID:</strong> {selectedAbout.id}
              </p>
              <p>
                <strong>Short Title:</strong> {selectedAbout.short_title || "N/A"}
              </p>
              <p>
                <strong>Title:</strong> {selectedAbout.title || "N/A"}
              </p>
              <p>
                <strong>Subtitle:</strong> {selectedAbout.subtitle || "N/A"}
              </p>
              <div>
                <strong>Description:</strong>
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: selectedAbout.description || "N/A",
                  }}
                />
              </div>
              <p>
                <strong>SEO Title:</strong> {selectedAbout.seo_title || "N/A"}
              </p>
              <p>
                <strong>SEO Description:</strong> {selectedAbout.seo_description || "N/A"}
              </p>
              <p>
                <strong>Note:</strong> {selectedAbout.note || "N/A"}
              </p>
              <div>
                <strong>Image:</strong>
                {selectedAbout.image ? (
                  <Image
                    src={`${API_URL}${selectedAbout.image}`}
                    alt={selectedAbout.short_title || "About Image"}
                    width={200}
                    height={200}
                    className="object-cover rounded-md mt-2"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedAbout(null)}
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