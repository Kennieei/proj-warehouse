import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuditLog = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    action: '',
    resource_type: '',
    resource_id: '',
    details: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all audit logs
  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/audit_log');
      setAuditLogs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch audit logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load audit logs on component mount
  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new audit log
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/audit_log', formData);
      setFormData({
        user_id: '',
        action: '',
        resource_type: '',
        resource_id: '',
        details: ''
      });
      fetchAuditLogs();
    } catch (err) {
      setError('Failed to create audit log');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Start editing an audit log
  const handleEdit = (log) => {
    setEditingId(log.id);
    setFormData({
      user_id: log.user_id || '',
      action: log.action || '',
      resource_type: log.resource_type || '',
      resource_id: log.resource_id || '',
      details: log.details || ''
    });
  };

  // Update an audit log
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`/api/audit_log/${editingId}`, formData);
      setEditingId(null);
      setFormData({
        user_id: '',
        action: '',
        resource_type: '',
        resource_id: '',
        details: ''
      });
      fetchAuditLogs();
    } catch (err) {
      setError('Failed to update audit log');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete an audit log
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this audit log?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/audit_log/${id}`);
        fetchAuditLogs();
      } catch (err) {
        setError('Failed to delete audit log');
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
      user_id: '',
      action: '',
      resource_type: '',
      resource_id: '',
      details: ''
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Audit Log Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      <div className="mb-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Audit Log' : 'Create New Audit Log'}</h2>
        <form onSubmit={editingId ? handleUpdate : handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="user_id">User ID</label>
              <input
                type="text"
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="action">Action</label>
              <input
                type="text"
                id="action"
                name="action"
                value={formData.action}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="resource_type">Resource Type</label>
              <input
                type="text"
                id="resource_type"
                name="resource_type"
                value={formData.resource_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="resource_id">Resource ID</label>
              <input
                type="text"
                id="resource_id"
                name="resource_id"
                value={formData.resource_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2" htmlFor="details">Details</label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                rows="3"
              />
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {editingId ? 'Update' : 'Create'}
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

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>
        
        {loading && <p className="text-gray-600">Loading...</p>}
        
        {!loading && auditLogs.length === 0 ? (
          <p className="text-gray-600">No audit logs found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">User ID</th>
                  <th className="py-2 px-4 border-b">Action</th>
                  <th className="py-2 px-4 border-b">Resource Type</th>
                  <th className="py-2 px-4 border-b">Resource ID</th>
                  <th className="py-2 px-4 border-b">Timestamp</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{log.id}</td>
                    <td className="py-2 px-4 border-b">{log.user_id}</td>
                    <td className="py-2 px-4 border-b">{log.action}</td>
                    <td className="py-2 px-4 border-b">{log.resource_type}</td>
                    <td className="py-2 px-4 border-b">{log.resource_id}</td>
                    <td className="py-2 px-4 border-b">
                      {log.created_at && new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(log)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
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
    </div>
  );
};

export default AuditLog;