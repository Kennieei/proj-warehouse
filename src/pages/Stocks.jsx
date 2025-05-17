import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    product_id: '',
    warehouse_id: '',
    quantity: '',
    min_quantity: '',
    last_checked: new Date().toISOString().split('T')[0],
    unit_cost: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState({
    product_id: '',
    warehouse_id: '',
    low_stock: false
  });

  // Fetch all stocks
  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stocks');
      setStocks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stocks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products (assuming you have a products API endpoint)
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      // Use placeholder data if API fails
      setProducts([
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
        { id: 3, name: 'Product 3' }
      ]);
    }
  };

  // Fetch warehouses (assuming you have a warehouses API endpoint)
  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('/api/warehouses');
      setWarehouses(response.data);
    } catch (err) {
      console.error('Failed to fetch warehouses:', err);
      // Use placeholder data if API fails
      setWarehouses([
        { id: 1, name: 'Warehouse A' },
        { id: 2, name: 'Warehouse B' },
        { id: 3, name: 'Warehouse C' }
      ]);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchStocks();
    fetchProducts();
    fetchWarehouses();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Create new stock entry
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Convert numeric values
      const stockData = {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
        min_quantity: parseInt(formData.min_quantity, 10),
        unit_cost: parseFloat(formData.unit_cost)
      };
      await axios.post('/api/stocks', stockData);
      setFormData({
        product_id: '',
        warehouse_id: '',
        quantity: '',
        min_quantity: '',
        last_checked: new Date().toISOString().split('T')[0],
        unit_cost: '',
        notes: ''
      });
      fetchStocks();
    } catch (err) {
      setError('Failed to create stock entry');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Start editing a stock entry
  const handleEdit = (stock) => {
    setEditingId(stock.id);
    setFormData({
      product_id: stock.product_id || '',
      warehouse_id: stock.warehouse_id || '',
      quantity: stock.quantity || '',
      min_quantity: stock.min_quantity || '',
      last_checked: stock.last_checked ? new Date(stock.last_checked).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      unit_cost: stock.unit_cost || '',
      notes: stock.notes || ''
    });
  };

  // Update a stock entry
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Convert numeric values
      const stockData = {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
        min_quantity: parseInt(formData.min_quantity, 10),
        unit_cost: parseFloat(formData.unit_cost)
      };
      await axios.put(`/api/stocks/${editingId}`, stockData);
      setEditingId(null);
      setFormData({
        product_id: '',
        warehouse_id: '',
        quantity: '',
        min_quantity: '',
        last_checked: new Date().toISOString().split('T')[0],
        unit_cost: '',
        notes: ''
      });
      fetchStocks();
    } catch (err) {
      setError('Failed to update stock entry');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a stock entry
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stock entry?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/stocks/${id}`);
        fetchStocks();
      } catch (err) {
        setError('Failed to delete stock entry');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      product_id: '',
      warehouse_id: '',
      quantity: '',
      min_quantity: '',
      last_checked: new Date().toISOString().split('T')[0],
      unit_cost: '',
      notes: ''
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Filter stocks
  const filteredStocks = stocks.filter(stock => {
    return (
      (filter.product_id === '' || stock.product_id.toString() === filter.product_id) &&
      (filter.warehouse_id === '' || stock.warehouse_id.toString() === filter.warehouse_id) &&
      (!filter.low_stock || (stock.quantity <= stock.min_quantity))
    );
  });

  // Get product name by ID
  const getProductName = (productId) => {
    const product = products.find(p => p.id.toString() === productId.toString());
    return product ? product.name : `Product ${productId}`;
  };

  // Get warehouse name by ID
  const getWarehouseName = (warehouseId) => {
    const warehouse = warehouses.find(w => w.id.toString() === warehouseId.toString());
    return warehouse ? warehouse.name : `Warehouse ${warehouseId}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {/* Stock Form */}
      <div className="mb-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Stock Entry' : 'Add New Stock'}</h2>
        <form onSubmit={editingId ? handleUpdate : handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="product_id">Product</label>
              <select
                id="product_id"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="warehouse_id">Warehouse</label>
              <select
                id="warehouse_id"
                name="warehouse_id"
                value={formData.warehouse_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select Warehouse</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="min_quantity">Minimum Quantity</label>
              <input
                type="number"
                id="min_quantity"
                name="min_quantity"
                value={formData.min_quantity}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="unit_cost">Unit Cost ($)</label>
              <input
                type="number"
                id="unit_cost"
                name="unit_cost"
                value={formData.unit_cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="last_checked">Last Checked</label>
              <input
                type="date"
                id="last_checked"
                name="last_checked"
                value={formData.last_checked}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-gray-700 mb-2" htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                rows="2"
              />
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {editingId ? 'Update Stock' : 'Add Stock'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Filter Inventory</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 mb-1 text-sm" htmlFor="filter_product">Product</label>
            <select
              id="filter_product"
              name="product_id"
              value={filter.product_id}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded text-sm"
            >
              <option value="">All Products</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1 text-sm" htmlFor="filter_warehouse">Warehouse</label>
            <select
              id="filter_warehouse"
              name="warehouse_id"
              value={filter.warehouse_id}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded text-sm"
            >
              <option value="">All Warehouses</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center h-10">
              <input
                type="checkbox"
                name="low_stock"
                checked={filter.low_stock}
                onChange={handleFilterChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Show Low Stock Only</span>
            </label>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFilter({ product_id: '', warehouse_id: '', low_stock: false })}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stocks Table */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Inventory {filteredStocks.length > 0 ? `(${filteredStocks.length} items)` : ''}
        </h2>
        
        {loading && <p className="text-gray-600">Loading...</p>}
        
        {!loading && filteredStocks.length === 0 ? (
          <p className="text-gray-600">No stock entries found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Product</th>
                  <th className="py-2 px-4 border-b">Warehouse</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Min Qty</th>
                  <th className="py-2 px-4 border-b">Unit Cost</th>
                  <th className="py-2 px-4 border-b">Last Checked</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map(stock => (
                  <tr key={stock.id} className={`hover:bg-gray-50 ${stock.quantity <= stock.min_quantity ? 'bg-red-50' : ''}`}>
                    <td className="py-2 px-4 border-b">{stock.id}</td>
                    <td className="py-2 px-4 border-b">{getProductName(stock.product_id)}</td>
                    <td className="py-2 px-4 border-b">{getWarehouseName(stock.warehouse_id)}</td>
                    <td className={`py-2 px-4 border-b font-semibold ${stock.quantity <= stock.min_quantity ? 'text-red-600' : ''}`}>
                      {stock.quantity}
                    </td>
                    <td className="py-2 px-4 border-b">{stock.min_quantity}</td>
                    <td className="py-2 px-4 border-b">
                      {stock.unit_cost ? formatCurrency(stock.unit_cost) : '-'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {stock.last_checked && new Date(stock.last_checked).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(stock)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(stock.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm"
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
      
      {/* Stock Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Total Inventory Value</h3>
          <p className="text-2xl font-bold">
            {formatCurrency(
              stocks.reduce((total, stock) => total + (stock.quantity * (stock.unit_cost || 0)), 0)
            )}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Total Items</h3>
          <p className="text-2xl font-bold">
            {stocks.reduce((total, stock) => total + (stock.quantity || 0), 0)}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Low Stock Items</h3>
          <p className="text-2xl font-bold text-red-600">
            {stocks.filter(stock => stock.quantity <= stock.min_quantity).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stocks;