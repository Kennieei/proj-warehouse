import React, { useState } from 'react';

// Role badge component
const RoleBadge = ({ role }) => {
  const getRoleStyle = () => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Manager':
        return 'bg-blue-100 text-blue-800';
      case 'Warehouse Staff':
        return 'bg-green-100 text-green-800';
      case 'Viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleStyle()}`}>
      {role}
    </span>
  );
};

// User details component
const UserDetails = ({ user, onClose, onSave }) => {
  const [userData, setUserData] = useState({...user});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(userData);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">{user.id ? 'Edit User' : 'Add New User'}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={userData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Warehouse Staff">Warehouse Staff</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              name="location"
              value={userData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="Main Warehouse">Main Warehouse</option>
              <option value="North Facility">North Facility</option>
              <option value="South Facility">South Facility</option>
              <option value="East Warehouse">East Warehouse</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Access Permissions</label>
          <div className="bg-gray-50 p-4 rounded grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-blue-600" checked={userData.permissions?.inventory} onChange={(e) => setUserData({...userData, permissions: {...userData.permissions, inventory: e.target.checked}})} />
              <span className="text-sm">Inventory Management</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-blue-600" checked={userData.permissions?.transfers} onChange={(e) => setUserData({...userData, permissions: {...userData.permissions, transfers: e.target.checked}})} />
              <span className="text-sm">Transfer Management</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-blue-600" checked={userData.permissions?.reports} onChange={(e) => setUserData({...userData, permissions: {...userData.permissions, reports: e.target.checked}})} />
              <span className="text-sm">View Reports</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-blue-600" checked={userData.permissions?.users} onChange={(e) => setUserData({...userData, permissions: {...userData.permissions, users: e.target.checked}})} />
              <span className="text-sm">User Management</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            {user.id ? 'Update User' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [filterRole, setFilterRole] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data
  const [users, setUsers] = useState([
    {
      id: 'USR-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      role: 'Admin',
      location: 'Main Warehouse',
      lastActive: 'Today at 10:23 AM',
      permissions: {
        inventory: true,
        transfers: true,
        reports: true,
        users: true
      }
    },
    {
      id: 'USR-002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '(555) 987-6543',
      role: 'Manager',
      location: 'North Facility',
      lastActive: 'Yesterday at 3:45 PM',
      permissions: {
        inventory: true,
        transfers: true,
        reports: true,
        users: false
      }
    },
    {
      id: 'USR-003',
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.j@example.com',
      phone: '(555) 456-7890',
      role: 'Warehouse Staff',
      location: 'South Facility',
      lastActive: 'May 12, 2025',
      permissions: {
        inventory: true,
        transfers: true,
        reports: false,
        users: false
      }
    },
    {
      id: 'USR-004',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.d@example.com',
      phone: '(555) 234-5678',
      role: 'Viewer',
      location: 'East Warehouse',
      lastActive: 'May 10, 2025',
      permissions: {
        inventory: false,
        transfers: false,
        reports: true,
        users: false
      }
    }
  ]);

  const handleSaveUser = (userData) => {
    if (userData.id) {
      // Update existing user
      setUsers(users.map(user => user.id === userData.id ? userData : user));
    } else {
      // Add new user with generated ID
      const newId = `USR-00${users.length + 1}`;
      setUsers([...users, { ...userData, id: newId, lastActive: 'Just added' }]);
    }
    setSelectedUser(null);
    setIsAddingUser(false);
  };

  const handleAddNewUser = () => {
    setIsAddingUser(true);
    setSelectedUser({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'Warehouse Staff',
      location: 'Main Warehouse',
      permissions: {
        inventory: false,
        transfers: false,
        reports: false,
        users: false
      }
    });
  };

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesSearch = searchTerm === '' || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesSearch;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600">Manage user accounts and access permissions</p>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <select 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)}
                className="p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Warehouse Staff">Warehouse Staff</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <button 
            onClick={handleAddNewUser}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Add New User
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm mr-3">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-500">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.lastActive}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Disable
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No users found matching your filters.</p>
          </div>
        )}
      </div>
      
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl">
            <UserDetails 
              user={selectedUser} 
              onClose={() => {
                setSelectedUser(null);
                setIsAddingUser(false);
              }} 
              onSave={handleSaveUser}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;