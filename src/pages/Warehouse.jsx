import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Warehouse = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0
  });

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = async (id) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setSelectedProduct(response.data);
    } catch (err) {
      setError('Failed to fetch product details');
      console.error(err);
    }
  };

  const handleCreateNew = () => {
    setFormData({
      name: '',
      description: '',
      quantity: 0,
      price: 0
    });
    setIsEditing(true);
    setSelectedProduct(null);
  };

  const handleEditProduct = () => {
    setFormData({
      name: selectedProduct.name || '',
      description: selectedProduct.description || '',
      quantity: selectedProduct.quantity || 0,
      price: selectedProduct.price || 0
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        // Update existing product
        await axios.put(`/api/products/${selectedProduct.id}`, formData);
      } else {
        // Create new product
        await axios.post('/api/products', formData);
      }
      
      // Reset form and refresh product list
      setIsEditing(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      setError(selectedProduct ? 'Failed to update product' : 'Failed to create product');
      console.error(err);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${selectedProduct.id}`);
        setSelectedProduct(null);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      description: '',
      quantity: 0,
      price: 0
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading products...</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Warehouse Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded shadow md:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Products</h2>
            <button 
              onClick={handleCreateNew}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
            >
              Add New
            </button>
          </div>
          
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No products found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {products.map(product => (
                <li 
                  key={product.id} 
                  onClick={() => handleSelectProduct(product.id)}
                  className={`px-3 py-3 cursor-pointer hover:bg-gray-100 ${
                    selectedProduct && selectedProduct.id === product.id 
                      ? 'bg-green-50 border-l-4 border-green-500' 
                      : ''
                  }`}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">Qty: {product.quantity}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="bg-white p-6 rounded shadow md:col-span-2">
          {isEditing ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Name:</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Description:</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Quantity:</label>
                    <input 
                      type="number" 
                      name="quantity" 
                      value={formData.quantity} 
                      onChange={handleInputChange} 
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Price ($):</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleInputChange} 
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    type="submit" 
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium"
                  >
                    {selectedProduct ? 'Update' : 'Create'}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : selectedProduct ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">{selectedProduct.name}</h2>
              <div className="bg-gray-50 p-4 rounded mb-6">
                <p className="mb-2"><span className="font-semibold">Description:</span> {selectedProduct.description || 'No description'}</p>
                <p className="mb-2"><span className="font-semibold">Quantity:</span> {selectedProduct.quantity}</p>
                <p><span className="font-semibold">Price:</span> ${selectedProduct.price?.toFixed(2)}</p>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={handleEditProduct}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium"
                >
                  Edit
                </button>
                <button 
                  onClick={handleDeleteProduct}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded text-gray-500">
              Select a product from the list or add a new one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Warehouse;