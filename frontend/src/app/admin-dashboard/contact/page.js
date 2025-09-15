'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ContactAdmin() {
  const [contacts, setContacts] = useState([]);
const [seo, setSeo] = useState({
  title: '',
  description: '',
  seo_title: '',
  seo_description: '',
});

  const [seoId, setSeoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seoStatus, setSeoStatus] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [contactsRes, seoRes] = await Promise.all([
          axios.get(`${API_URL}/api/contacts`, { timeout: 5000 }),
          axios.get(`${API_URL}/api/seo`, { timeout: 5000 }),
        ]);

        console.log('Contacts Response:', {
          status: contactsRes.status,
          data: contactsRes.data,
        });
        console.log('SEO Response:', {
          status: seoRes.status,
          data: seoRes.data,
        });

        // Validate contacts data
        if (Array.isArray(contactsRes.data)) {
          setContacts(contactsRes.data);
        } else {
          console.warn('Contacts data is not an array:', contactsRes.data);
          setContacts([]);
        }

        // Validate SEO data
        if (seoRes.data && typeof seoRes.data === 'object') {
        setSeo({
  title: seoRes.data.title || '',
  description: seoRes.data.description || '',
  seo_title: seoRes.data.seo_title || '',
  seo_description: seoRes.data.seo_description || '',
});

          setSeoId(seoRes.data.id || null);
        } else {
          console.warn('SEO data is invalid:', seoRes.data);
          setSeo({ title: '', description: '' });
          setSeoId(null);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', {
          message: err.message,
          response: err.response
            ? {
                status: err.response.status,
                data: err.response.data,
                headers: err.response.headers,
              }
            : null,
          request: err.request ? err.request : null,
        });
        setError(
          err.response
            ? `Failed to load data: ${err.response.status} - ${
                err.response.data.message || err.response.statusText
              }`
            : 'Failed to load data. Please check your network or server status.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSeoChange = (e) => {
    const { name, value } = e.target;
    setSeo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeoSubmit = async (e) => {
    e.preventDefault();
    try {
      setSeoStatus('Saving...');
      if (seoId) {
        await axios.put(`${API_URL}/api/seo/${seoId}`, seo);
        setSeoStatus('SEO updated successfully.');
      } else {
        const res = await axios.post(`${API_URL}/api/seo`, seo);
        setSeoId(res.data.id);
        setSeoStatus('SEO created successfully.');
      }
    } catch (err) {
      console.error('SEO Save Error:', {
        message: err.message,
        response: err.response ? err.response.data : null,
      });
      setSeoStatus(
        err.response
          ? `Failed to save SEO: ${err.response.data.message || err.response.statusText}`
          : 'Failed to save SEO data. Please try again.'
      );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-6">
            Admin Panel: SEO & Contact Messages
          </h1>

          {/* SEO Form Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">SEO Details</h2>
            <form onSubmit={handleSeoSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1"> Title</label>
                <input
                  type="text"
                  name="title"
                  value={seo.title}
                  onChange={handleSeoChange}
                  required
                  className="w-full border text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1"> Description</label>
                <textarea
                  name="description"
                  value={seo.description}
                  onChange={handleSeoChange}
                  required
                  className="w-full border text-black  px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  rows="4"
                ></textarea>
              </div>
              <div>
  <label className="block font-medium text-gray-700 mb-1">SEO Meta Title</label>
  <input
    type="text"
    name="seo_title"
    value={seo.seo_title}
    onChange={handleSeoChange}
    className="w-full border text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
  />
</div>

<div>
  <label className="block font-medium text-gray-700 mb-1">SEO Meta Description</label>
  <textarea
    name="seo_description"
    value={seo.seo_description}
    onChange={handleSeoChange}
    rows="3"
    className="w-full border text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
  ></textarea>
</div>

              <button
                type="submit"
                className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition duration-200"
              >
                {seoId ? 'Update SEO' : 'Save SEO'}
              </button>
              {seoStatus && (
                <p
                  className={`text-sm mt-2 ${
                    seoStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {seoStatus}
                </p>
              )}
            </form>
          </div>

          {/* Contact Messages Section */}
          <div>
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">Contact Messages</h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">{error}</div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse rounded-lg shadow-md">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-700 to-indigo-900 text-white">
                        {[
                          'ID',
                          'Name',
                          'Email',
                          'Phone',
                          'Message',
                          'Received At',
                        ].map((header) => (
                          <th
                            key={header}
                            className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-white"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact) => (
                        <tr
                          key={contact.id}
                          className="bg-white hover:bg-gray-50 transition duration-200"
                        >
                          <td className="border border-gray-200 px-4 py-3 text-gray-800">{contact.id}</td>
                          <td className="border border-gray-200 px-4 py-3 text-gray-800">{contact.name}</td>
                          <td className="border border-gray-200 px-4 py-3 text-gray-800">{contact.email || 'N/A'}</td>
                          <td className="border border-gray-200 px-4 py-3 text-gray-800">{contact.phone || 'N/A'}</td>
                          <td className="border border-gray-200 px-4 py-3 whitespace-pre-wrap text-gray-800">{contact.message}</td>
                          <td className="border border-gray-200 px-4 py-3 text-gray-800">
                            {new Date(contact.created_at).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </td>
                        </tr>
                      ))}
                      {contacts.length === 0 && (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-6 text-gray-500 text-lg"
                          >
                            No messages received.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 mt-6">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200"
                    >
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <span className="font-semibold text-purple-900">ID:</span>{' '}
                          <span className="text-gray-800">{contact.id}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-purple-900">Name:</span>{' '}
                          <span className="text-gray-800">{contact.name}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-purple-900">Email:</span>{' '}
                          <span className="text-gray-800">{contact.email || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-purple-900">Phone:</span>{' '}
                          <span className="text-gray-800">{contact.phone || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-purple-900">Message:</span>{' '}
                          <span className="text-gray-800 whitespace-pre-wrap">{contact.message}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-purple-900">SEO Title:</span>{' '}
                          <span className="text-gray-800">{contact.seo_title || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-purple-900">SEO Description:</span>{' '}
                          <span className="text-gray-800 whitespace-pre-wrap">{contact.seo_description || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-purple-900">Received At:</span>{' '}
                          <span className="text-gray-800">
                            {new Date(contact.created_at).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {contacts.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500 text-lg">
                      No messages received.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}