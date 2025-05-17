import React, { useState, useEffect } from 'react';

function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: 'Laptop X',
      category: 'Electronics',
      warehouses: [
        { name: 'Warehouse A', quantity: 50, minStock: 20 },
        { name: 'Warehouse B', quantity: 30, minStock: 15 }
      ],
      unitPrice: 1200,
      totalQuantity: 80,
      status: 'In Stock'
    },
    {
      id: 2,
      name: 'Office Chair',
      category: 'Furniture',
      warehouses: [
        { name: 'Warehouse C', quantity: 25, minStock: 10 },
        { name: 'Warehouse D', quantity: 15, minStock: 5 }
      ],
      unitPrice: 250,
      totalQuantity: 40,
      status: 'Low Stock'
    },
    {
      id: 3,
      name: 'Monitor Y',
      category: 'Electronics',
      warehouses: [
        { name: 'Warehouse B', quantity: 75, minStock: 30 }
      ],
      unitPrice: 300,
      totalQuantity: 75,
      status: 'In Stock'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    category: '',
    warehouses: [{ name: '', quantity: 0, minStock: 0 }],
    unitPrice: 0
  });

  const [filter, setFilter] = useState({
    search: '',
    category: '',
    status: ''
  });

  const handleAddItem = () => {
    setCurrentItem({
      name: '',
      category: '',
      warehouses: [{ name: '', quantity: 0, minStock: 0 }],
      unitPrice: 0
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = () => {
    // Basic validation
    if (!currentItem.name || currentItem.warehouses.some(w => !w.name)) {
      alert('Please fill in all required fields');
      return;
    }

    // Calculate total quantity and status
    const totalQuantity = currentItem.warehouses.reduce((sum, w) => sum + w.quantity, 0);
    const status = currentItem.warehouses.some(w => w.quantity < w.minStock) ? 'Low Stock' : 'In Stock';

    const newItem = {
      ...currentItem,
      id: inventoryItems.length + 1,
      totalQuantity,
      status
    };

    setInventoryItems([...inventoryItems, newItem]);
    setIsModalOpen(false);
  };

  const filteredItems = inventoryItems.filter(item => 
    (filter.search ? item.name.toLowerCase().includes(filter.search.toLowerCase()) : true) &&
    (filter.category ? item.category === filter.category : true) &&
    (filter.status ? item.status === filter.status : true)
  );

  const addWarehouseRow = () => {
    setCurrentItem({
      ...currentItem,
      warehouses: [...currentItem.warehouses, { name: '', quantity: 0, minStock: 0 }]
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <button 
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <input 
          type="text" 
          placeholder="Search items..." 
          className="border p-2 rounded w-1/3"
          value={filter.search}
          onChange={(e) => setFilter({...filter, search: e.target.value})}
        />
        <select 
          className="border p-2 rounded"
          value={filter.category}
          onChange={(e) => setFilter({...filter, category: e.target.value})}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
        </select>
        <select 
          className="border p-2 rounded"
          value={filter.status}
          onChange={(e) => setFilter({...filter, status: e.target.value})}
        >
          <option value="">All Statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">Item Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Warehouses</th>
              <th className="p-3 text-left">Total Quantity</th>
              <th className="p-3 text-left">Unit Price</th>
              <th className="p-3 text-left">Total Value</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">
                  {item.warehouses.map((w, index) => (
                    <div key={index} className="mb-1">
                      {w.name}: {w.quantity}
                    </div>
                  ))}
                </td>
                <td className="p-3">{item.totalQuantity}</td>
                <td className="p-3">${item.unitPrice.toLocaleString()}</td>
                <td className="p-3">${(item.totalQuantity * item.unitPrice).toLocaleString()}</td>
                <td className="p-3">
                  <span className={`
                    px-2 py-1 rounded text-xs 
                    ${item.status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {item.status}
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

      {/* Add/Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Inventory Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input 
                  type="text" 
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={currentItem.category}
                  onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                <input 
                  type="number" 
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={currentItem.unitPrice}
                  onChange={(e) => setCurrentItem({...currentItem, unitPrice: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse Locations</label>
                {currentItem.warehouses.map((warehouse, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                    <select
                      className="border p-2 rounded"
                      value={warehouse.name}
                      onChange={(e) => {
                        const newWarehouses = [...currentItem.warehouses];
                        newWarehouses[index].name = e.target.value;
                        setCurrentItem({...currentItem, warehouses: newWarehouses});
                      }}
                    >
                      <option value="">Select Warehouse</option>
                      <option value="Warehouse A">Warehouse A</option>
                      <option value="Warehouse B">Warehouse B</option>
                      <option value="Warehouse C">Warehouse C</option>
                      <option value="Warehouse D">Warehouse D</option>
                    </select>
                    <input 
                      type="number" 
                      placeholder="Quantity"
                      className="border p-2 rounded"
                      value={warehouse.quantity}
                      onChange={(e) => {
                        const newWarehouses = [...currentItem.warehouses];
                        newWarehouses[index].quantity = parseInt(e.target.value) || 0;
                        setCurrentItem({...currentItem, warehouses: newWarehouses});
                      }}
                    />
                    <input 
                      type="number" 
                      placeholder="Min Stock"
                      className="border p-2 rounded"
                      value={warehouse.minStock}
                      onChange={(e) => {
                        const newWarehouses = [...currentItem.warehouses];
                        newWarehouses[index].minStock = parseInt(e.target.value) || 0;
                        setCurrentItem({...currentItem, warehouses: newWarehouses});
                      }}
                    />
                  </div>
                ))}
                <button 
                  onClick={addWarehouseRow}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  + Add Another Warehouse
                </button>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;