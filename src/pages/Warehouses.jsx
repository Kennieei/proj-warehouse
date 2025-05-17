import React, { useState } from 'react';

function Warehouses() {
  const [warehouses, setWarehouses] = useState([
    {
      id: 1,
      name: 'Warehouse A',
      location: 'New York',
      capacity: '5000 sq ft',
      items: 456,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Warehouse B',
      location: 'Los Angeles',
      capacity: '7000 sq ft',
      items: 789,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Warehouse C',
      location: 'Chicago',
      capacity: '4000 sq ft',
      items: 234,
      status: 'Active'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState({
    name: '',
    location: '',
    capacity: '',
  });

  const handleAddWarehouse = () => {
    setIsModalOpen(true);
  };

  const handleSaveWarehouse = () => {
    // Logic to save new warehouse
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Warehouses</h1>
        <button 
          onClick={handleAddWarehouse}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add New Warehouse
        </button>
      </div>

      {/* Warehouses Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Capacity</th>
              <th className="p-3 text-left">Total Items</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((warehouse) => (
              <tr key={warehouse.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{warehouse.name}</td>
                <td className="p-3">{warehouse.location}</td>
                <td className="p-3">{warehouse.capacity}</td>
                <td className="p-3">{warehouse.items}</td>
                <td className="p-3">
                  <span className={`
                    px-2 py-1 rounded text-xs 
                    ${warehouse.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  `}>
                    {warehouse.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Warehouse Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4">Add New Warehouse</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Warehouse Name</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={currentWarehouse.name}
                  onChange={(e) => setCurrentWarehouse({...currentWarehouse, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={currentWarehouse.location}
                  onChange={(e) => setCurrentWarehouse({...currentWarehouse, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={currentWarehouse.capacity}
                  onChange={(e) => setCurrentWarehouse({...currentWarehouse, capacity: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveWarehouse}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Warehouses;