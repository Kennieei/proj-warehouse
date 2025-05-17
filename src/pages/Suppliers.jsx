import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [currentSupplier, setCurrentSupplier] = useState({
    id: '',
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all suppliers
  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/suppliers');
      setSuppliers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch suppliers: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSupplier({ ...currentSupplier, [name]: value });
  };

  // Reset form
  const resetForm = () => {
    setCurrentSupplier({
      id: '',
      name: '',
      contact_name: '',
      email: '',
      phone: '',
      address: '',
      status: 'active'
    });
    setIsEditing(false);
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isEditing) {
        // Update existing supplier
        await axios.put(`/api/suppliers/${currentSupplier.id}`, currentSupplier);
      } else {
        // Create new supplier
        await axios.post('/api/suppliers', currentSupplier);
      }
      
      fetchSuppliers();
      resetForm();
      setError('');
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} supplier: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit supplier
  const handleEdit = (supplier) => {
    setCurrentSupplier(supplier);
    setIsEditing(true);
  };

  // Delete supplier
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`/api/suppliers/${id}`);
      fetchSuppliers();
      setError('');
    } catch (err) {
      setError('Failed to delete supplier: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Supplier Management</h1>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Supplier Form */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Supplier Name</label>
              <input
                type="text"
                name="name"
                value={currentSupplier.name || ''}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Contact Person</label>
              <input
                type="text"
                name="contact_name"
                value={currentSupplier.contact_name || ''}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={currentSupplier.email || ''}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={currentSupplier.phone || ''}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-1">Address</label>
              <textarea
                name="address"
                value={currentSupplier.address || ''}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                rows="2"
              ></textarea>
            </div>
            
            <div>
              <label className="block mb-1">Status</label>
              <select
                name="status"
                value={currentSupplier.status || 'active'}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isEditing ? 'Update Supplier' : 'Add Supplier'}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Suppliers List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Suppliers List</h2>
        
        {isLoading && !suppliers.length ? (
          <p className="text-gray-500">Loading suppliers...</p>
        ) : !suppliers.length ? (
          <p className="text-gray-500">No suppliers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Contact</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td className="p-2 border">{supplier.name}</td>
                    <td className="p-2 border">{supplier.contact_name}</td>
                    <td className="p-2 border">{supplier.email}</td>
                    <td className="p-2 border">{supplier.phone}</td>
                    <td className="p-2 border">
                      <span className={`px-2 py-1 rounded text-xs ${
                        supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {supplier.status}
                      </span>
                    </td>
                    <td className="p-2 border">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suppliers;