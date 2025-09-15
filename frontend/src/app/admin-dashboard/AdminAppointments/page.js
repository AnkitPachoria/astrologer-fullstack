'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import ProtectedRoute from '@/components/ProtectedRoute'; 
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/appointments`);
        setAppointments(res.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        toast.error('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Confirm deletion?')) return;
    try {
      const res = await axios.delete(`${API_URL}/api/appointments/${id}`);
      if (res.status === 200) {
        toast.success('Appointment deleted');
        setAppointments(appointments.filter((appointment) => appointment.id !== id));
        if (selectedAppointment?.id === id) setSelectedAppointment(null);
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
     <ProtectedRoute>
    <div className="container w-full mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Appointment Management</h1>
      </div>

      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Appointments List</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-600">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">ID</th>
                  <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Name</th>
                  <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Email</th>
                  <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Contact</th>
                  <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">DOB</th>
                  <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Other Request</th>
                  <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Confirmed</th>
                  <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Created At</th>
                  <th className="border border-gray-200 p-2 sm:p-3 text-left text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-2 sm:p-3 text-black">{appointment.id}</td>
                    <td className="border border-gray-200 p-2 sm:p-3 text-black">{appointment.name}</td>
                    <td className="border border-gray-200 p-2 sm:p-3 text-black">{appointment.email}</td>
                    <td className="border border-gray-200 p-2 sm:p-3 text-black">{appointment.contact}</td>
                    <td className="border border-gray-200 p-2 sm:p-3 text-black">
                      {new Date(appointment.dob).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-200 p-2 sm:p-3 text-black">
                      <div className="truncate max-w-[150px] sm:max-w-[200px]">
                        {appointment.other_request ? appointment.other_request.substring(0, 50) + (appointment.other_request.length > 50 ? '...' : '') : 'N/A'}
                      </div>
                    </td>
                    <td className="border border-gray-200 p-2 sm:p-3 text-black">
                      {appointment.confirm_details ? 'Yes' : 'No'}
                    </td>
                    <td className="border border-gray-200 p-2 sm:p-3 text-black">
                      {new Date(appointment.created_at).toLocaleString()}
                    </td>
                    <td className="border border-gray-200 p-2 sm:p-3 space-x-2">
                      <button
                        onClick={() => handleView(appointment)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
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

      {/* View Appointment Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-red-500 hover:text-red-700"
                aria-label="Close Modal"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID</label>
                <p className="mt-1 text-black">{selectedAppointment.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-black">{selectedAppointment.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-black">{selectedAppointment.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <p className="mt-1 text-black">{selectedAppointment.contact}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="mt-1 text-black">{new Date(selectedAppointment.dob).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Other Request</label>
                <p className="mt-1 text-black">{selectedAppointment.other_request || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirmed</label>
                <p className="mt-1 text-black">{selectedAppointment.confirm_details ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Created At</label>
                <p className="mt-1 text-black">{new Date(selectedAppointment.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}