import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Get all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    });
  };

  // Handle form submission for adding or updating products
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`/api/products/${currentProductId}`, formData);
      } else {
        await axios.post('/api/products', formData);
      }
      // Reset form and refresh products
      setFormData({ name: '', description: '', price: '', category: '' });
      setEditMode(false);
      setCurrentProductId(null);
      fetchProducts();
    } catch (err) {
      setError(editMode ? 'Failed to update product' : 'Failed to add product');
      console.error('Error:', err);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category
    });
    setEditMode(true);
    setCurrentProductId(product.id);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ name: '', description: '', price: '', category: '' });
    setEditMode(false);
    setCurrentProductId(null);
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="products-container">
      <h1>Product Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="product-form-container">
        <h2>{editMode ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit">{editMode ? 'Update Product' : 'Add Product'}</button>
            {editMode && (
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="products-list">
        <h2>Products List</h2>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <style jsx>{`
        .products-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        h1 {
          color: #333;
          text-align: center;
          margin-bottom: 30px;
        }
        
        h2 {
          color: #444;
          margin-bottom: 15px;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .loading {
          text-align: center;
          font-size: 18px;
          margin: 40px 0;
        }
        
        .product-form-container {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        input, textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        
        textarea {
          height: 100px;
          resize: vertical;
        }
        
        .form-buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        
        button {
          cursor: pointer;
          padding: 10px 15px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        
        button:hover {
          background-color: #388e3c;
        }
        
        button.edit-btn {
          background-color: #2196f3;
        }
        
        button.edit-btn:hover {
          background-color: #1976d2;
        }
        
        button.delete-btn {
          background-color: #f44336;
        }
        
        button.delete-btn:hover {
          background-color: #d32f2f;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        
        tr:hover {
          background-color: #f9f9f9;
        }
        
        td button {
          margin-right: 5px;
          padding: 6px 10px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default Products;