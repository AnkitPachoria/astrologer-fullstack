'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function MenuManagement() {
  const [menus, setMenus] = useState([]);
  const [menuNames, setMenuNames] = useState(['']);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/menu`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch menus: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setMenus(data);
      toast.success('Menus fetched successfully');
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast.error('Error fetching menus: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validNames = menuNames.filter((name) => name.trim());
    if (validNames.length === 0) {
      toast.error('At least one menu name is required');
      return;
    }

    const url = editId ? `${API_URL}/api/menu/${editId}` : `${API_URL}/api/menu`;
    const method = editId ? 'PUT' : 'POST';
    const body = editId ? { name: validNames[0] } : { names: validNames };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to save menu: ${response.status} ${response.statusText} - ${errorData}`);
      }
      await response.json(); // Parse response to ensure it's processed
      setMenuNames(['']);
      setEditId(null);
      setShowForm(true);
      fetchMenus(); // Refresh menu list after save
      toast.success(editId ? 'Menu updated successfully' : 'Menu(s) added successfully');
    } catch (error) {
      console.error('Error saving menu:', error);
      toast.error('Error saving menu: ' + error.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/menu/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch menu: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setMenuNames([data.name]);
      setEditId(id);
      setShowForm(true);
      toast.success('Menu loaded for editing');
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Error fetching menu: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this menu?')) {
      try {
        const response = await fetch(`${API_URL}/api/menu/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error(`Failed to delete menu: ${response.status} ${response.statusText}`);
        }
        fetchMenus();
        toast.success('Menu deleted successfully');
      } catch (error) {
        console.error('Error deleting menu:', error);
        toast.error('Error deleting menu: ' + error.message);
      }
    }
  };

  const addMenuField = () => {
    setMenuNames([...menuNames, '']);
  };

  const removeMenuField = (index) => {
    if (menuNames.length > 1) {
      setMenuNames(menuNames.filter((_, i) => i !== index));
    }
  };

  const handleNameChange = (index, value) => {
    const newNames = [...menuNames];
    newNames[index] = value;
    setMenuNames(newNames);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Toaster position="top-right" reverseOrder={false} />
        <h1 className="text-3xl font-bold mb-6 text-black">Menu Management</h1>

        <div className="mb-6 flex gap-3">
          <button
            onClick={() => {
              setShowForm(true);
              setMenuNames(['']);
              setEditId(null);
            }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
          >
            Add Menu
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="bg-gray-600 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium cursor-pointer"
          >
            Show Menus
          </button>
        </div>

        {showForm ? (
          <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-6 rounded-lg shadow-md">
            {menuNames.map((name, index) => (
              <div key={index} className="mb-4 flex items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-black mb-1">
                    Menu Name {index + 1}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="mt-1 p-3 border border-gray-300 rounded-lg w-full text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter menu name"
                    style={{ color: 'black' }}
                  />
                </div>
                {!editId && menuNames.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMenuField(index)}
                    className="ml-3 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {!editId && (
              <button
                type="button"
                onClick={addMenuField}
                className="bg-gray-600 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium cursor-pointer mr-4"
              >
                Add Another Menu
              </button>
            )}
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer"
            >
              {editId ? 'Update Menu' : 'Add Menus'}
            </button>
          </form>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-black font-semibold">ID</th>
                  <th className="border border-gray-300 p-3 text-black font-semibold">Name</th>
                  <th className="border border-gray-300 p-3 text-black font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-black">{menu.id}</td>
                    <td className="border border-gray-300 p-3 text-black">{menu.name}</td>
                    <td className="border border-gray-300 p-3">
                      <button
                        onClick={() => handleEdit(menu.id)}
                        className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition-colors font-medium cursor-pointer mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(menu.id)}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer mr-2"
                      >
                        Delete
                      </button>
                      <Link href={`/menu/${menu.id}`}>
                        <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}