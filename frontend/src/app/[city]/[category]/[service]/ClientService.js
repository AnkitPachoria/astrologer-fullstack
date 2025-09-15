"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";
import { Plus, Minus } from "lucide-react";
import axios from "axios";

export default function ClientService({
  cityData,
  categoryData,
  serviceData,
  API_URL,
}) {       
  const [imgError, setImgError] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [categories, setCategories] = useState([]);
  const [homeSetting, setHomeSetting] = useState(null);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingHomeSetting, setLoadingHomeSetting] = useState(true);

  // Construct service image URL
  const serviceImageUrl =
    serviceData.image && !imgError
      ? serviceData.image.startsWith("http")
        ? serviceData.image
        : `${API_URL}${encodeURI(serviceData.image)}`
      : "/Kundli.jpg";

  useEffect(() => {
    // Validate cityData for recommended services
    if (!cityData?.id || !cityData?.name) {
      toast.error("Invalid city data");
      setLoadingRecommended(false);
      setLoadingCategories(false);
      setLoadingHomeSetting(false);
      return;
    }    
          
    // Fetch home-setting for heading_color and service_text_color
    const fetchHomeSetting = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/home-setting`);
        console.log("Fetched home-setting:", res.data);
        setHomeSetting(res.data);
      } catch (err) {
        console.error("Error fetching home-setting:", err);
        toast.error("Failed to load home settings");
        setHomeSetting(null);
      } finally {
        setLoadingHomeSetting(false);
      }
    };      
         
    // Fetch recommended services for the specific city
    const fetchRecommended = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/services?city_id=${cityData.id}&t=${Date.now()}`,
          {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          }
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.error || "Failed to fetch recommended services"
          );
        }
        const data = await res.json();
        console.log("API Response for Recommended Services:", data);

        // Fallback: Filter services by city_id and exclude the current service
        const filteredServices = data.filter(
          (service) =>
            (service.city_id === cityData.id || service.city?.id === cityData.id) &&
            service.id !== serviceData.id
        );
        console.log("Filtered Recommended Services:", filteredServices);

        setRecommended(filteredServices.slice(0, 4)); // Top 4
        if (filteredServices.length === 0) {
          toast.error(`No services found for ${cityData.name}`);
        }
      } catch (err) {
        console.error("Error fetching recommended services:", err);
        toast.error(`Error: ${err.message}`);
        setRecommended([]);
      } finally {
        setLoadingRecommended(false);
      }
    };
  
    // Fetch all categories (no city filter)
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories?t=${Date.now()}`, {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch categories");
        }
        const data = await res.json();
        console.log("API Response for Categories:", data);

        setCategories(data);
        if (data.length === 0) {
          toast.error("No categories found");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error(`Error: ${err.message}`);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchHomeSetting();
    fetchRecommended();
    fetchCategories();
  }, [API_URL, cityData, serviceData.id]);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Get dynamic colors
  const headingColor = homeSetting?.heading_color || "#1E3A8A";
  const serviceTextColor = homeSetting?.service_text_color || "#1E3A8A";

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Banner Section */}
      <section
        className="relative bg-cover bg-center py-16 px-4 overflow-hidden flex items-center justify-center"
        style={{ backgroundImage: "url('/bg-soln.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
          <h1
            className="text-3xl md:text-4xl font-bold text-white"
            // style={{ color: headingColor }}
          >
            {serviceData.title || serviceData.title}
          </h1>
          {serviceData.sub_title && (
            <p className="text-lg md:text-xl text-white">
              {serviceData.sub_title}
            </p>
          )}
          <nav className="text-sm text-gray-200" aria-label="Breadcrumb">
            <Link href="/" className="text-gray-200 hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link
              href={`/${cityData.slug}`}
              className="text-gray-200 hover:underline"
            >
              {cityData.name}
            </Link>{" "}
            /{" "}
            <Link
              href={`/${cityData.slug}/${categoryData.slug}`}
              className="text-gray-200 hover:underline"
            >
              {categoryData.name}
            </Link>{" "}
            / <span className="text-white">{serviceData.title}</span>
          </nav>
        </div>
      </section>

      {/* Service Description */}
      <section className="bg-[#fff8ee] py-12 px-4 contentarea">
        <div className="max-w-[1400px] mx-auto">
          {/* Wrapper */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Content */}
            <div className="flex-1">
              <h2
                className="text-3xl md:text-4xl font-bold "
                style={{ color: headingColor }}
              >
                {serviceData.title || "Heading Here"}
              </h2>
              <hr className="border-[#dcbda1] w-24 mt-2 mb-4" />
              {serviceData.sub_title && (
                <h3
                  className="font-semibold text-lg mb-4"
                  style={{ color: headingColor }}
                >
                  {serviceData.sub_title}
                </h3>
              )}

              {/* Text wrapping around image */}
              <div className="relative">
                <div className="md:float-right md:ml-6 md:mb-2 w-[420px]">
                  <Image
                    src={serviceImageUrl}
                    alt={serviceData.title}
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-md shadow-lg"
                    onError={() => setImgError(true)}
                  />
                </div>

                {serviceData.description ? (
                  <div
                    className="prose prose-lg text-gray-800 text-justify"
                    dangerouslySetInnerHTML={{
                      __html: serviceData.description,
                    }}
                  />
                ) : (
                  <p className="text-gray-800 italic">
                    No description available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {serviceData.faqs?.length > 0 && (
        <section className="bg-[#fff8ee] py-12 px-4">
          <div className="max-w-[1400px] mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-center"
              style={{ color: headingColor }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 mt-8">
              {serviceData.faqs.map((faq, index) => (
                <div
                  key={faq.id || index}
                  className="border border-[#dcbda1] rounded-md shadow-sm bg-white"
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-lg text-gray-900"
                    // style={{ color: serviceTextColor }}
                  >
                    {faq.question}
                    {openIndex === index ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-5 pb-4 text-gray-700">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recommended Services */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-[1400px] mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center"
            style={{ color: headingColor }}
          >
            Recommended Services in {cityData.name}
          </h2>
          {loadingRecommended ? (
            <p className="text-gray-600 text-center mt-10">
              Loading recommended services...
            </p>
          ) : recommended.length > 0 ? (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 mt-10">
              {recommended.map((item) => (
                <div
                  key={item.id || item._id}
                  className="bg-[#fff8ee] border border-[#dcbda1] rounded-lg overflow-hidden shadow hover:shadow-md transition duration-300"
                >
                  <Link
                    href={`/${cityData.slug}/${item.category_slug || categoryData.slug}/${item.slug}`}
                    className="block cursor-pointer"
                  >
                    {console.log(
                      "Recommended service image URL:",
                      item.image
                        ? item.image.startsWith("http")
                          ? item.image
                          : `${API_URL}${encodeURI(item.image)}`
                        : "/default.jpg"
                    )}
                    <Image
                      src={
                        item.image
                          ? item.image.startsWith("http")
                            ? item.image
                            : `${API_URL}${encodeURI(item.image)}`
                          : "/default.jpg"
                      }
                      alt={item.title}
                      width={300}
                      height={192}
                      className="w-full h-48 object-cover"
                      onError={(e) => (e.target.src = "/default.jpg")}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-black">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                  <div className="p-4 pt-0">
                    <Link
                      href={`/${cityData.slug}/${item.category_slug || categoryData.slug}/${item.slug}`}
                      className="text-sm text-[#f39200] hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-10">
              No recommended services found for {cityData.name}.
            </p>
          )}
        </div>
      </section>

      {/* Category Section */}
      <section className="bg-[#fff8ee] py-16 px-4">
        <div className="max-w-[1400px] mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center"
            style={{ color: headingColor }}
          >
            Available Categories
          </h2>
          {loadingCategories ? (
            <p className="text-gray-600 text-center mt-10">
              Loading categories...
            </p>
          ) : categories.length > 0 ? (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 mt-10">
              {categories.map((cat) => (
                <div
                  key={cat.id || cat._id}
                  className="bg-white border border-[#dcbda1] rounded-lg overflow-hidden shadow hover:shadow-md transition duration-300"
                >
                  <Link
                    href={`/${cityData.slug}/${cat.slug}`}
                    className="block cursor-pointer"
                  >
                    {console.log(
                      "Category image URL:",
                      cat.image
                        ? cat.image.startsWith("http")
                          ? cat.image
                          : `${API_URL}${encodeURI(cat.image)}`
                        : "/default-cat.jpg"
                    )}
                    <Image
                      src={
                        cat.image
                          ? cat.image.startsWith("http")
                            ? cat.image
                            : `${API_URL}${encodeURI(cat.image)}`
                          : "/default-cat.jpg"
                      }
                      alt={cat.name}
                      width={300}
                      height={192}
                      className="w-full h-48 object-cover"
                      onError={(e) => (e.target.src = "/default-cat.jpg")}
                    />
                    <div className="p-4">
                      <h3
                        className="text-lg font-bold text-black"
                        style={{ color: serviceTextColor }}
                      >
                        {cat.name}
                      </h3>
                    </div>
                  </Link>
                  <div className="p-4 pt-0">
                    <Link
                      href={`/${cityData.slug}/${cat.slug}`}
                      className="text-sm text-[#f39200] hover:underline"
                    >
                      Explore {cat.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-10">
              No categories found.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}