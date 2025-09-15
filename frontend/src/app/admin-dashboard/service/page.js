"use client";

import { useEffect, useState, useCallback } from "react";
import JoditEditorComponent from "@/components/JoditEditorComponent";
import { Toaster, toast } from "react-hot-toast";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import ProtectedRoute from '@/components/ProtectedRoute';
export default function ServicePage() {
  const [services, setServices] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    city_id: "",
    category_id: "",
    title: "",
    sub_title: "",
    slug: "",
    description: "",
    seo_title: "",
    seo_description: "",
    image: null,
    status: 1,
    faqs: [], // Initialize faqs as an empty array
  });
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [imagePreview, setImagePreview] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchCities = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/cities`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch cities");
      const data = await res.json();
      setCities(data);
    } catch (error) {
      toast.error(`Failed to fetch cities: ${error.message}`);
    }
  }, [API_URL]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error(`Failed to fetch categories: ${error.message}`);
    }
  }, [API_URL]);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/services`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      toast.error(`Failed to fetch services: ${error.message}`);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCities();
    fetchCategories();
    fetchServices();
  }, [fetchCities, fetchCategories, fetchServices]);

  // Function to generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      // Automatically generate slug when title changes
      if (name === "title") {
        updatedFormData.slug = generateSlug(value);
      }
      return updatedFormData;
    });
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
    setFormData((prev) => ({ ...prev, description: newContent }));
  };

  // Handle FAQ changes
  const handleFaqChange = (index, field, value) => {
    setFormData((prev) => {
      const newFaqs = [...prev.faqs];
      newFaqs[index] = { ...newFaqs[index], [field]: value };
      return { ...prev, faqs: newFaqs };
    });
  };

  // Add new FAQ
  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  // Remove FAQ
  const removeFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      city_id: "",
      category_id: "",
      title: "",
      sub_title: "",
      slug: "",
      description: "",
      seo_title: "",
      seo_description: "",
      image: null,
      status: 1,
      faqs: [], // Reset faqs
    });
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.city_id ||
      !formData.category_id ||
      !formData.title ||
      !formData.slug
    ) {
      toast.error("City, Category, Title, and Slug are required");
      return;
    }
    // Validate FAQs
    if (formData.faqs.length > 0) {
      for (const faq of formData.faqs) {
        if (!faq.question || !faq.answer) {
          toast.error("Each FAQ must have a question and answer");
          return;
        }
      }
    }
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "faqs") {
          formDataToSend.append("faqs", JSON.stringify(formData.faqs)); // Stringify faqs
        } else if (key !== "image" && formData[key] != null) {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (formData.image && typeof formData.image !== "string") {
        formDataToSend.append("image", formData.image);
      } else if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${API_URL}/api/services/${formData.id}`
        : `${API_URL}/api/services`;
      const res = await fetch(url, { method, body: formDataToSend });
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.error || "Request failed");
      toast.success(isEditing ? "Service updated" : "Service created");
      resetForm();
      setViewMode("table");
      await fetchServices();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleEdit = (service) => {
    let faqs = [];
    if (service.faqs) {
      try {
        faqs =
          typeof service.faqs === "string"
            ? JSON.parse(service.faqs)
            : service.faqs;
        if (!Array.isArray(faqs)) {
          faqs = [];
        }
      } catch (error) {
        console.error("Error parsing FAQs:", error);
        faqs = [];
      }
    }
    setFormData({
      ...service,
      image: null,
      existingImage: service.image,
      faqs,
    });
    setImagePreview(service.image ? `${API_URL}${service.image}` : null);
    setIsEditing(true);
    setViewMode("form");
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirm deletion?")) return;
    try {
      const res = await fetch(`${API_URL}/api/services/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Service deleted");
      await fetchServices();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleStatusToggle = async (service) => {
    try {
      const updatedStatus = service.status === 1 ? 0 : 1;
      const formDataToSend = new FormData();
      Object.keys(service).forEach((key) => {
        if (key === "faqs") {
          formDataToSend.append("faqs", JSON.stringify(service.faqs || []));
        } else if (
          key !== "status" &&
          key !== "image" &&
          service[key] != null
        ) {
          formDataToSend.append(key, service[key]);
        }
      });
      formDataToSend.append("status", updatedStatus);
      if (service.image) {
        formDataToSend.append("image", service.image);
      }
      const res = await fetch(`${API_URL}/api/services/${service.id}`, {
        method: "PUT",
        body: formDataToSend,
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Status updated");
      await fetchServices();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
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
          Add Service
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
            {isEditing ? "Edit Service" : "Add New Service"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <select
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
                  Sub Title
                </label>
                <input
                  name="sub_title"
                  placeholder="Sub Title"
                  value={formData.sub_title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <input
                  name="slug"
                  placeholder="Slug"
                  value={formData.slug}
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
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <div>
                      <p className="text-sm text-gray-600">
                        {imagePreview.includes("blob")
                          ? "New Image"
                          : imagePreview.split("/uploads/").pop() || "No image"}
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
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <JoditEditorComponent
                  value={formData.description}
                  onChange={handleDescriptionChange}
                />
              </div>
              {/* SEO Information Section */}
              <div className="col-span-1 sm:col-span-2">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
                  SEO Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      SEO Title
                    </label>
                    <input
                      name="seo_title"
                      placeholder="SEO Title"
                      value={formData.seo_title}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
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
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                    />
                  </div>
                </div>
              </div>
              {/* FAQs Section */}
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  FAQs
                </label>
                {Array.isArray(formData.faqs) && formData.faqs.length > 0 ? (
                  formData.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="mt-2 p-4 border border-gray-300 rounded-md space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Question
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) =>
                            handleFaqChange(index, "question", e.target.value)
                          }
                          placeholder="Enter FAQ question"
                          className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Answer
                        </label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) =>
                            handleFaqChange(index, "answer", e.target.value)
                          }
                          placeholder="Enter FAQ answer"
                          className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-black focus:ring-blue-500 focus:border-blue-500"
                          rows="4"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                      >
                        Remove FAQ
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No FAQs added yet.</p>
                )}
                <button
                  type="button"
                  onClick={addFaq}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                >
                  Add FAQ
                </button>
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
                          formData.status === 1
                            ? "translate-x-5"
                            : "translate-x-0"
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
                {isEditing ? "Update Service" : "Add Service"}
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
            Services List
          </h2>
          {services.length === 0 ? (
            <p className="text-gray-600">No services found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      ID
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      City
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Category
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Title
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Sub Title
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Slug
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Description
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      Image
                    </th>
                    <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">
                      FAQs
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
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {service.id}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {service.city_name || "-"}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {service.category_name || "-"}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {service.title}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {service.sub_title || "-"}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {service.slug}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          {service.description
                            .replace(/<[^>]+>/g, "")
                            .substring(0, 50)}
                          {service.description.length > 50 ? "..." : ""}
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3">
                        {service.image ? (
                          <Image
                            src={`${API_URL}${service.image}`}
                            alt={service.title}
                            width={48}
                            height={48}
                            className="object-cover rounded-md"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        {(() => {
                          let faqsArray = [];
                          try {
                            faqsArray =
                              typeof service.faqs === "string"
                                ? JSON.parse(service.faqs)
                                : Array.isArray(service.faqs)
                                ? service.faqs
                                : [];
                          } catch (err) {
                            faqsArray = [];
                          }
                          return faqsArray.length > 0 ? (
                            <div className="truncate max-w-[150px] sm:max-w-[200px]">
                              {faqsArray
                                .map((faq) => faq.question)
                                .join(", ")
                                .substring(0, 50)}
                              {faqsArray.map((faq) => faq.question).join(", ")
                                .length > 50
                                ? "..."
                                : ""}
                            </div>
                          ) : (
                            "No FAQs"
                          );
                        })()}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-black">
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">
                            {service.status === 1 ? "Active" : "Inactive"}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={service.status === 1}
                              onChange={() => handleStatusToggle(service)}
                              className="sr-only"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition duration-200">
                              <div
                                className={`w-5 h-5 bg-white rounded-full shadow transform transition duration-200 ${
                                  service.status === 1
                                    ? "translate-x-5"
                                    : "translate-x-0"
                                }`}
                              />
                            </div>
                          </label>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
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