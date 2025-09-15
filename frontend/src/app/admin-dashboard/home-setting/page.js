'use client';

import { useEffect, useState, useCallback } from "react";
import JoditEditorComponent from "@/components/JoditEditorComponent";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { Facebook, Youtube, Instagram } from "lucide-react";
import Image from "next/image";
import ProtectedRoute from '@/components/ProtectedRoute';

export default function HomeSettingPage() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    astrologer_name: "",
    title: "",
    subtitle: "",
    description: "",
    address: "",
    seo_title: "",
    seo_description: "",
    facebook_link: "",
    youtube_link: "",
    instagram_link: "",
    website_title: "",
    heading_color: "",
    service_title: "",
    service_subtitle: "",
    service_background_color: "",
    service_text_color: "",
    footer_background_color: "",
    footer_text_color: "",
    web_info: "",
    footer_heading: "",
    navbar_background_color: "",
    testimonials_title: "",
    testimonials_description: "",
    blog_title: "",
    blog_description: "",
    navbar_title: "",
    confidence: "",
    existingLogo: null,
    existingImage: null,
    existingIconImage: null,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [iconImageFile, setIconImageFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [iconImagePreview, setIconImagePreview] = useState(null);
  const [homeSetting, setHomeSetting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("form");
  const [gradientColor1, setGradientColor1] = useState("#3056b0"); // Navbar Gradient Color 1
  const [gradientColor2, setGradientColor2] = useState("#631abd"); // Navbar Gradient Color 2
  const [gradientColor3, setGradientColor3] = useState("#000000"); // Navbar Gradient Color 3
  const [serviceGradientColor1, setServiceGradientColor1] = useState("#3056b0"); // Service Gradient Color 1
  const [serviceGradientColor2, setServiceGradientColor2] = useState("#631abd"); // Service Gradient Color 2
  const [serviceGradientColor3, setServiceGradientColor3] = useState("#000000"); // Service Gradient Color 3
  const [footerGradientColor1, setFooterGradientColor1] = useState("#3056b0"); // Footer Gradient Color 1
  const [footerGradientColor2, setFooterGradientColor2] = useState("#631abd"); // Footer Gradient Color 2
  const [footerGradientColor3, setFooterGradientColor3] = useState("#000000"); // Footer Gradient Color 3
  const [serviceColorMode, setServiceColorMode] = useState("single"); // Single or Gradient for Service
  const [footerColorMode, setFooterColorMode] = useState("single"); // Single or Gradient for Footer

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Update navbar_background_color whenever navbar gradient colors change
  useEffect(() => {
    const gradient = `linear-gradient(90deg, ${gradientColor1} 0%, ${gradientColor2} 50%, ${gradientColor3} 100%)`;
    setFormData((prev) => ({ ...prev, navbar_background_color: gradient }));
  }, [gradientColor1, gradientColor2, gradientColor3]);

  // Update service_background_color based on mode
  useEffect(() => {
    if (serviceColorMode === "gradient") {
      const gradient = `linear-gradient(90deg, ${serviceGradientColor1} 0%, ${serviceGradientColor2} 50%, ${serviceGradientColor3} 100%)`;
      setFormData((prev) => ({ ...prev, service_background_color: gradient }));
    }
  }, [serviceGradientColor1, serviceGradientColor2, serviceGradientColor3, serviceColorMode]);

  // Update footer_background_color based on mode
  useEffect(() => {
    if (footerColorMode === "gradient") {
      const gradient = `linear-gradient(90deg, ${footerGradientColor1} 0%, ${footerGradientColor2} 50%, ${footerGradientColor3} 100%)`;
      setFormData((prev) => ({ ...prev, footer_background_color: gradient }));
    }
  }, [footerGradientColor1, footerGradientColor2, footerGradientColor3, footerColorMode]);

  const fetchHomeSetting = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/home-setting`, { timeout: 5000 });
      console.log('Fetched home setting:', res.data);
      setHomeSetting(res.data);
      if (res.data) {
        setFormData({
          ...res.data,
          existingLogo: res.data.logo,
          existingImage: res.data.image,
          existingIconImage: res.data.icon_image,
          facebook_link: res.data.facebook_link || "",
          youtube_link: res.data.youtube_link || "",
          instagram_link: res.data.instagram_link || "",
          website_title: res.data.website_title || "",
          heading_color: res.data.heading_color || "",
          service_title: res.data.service_title || "",
          service_subtitle: res.data.service_subtitle || "",
          service_background_color: res.data.service_background_color || "",
          service_text_color: res.data.service_text_color || "",
          footer_background_color: res.data.footer_background_color || "",
          footer_text_color: res.data.footer_text_color || "",
          web_info: res.data.web_info || "",
          footer_heading: res.data.footer_heading || "",
          navbar_background_color: res.data.navbar_background_color || "",
          testimonials_title: res.data.testimonials_title || "",
          testimonials_description: res.data.testimonials_description || "",
          blog_title: res.data.blog_title || "",
          blog_description: res.data.blog_description || "",
          navbar_title: res.data.navbar_title || "",
          confidence: res.data.confidence || "",
        });
        // Parse gradient colors for navbar
        if (res.data.navbar_background_color && res.data.navbar_background_color.includes("linear-gradient")) {
          const matches = res.data.navbar_background_color.match(/#[0-9a-fA-F]{6}/g);
          if (matches && matches.length >= 3) {
            setGradientColor1(matches[0]);
            setGradientColor2(matches[1]);
            setGradientColor3(matches[2]);
          } else {
            setGradientColor1("#3056b0");
            setGradientColor2("#631abd");
            setGradientColor3("#000000");
          }
        } else {
          setGradientColor1("#3056b0");
          setGradientColor2("#631abd");
          setGradientColor3("#000000");
        }
        // Parse gradient colors for service background
        if (res.data.service_background_color && res.data.service_background_color.includes("linear-gradient")) {
          const matches = res.data.service_background_color.match(/#[0-9a-fA-F]{6}/g);
          if (matches && matches.length >= 3) {
            setServiceGradientColor1(matches[0]);
            setServiceGradientColor2(matches[1]);
            setServiceGradientColor3(matches[2]);
            setServiceColorMode("gradient");
          } else {
            setServiceGradientColor1("#3056b0");
            setServiceGradientColor2("#631abd");
            setServiceGradientColor3("#000000");
            setServiceColorMode("single");
            setFormData((prev) => ({ ...prev, service_background_color: res.data.service_background_color || "#ffffff" }));
          }
        } else {
          setServiceColorMode("single");
          setFormData((prev) => ({ ...prev, service_background_color: res.data.service_background_color || "#ffffff" }));
        }
        // Parse gradient colors for footer background
        if (res.data.footer_background_color && res.data.footer_background_color.includes("linear-gradient")) {
          const matches = res.data.footer_background_color.match(/#[0-9a-fA-F]{6}/g);
          if (matches && matches.length >= 3) {
            setFooterGradientColor1(matches[0]);
            setFooterGradientColor2(matches[1]);
            setFooterGradientColor3(matches[2]);
            setFooterColorMode("gradient");
          } else {
            setFooterGradientColor1("#3056b0");
            setFooterGradientColor2("#631abd");
            setFooterGradientColor3("#000000");
            setFooterColorMode("single");
            setFormData((prev) => ({ ...prev, footer_background_color: res.data.footer_background_color || "#ffffff" }));
          }
        } else {
          setFooterColorMode("single");
          setFormData((prev) => ({ ...prev, footer_background_color: res.data.footer_background_color || "#ffffff" }));
        }
        setLogoPreview(res.data.logo ? `${API_URL}${res.data.logo}` : null);
        setImagePreview(res.data.image ? `${API_URL}${res.data.image}` : null);
        setIconImagePreview(res.data.icon_image ? `${API_URL}${res.data.icon_image}` : null);
      }
    } catch (err) {
      toast.error(`Error loading home setting: ${err.message}`);
      console.error('Error fetching home setting:', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchHomeSetting();
  }, [fetchHomeSetting]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradientColorChange = (color, index, type) => {
    if (type === "navbar") {
      if (index === 1) setGradientColor1(color);
      else if (index === 2) setGradientColor2(color);
      else if (index === 3) setGradientColor3(color);
    } else if (type === "service") {
      if (index === 1) setServiceGradientColor1(color);
      else if (index === 2) setServiceGradientColor2(color);
      else if (index === 3) setServiceGradientColor3(color);
    } else if (type === "footer") {
      if (index === 1) setFooterGradientColor1(color);
      else if (index === 2) setFooterGradientColor2(color);
      else if (index === 3) setFooterGradientColor3(color);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo size exceeds 5MB limit");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size exceeds 5MB limit");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleIconImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Icon image size exceeds 5MB limit");
        return;
      }
      setIconImageFile(file);
      setIconImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDescriptionChange = (newContent) => {
    setFormData((prev) => ({ ...prev, description: newContent }));
  };

  const resetForm = () => {
    if (homeSetting) {
      setFormData({
        ...homeSetting,
        existingLogo: homeSetting.logo,
        existingImage: homeSetting.image,
        existingIconImage: homeSetting.icon_image,
        facebook_link: homeSetting.facebook_link || "",
        youtube_link: homeSetting.youtube_link || "",
        instagram_link: homeSetting.instagram_link || "",
        website_title: homeSetting.website_title || "",
        heading_color: homeSetting.heading_color || "",
        service_title: homeSetting.service_title || "",
        service_subtitle: homeSetting.service_subtitle || "",
        service_background_color: homeSetting.service_background_color || "",
        service_text_color: homeSetting.service_text_color || "",
        footer_background_color: homeSetting.footer_background_color || "",
        footer_text_color: homeSetting.footer_text_color || "",
        web_info: homeSetting.web_info || "",
        footer_heading: homeSetting.footer_heading || "",
        navbar_background_color: homeSetting.navbar_background_color || "",
        testimonials_title: homeSetting.testimonials_title || "",
        testimonials_description: homeSetting.testimonials_description || "",
        blog_title: homeSetting.blog_title || "",
        blog_description: homeSetting.blog_description || "",
        navbar_title: homeSetting.navbar_title || "",
        confidence: homeSetting.confidence || "",
      });
      // Reset navbar gradient colors
      if (homeSetting.navbar_background_color && homeSetting.navbar_background_color.includes("linear-gradient")) {
        const matches = homeSetting.navbar_background_color.match(/#[0-9a-fA-F]{6}/g);
        if (matches && matches.length >= 3) {
          setGradientColor1(matches[0]);
          setGradientColor2(matches[1]);
          setGradientColor3(matches[2]);
        } else {
          setGradientColor1("#3056b0");
          setGradientColor2("#631abd");
          setGradientColor3("#000000");
        }
      }
      // Reset service background colors
      if (homeSetting.service_background_color && homeSetting.service_background_color.includes("linear-gradient")) {
        const matches = homeSetting.service_background_color.match(/#[0-9a-fA-F]{6}/g);
        if (matches && matches.length >= 3) {
          setServiceGradientColor1(matches[0]);
          setServiceGradientColor2(matches[1]);
          setServiceGradientColor3(matches[2]);
          setServiceColorMode("gradient");
        } else {
          setServiceGradientColor1("#3056b0");
          setServiceGradientColor2("#631abd");
          setServiceGradientColor3("#000000");
          setServiceColorMode("single");
        }
      } else {
        setServiceColorMode("single");
        setFormData((prev) => ({ ...prev, service_background_color: homeSetting.service_background_color || "#ffffff" }));
      }
      // Reset footer background colors
      if (homeSetting.footer_background_color && homeSetting.footer_background_color.includes("linear-gradient")) {
        const matches = homeSetting.footer_background_color.match(/#[0-9a-fA-F]{6}/g);
        if (matches && matches.length >= 3) {
          setFooterGradientColor1(matches[0]);
          setFooterGradientColor2(matches[1]);
          setFooterGradientColor3(matches[2]);
          setFooterColorMode("gradient");
        } else {
          setFooterGradientColor1("#3056b0");
          setFooterGradientColor2("#631abd");
          setFooterGradientColor3("#000000");
          setFooterColorMode("single");
        }
      } else {
        setFooterColorMode("single");
        setFormData((prev) => ({ ...prev, footer_background_color: homeSetting.footer_background_color || "#ffffff" }));
      }
      setLogoPreview(homeSetting.logo ? `${API_URL}${homeSetting.logo}` : null);
      setImagePreview(homeSetting.image ? `${API_URL}${homeSetting.image}` : null);
      setIconImagePreview(homeSetting.icon_image ? `${API_URL}${homeSetting.icon_image}` : null);
    } else {
      setFormData({
        email: "",
        phone: "",
        astrologer_name: "",
        title: "",
        subtitle: "",
        description: "",
        address: "",
        seo_title: "",
        seo_description: "",
        facebook_link: "",
        youtube_link: "",
        instagram_link: "",
        website_title: "",
        heading_color: "",
        service_title: "",
        service_subtitle: "",
        service_background_color: "",
        service_text_color: "",
        footer_background_color: "",
        footer_text_color: "",
        web_info: "",
        footer_heading: "",
        navbar_background_color: "",
        testimonials_title: "",
        testimonials_description: "",
        blog_title: "",
        blog_description: "",
        navbar_title: "",
        confidence: "",
        existingLogo: null,
        existingImage: null,
        existingIconImage: null,
      });
      setGradientColor1("#3056b0");
      setGradientColor2("#631abd");
      setGradientColor3("#000000");
      setServiceGradientColor1("#3056b0");
      setServiceGradientColor2("#631abd");
      setServiceGradientColor3("#000000");
      setFooterGradientColor1("#3056b0");
      setFooterGradientColor2("#631abd");
      setFooterGradientColor3("#000000");
      setServiceColorMode("single");
      setFooterColorMode("single");
      setLogoFile(null);
      setImageFile(null);
      setIconImageFile(null);
      setLogoPreview(null);
      setImagePreview(null);
      setIconImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.phone ||
      !formData.astrologer_name ||
      !formData.title ||
      !formData.subtitle ||
      !formData.description ||
      !formData.address
    ) {
      toast.error("All fields except SEO Title, SEO Description, social links, and optional fields are required");
      return;
    }
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (
          key !== "existingLogo" &&
          key !== "existingImage" &&
          key !== "existingIconImage" &&
          key !== "id" &&
          formData[key] != null
        ) {
          data.append(key, formData[key]);
        }
      });
      if (logoFile) data.append("logo", logoFile);
      else if (formData.existingLogo) data.append("logo", formData.existingLogo);
      if (imageFile) data.append("image", imageFile);
      else if (formData.existingImage) data.append("image", formData.existingImage);
      if (iconImageFile) data.append("icon_image", iconImageFile);
      else if (formData.existingIconImage) data.append("icon_image", formData.existingIconImage);

      setLoading(true);
      const response = await axios.post(`${API_URL}/api/home-setting`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message || (homeSetting ? "Home setting updated" : "Home setting created"));
      await fetchHomeSetting();
      setViewMode("table");
    } catch (err) {
      toast.error(`Error saving data: ${err.message}`);
      console.error('Error saving home setting:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!homeSetting || !confirm("Are you sure you want to delete?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/home-setting/${homeSetting.id}`);
      toast.success("Home setting deleted");
      setHomeSetting(null);
      resetForm();
      setViewMode("form");
    } catch (err) {
      toast.error(`Error deleting data: ${err.message}`);
      console.error('Error deleting home setting:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 sm:p-6 bg-gray-50" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setViewMode("form")}
            disabled={homeSetting && viewMode === "form"}
            className={`px-6 py-2 rounded-full font-semibold transition duration-300 ${
              viewMode === "form" ? "bg-blue-600 text-white" : "bg-gray-500 text-white hover:bg-gray-600"
            } ${homeSetting ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            Add
          </button>
          <button
            onClick={() => setViewMode("table")}
            disabled={!homeSetting || viewMode === "table"}
            className={`px-6 py-2 rounded-full font-semibold transition duration-300 ${
              viewMode === "table" ? "bg-blue-600 text-white" : "bg-gray-500 text-white hover:bg-gray-600"
            } ${!homeSetting ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            View
          </button>
        </div>

        {viewMode === "form" && (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
              {homeSetting ? "Edit Home Setting" : "Add Home Setting"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
              {/* Top Bar Section */}
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Top Bar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Phone"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Facebook Link</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Facebook className="w-5 h-5 text-gray-600" />
                      <input
                        type="url"
                        name="facebook_link"
                        value={formData.facebook_link}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Facebook Link"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">YouTube Link</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Youtube className="w-5 h-5 text-gray-600" />
                      <input
                        type="url"
                        name="youtube_link"
                        value={formData.youtube_link}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="YouTube Link"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Instagram Link</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Instagram className="w-5 h-5 text-gray-600" />
                      <input
                        type="url"
                        name="instagram_link"
                        value={formData.instagram_link}
                        onChange={handleChange}
                        className="block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Instagram Link"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navbar Section */}
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Navbar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Navbar Title</label>
                    <input
                      type="text"
                      name="navbar_title"
                      value={formData.navbar_title}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Navbar Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confidence</label>
                    <textarea
                      name="confidence"
                      value={formData.confidence}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      aria-label="Confidence"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Logo Upload (Max 5MB)</label>
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                      aria-label="Logo Upload"
                    />
                    {logoPreview && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {logoPreview.includes("blob") ? "New Logo" : logoPreview.split("/Uploads/home-image/").pop() || "No logo"}
                        </p>
                        <Image
                          src={logoPreview}
                          alt="Logo Preview"
                          width={96}
                          height={96}
                          className="h-24 w-24 object-contain rounded-md shadow-md mt-2 bg-white p-2 border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Icon Image Upload (Max 5MB)</label>
                    <input
                      type="file"
                      name="icon_image"
                      accept="image/*"
                      onChange={handleIconImageChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                      aria-label="Icon Image Upload"
                    />
                    {iconImagePreview && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {iconImagePreview.includes("blob") ? "New Icon Image" : iconImagePreview.split("/Uploads/home-image/").pop() || "No icon image"}
                        </p>
                        <Image
                          src={iconImagePreview}
                          alt="Icon Image Preview"
                          width={96}
                          height={96}
                          className="h-24 w-24 object-contain rounded-md shadow-md mt-2 bg-white p-2 border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Navbar Background Gradient</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Color 1</label>
                        <input
                          type="color"
                          value={gradientColor1}
                          onChange={(e) => handleGradientColorChange(e.target.value, 1, "navbar")}
                          className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                          aria-label="Navbar Gradient Color 1"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Color 2</label>
                        <input
                          type="color"
                          value={gradientColor2}
                          onChange={(e) => handleGradientColorChange(e.target.value, 2, "navbar")}
                          className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                          aria-label="Navbar Gradient Color 2"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Color 3</label>
                        <input
                          type="color"
                          value={gradientColor3}
                          onChange={(e) => handleGradientColorChange(e.target.value, 3, "navbar")}
                          className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                          aria-label="Navbar Gradient Color 3"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Gradient Preview</label>
                      <div
                        className="w-full h-12 rounded-md shadow-md border border-gray-200"
                        style={{ background: formData.navbar_background_color }}
                      ></div>
                      <p className="mt-2 text-sm text-gray-600">{formData.navbar_background_color}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Astrologer Section */}
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">About Astrologer</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Astrologer Name</label>
                    <input
                      type="text"
                      name="astrologer_name"
                      value={formData.astrologer_name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Astrologer Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Subtitle"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <JoditEditorComponent
                      value={formData.description}
                      onChange={handleDescriptionChange}
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Main Image Upload (Max 5MB)</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                      aria-label="Main Image Upload"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {imagePreview.includes("blob") ? "New Image" : imagePreview.split("/Uploads/home-image/").pop() || "No image"}
                        </p>
                        <Image
                          src={imagePreview}
                          alt="Main Image Preview"
                          width={384}
                          height={256}
                          className="w-full sm:w-96 h-64 object-cover rounded-lg shadow-lg mt-2 border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Testimonials Section */}
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Testimonials</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Testimonials Title</label>
                    <input
                      type="text"
                      name="testimonials_title"
                      value={formData.testimonials_title}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Testimonials Title"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Testimonials Description</label>
                    <textarea
                      name="testimonials_description"
                      value={formData.testimonials_description}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      aria-label="Testimonials Description"
                    />
                  </div>
                </div>
              </div>

              {/* Blog Section */}
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Blog</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Blog Title</label>
                    <input
                      type="text"
                      name="blog_title"
                      value={formData.blog_title}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Blog Title"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Blog Description</label>
                    <textarea
                      name="blog_description"
                      value={formData.blog_description}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      aria-label="Blog Description"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Footer</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      aria-label="Address"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Information Section */}
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">SEO Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SEO Title</label>
                    <input
                      type="text"
                      name="seo_title"
                      value={formData.seo_title}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="SEO Title"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">SEO Description</label>
                    <textarea
                      name="seo_description"
                      value={formData.seo_description}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      aria-label="SEO Description"
                    />
                  </div>
                </div>
              </div>

              {/* Website Settings Section */}
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Website Settings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website Title</label>
                    <input
                      type="text"
                      name="website_title"
                      value={formData.website_title}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Website Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Heading Color</label>
                    <input
                      type="color"
                      name="heading_color"
                      value={formData.heading_color}
                      onChange={handleChange}
                      className="mt-1 block w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                      aria-label="Heading Color"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service Title</label>
                    <input
                      type="text"
                      name="service_title"
                      value={formData.service_title}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Service Title"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Service Subtitle</label>
                    <textarea
                      name="service_subtitle"
                      value={formData.service_subtitle}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      aria-label="Service Subtitle"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Background Color</label>
                    <div className="flex items-center space-x-4 mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="service_color_mode"
                          value="single"
                          checked={serviceColorMode === "single"}
                          onChange={() => {
                            setServiceColorMode("single");
                            setFormData((prev) => ({ ...prev, service_background_color: "#ffffff" }));
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-600">Single Color</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="service_color_mode"
                          value="gradient"
                          checked={serviceColorMode === "gradient"}
                          onChange={() => setServiceColorMode("gradient")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-600">Gradient Color</span>
                      </label>
                    </div>
                    {serviceColorMode === "single" ? (
                      <div>
                        <input
                          type="color"
                          name="service_background_color"
                          value={formData.service_background_color}
                          onChange={handleChange}
                          className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                          aria-label="Service Background Color"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">Color 1</label>
                          <input
                            type="color"
                            value={serviceGradientColor1}
                            onChange={(e) => handleGradientColorChange(e.target.value, 1, "service")}
                            className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                            aria-label="Service Gradient Color 1"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">Color 2</label>
                          <input
                            type="color"
                            value={serviceGradientColor2}
                            onChange={(e) => handleGradientColorChange(e.target.value, 2, "service")}
                            className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                            aria-label="Service Gradient Color 2"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">Color 3</label>
                          <input
                            type="color"
                            value={serviceGradientColor3}
                            onChange={(e) => handleGradientColorChange(e.target.value, 3, "service")}
                            className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                            aria-label="Service Gradient Color 3"
                          />
                        </div>
                      </div>
                    )}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Service Background Preview</label>
                      <div
                        className="w-full h-12 rounded-md shadow-md border border-gray-200"
                        style={{ background: formData.service_background_color }}
                      ></div>
                      <p className="mt-2 text-sm text-gray-600">{formData.service_background_color}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service Text Color</label>
                    <input
                      type="color"
                      name="service_text_color"
                      value={formData.service_text_color}
                      onChange={handleChange}
                      className="mt-1 block w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                      aria-label="Service Text Color"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Footer Background Color</label>
                    <div className="flex items-center space-x-4 mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="footer_color_mode"
                          value="single"
                          checked={footerColorMode === "single"}
                          onChange={() => {
                            setFooterColorMode("single");
                            setFormData((prev) => ({ ...prev, footer_background_color: "#ffffff" }));
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-600">Single Color</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="footer_color_mode"
                          value="gradient"
                          checked={footerColorMode === "gradient"}
                          onChange={() => setFooterColorMode("gradient")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-600">Gradient Color</span>
                      </label>
                    </div>
                    {footerColorMode === "single" ? (
                      <div>
                        <input
                          type="color"
                          name="footer_background_color"
                          value={formData.footer_background_color}
                          onChange={handleChange}
                          className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                          aria-label="Footer Background Color"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">Color 1</label>
                          <input
                            type="color"
                            value={footerGradientColor1}
                            onChange={(e) => handleGradientColorChange(e.target.value, 1, "footer")}
                            className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                            aria-label="Footer Gradient Color 1"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">Color 2</label>
                          <input
                            type="color"
                            value={footerGradientColor2}
                            onChange={(e) => handleGradientColorChange(e.target.value, 2, "footer")}
                            className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                            aria-label="Footer Gradient Color 2"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">Color 3</label>
                          <input
                            type="color"
                            value={footerGradientColor3}
                            onChange={(e) => handleGradientColorChange(e.target.value, 3, "footer")}
                            className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                            aria-label="Footer Gradient Color 3"
                          />
                        </div>
                      </div>
                    )}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Footer Background Preview</label>
                      <div
                        className="w-full h-12 rounded-md shadow-md border border-gray-200"
                        style={{ background: formData.footer_background_color }}
                      ></div>
                      <p className="mt-2 text-sm text-gray-600">{formData.footer_background_color}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Footer Text Color</label>
                    <input
                      type="color"
                      name="footer_text_color"
                      value={formData.footer_text_color}
                      onChange={handleChange}
                      className="mt-1 block w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                      aria-label="Footer Text Color"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Footer Heading Color</label>
                    <input
                      type="color"
                      name="footer_heading"
                      value={formData.footer_heading}
                      onChange={handleChange}
                      className="mt-1 block w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                      aria-label="Footer Heading Color"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Web Info</label>
                    <textarea
                      name="web_info"
                      value={formData.web_info}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      aria-label="Web Info"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-60 transition duration-300"
                >
                  {homeSetting ? "Update Home Setting" : "Add Home Setting"}
                </button>
                {homeSetting && (
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

        {viewMode === "table" && homeSetting && (
          <div className="mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Home Setting Details</h2>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Logo</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Image</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Icon Image</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Email</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Phone</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Astrologer Name</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Title</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Navbar Title</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Confidence</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Subtitle</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Description</th>
                      <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-2 sm:p-3">
                        {homeSetting.logo ? (
                          <Image
                            src={`${API_URL}${homeSetting.logo}`}
                            alt="Logo"
                            width={48}
                            height={48}
                            className="h-12 w-12 object-contain rounded-md"
                          />
                        ) : (
                          "No Logo"
                        )}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3">
                        {homeSetting.image ? (
                          <Image
                            src={`${API_URL}${homeSetting.image}`}
                            alt="Main Image"
                            width={48}
                            height={48}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3">
                        {homeSetting.icon_image ? (
                          <Image
                            src={`${API_URL}${homeSetting.icon_image}`}
                            alt="Icon Image"
                            width={48}
                            height={48}
                            className="h-12 w-12 object-contain rounded-md"
                          />
                        ) : (
                          "No Icon Image"
                        )}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800">{homeSetting.email}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800">{homeSetting.phone}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800">{homeSetting.astrologer_name}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800">{homeSetting.title}</td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800 max-w-[150px] truncate" title={homeSetting.navbar_title}>
                        {homeSetting.navbar_title || "N/A"}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800 max-w-[150px] truncate" title={homeSetting.confidence?.replace(/<[^>]+>/g, '')}>
                        {homeSetting.confidence?.replace(/<[^>]+>/g, '') || "N/A"}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800 max-w-[150px] truncate" title={homeSetting.subtitle}>
                        {homeSetting.subtitle}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 text-gray-800 max-w-[200px] truncate" title={homeSetting.description?.replace(/<[^>]+>/g, '')}>
                        {homeSetting.description?.replace(/<[^>]+>/g, '')}
                      </td>
                      <td className="border border-gray-200 p-2 sm:p-3 space-x-2">
                        <button
                          onClick={() => setViewMode("form")}
                          className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={handleDelete}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
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