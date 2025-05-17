import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    order_date: new Date().toISOString().split('T')[0],
    total_amount: '',
    status: 'pending',
    shipping_address: '',
    payment_method: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new order
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Convert total_amount to a number
      const orderData = {
        ...formData,
        total_amount: parseFloat(formData.total_amount)
      };
      await axios.post('/api/orders', orderData);
      setFormData({
        customer_id: '',
        order_date: new Date().toISOString().split('T')[0],
        total_amount: '',
        status: 'pending',
        shipping_address: '',
        payment_method: ''
      });
      fetchOrders();
    } catch (err) {
      setError('Failed to create order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch order details
  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/${id}`);
      setViewDetails(response.data);
    } catch (err) {
      setError('Failed to fetch order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Start editing an order
  const handleEdit = (order) => {
    setEditingId(order.id);
    setFormData({
      customer_id: order.customer_id || '',
      order_date: order.order_date ? new Date(order.order_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      total_amount: order.total_amount || '',
      status: order.status || 'pending',
      shipping_address: order.shipping_address || '',
      payment_method: order.payment_method || ''
    });
  };

  // Update an order
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Convert total_amount to a number
      const orderData = {
        ...formData,
        total_amount: parseFloat(formData.total_amount)
      };
      await axios.put(`/api/orders/${editingId}`, orderData);
      setEditingId(null);
      setFormData({
        customer_id: '',
        order_date: new Date().toISOString().split('T')[0],
        total_amount: '',
        status: 'pending',
        shipping_address: '',
        payment_method: ''
      });
      fetchOrders();
    } catch (err) {
      setError('Failed to update order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete an order
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/orders/${id}`);
        fetchOrders();
      } catch (err) {
        setError('Failed to delete order');
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
      customer_id: '',
      order_date: new Date().toISOString().split('T')[0],
      total_amount: '',
      status: 'pending',
      shipping_address: '',
      payment_method: ''
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Close order details
  const closeDetails = () => {
    setViewDetails(null);
  };

  // Get status color class
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800'; // For 'pending' or any other status
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {/* Order Form */}
      <div className="mb-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Order' : 'Create New Order'}</h2>
        <form onSubmit={editingId ? handleUpdate : handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="customer_id">Customer ID</label>
              <input
                type="text"
                id="customer_id"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="order_date">Order Date</label>
              <input
                type="date"
                id="order_date"
                name="order_date"
                value={formData.order_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="total_amount">Total Amount ($)</label>
              <input
                type="number"
                id="total_amount"
                name="total_amount"
                value={formData.total_amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="payment_method">Payment Method</label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select Payment Method</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2" htmlFor="shipping_address">Shipping Address</label>
              <textarea
                id="shipping_address"
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                rows="3"
                required
              />
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {editingId ? 'Update Order' : 'Create Order'}
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

      {/* Orders Table */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        
        {loading && !viewDetails && <p className="text-gray-600">Loading...</p>}
        
        {!loading && orders.length === 0 ? (
          <p className="text-gray-600">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Customer</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{order.id}</td>
                    <td className="py-2 px-4 border-b">{order.customer_id}</td>
                    <td className="py-2 px-4 border-b">
                      {order.order_date && new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => fetchOrderDetails(order.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(order)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
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

      {/* Order Details Modal */}
      {viewDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <button 
                onClick={closeDetails}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600">Order ID:</p>
                <p className="font-semibold">{viewDetails.id}</p>
              </div>
              
              <div>
                <p className="text-gray-600">Customer ID:</p>
                <p className="font-semibold">{viewDetails.customer_id}</p>
              </div>
              
              <div>
                <p className="text-gray-600">Order Date:</p>
                <p className="font-semibold">
                  {viewDetails.order_date && new Date(viewDetails.order_date).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <p className="text-gray-600">Total Amount:</p>
                <p className="font-semibold">{formatCurrency(viewDetails.total_amount)}</p>
              </div>
              
              <div>
                <p className="text-gray-600">Status:</p>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(viewDetails.status)}`}>
                    {viewDetails.status}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-gray-600">Payment Method:</p>
                <p className="font-semibold">{viewDetails.payment_method}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600">Shipping Address:</p>
              <p className="font-semibold whitespace-pre-line">{viewDetails.shipping_address}</p>
            </div>
            
            {viewDetails.created_at && (
              <div className="text-xs text-gray-500 mt-4">
                <p>Created: {new Date(viewDetails.created_at).toLocaleString()}</p>
                {viewDetails.updated_at && (
                  <p>Last Updated: {new Date(viewDetails.updated_at).toLocaleString()}</p>
                )}
              </div>
            )}
            
            <div className="mt-6">
              <button
                onClick={closeDetails}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;