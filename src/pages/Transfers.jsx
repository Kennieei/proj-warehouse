import React, { useState } from 'react';

// Instead of importing MainLayout, we'll use it as a prop
// This allows the parent component to provide the layout

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle()}`}>
      {status}
    </span>
  );
};

// Transfer details component
const TransferDetails = ({ transfer, onClose }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Transfer #{transfer.id}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">From</p>
          <p className="font-medium">{transfer.source}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">To</p>
          <p className="font-medium">{transfer.destination}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Created Date</p>
          <p className="font-medium">{transfer.date}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <StatusBadge status={transfer.status} />
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium mb-2">Items</h4>
        <div className="bg-gray-50 rounded-md p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-2">Item</th>
                <th className="pb-2">Quantity</th>
                <th className="pb-2">SKU</th>
              </tr>
            </thead>
            <tbody>
              {transfer.items.map((item, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2 text-gray-600">{item.sku}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        {transfer.status === 'Pending' && (
          <>
            <button className="px-4 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100">
              Cancel
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Approve
            </button>
          </>
        )}
        {transfer.status === 'In Transit' && (
          <button className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
            Mark as Received
          </button>
        )}
      </div>
    </div>
  );
};

const Transfers = ({ MainLayout }) => {
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Sample data
  const transfers = [
    {
      id: 'TR-7829',
      source: 'Main Warehouse',
      destination: 'North Facility',
      date: 'May 10, 2025',
      status: 'Completed',
      items: [
        { name: 'Widget A', quantity: 50, sku: 'WA-1234' },
        { name: 'Widget B', quantity: 30, sku: 'WB-5678' }
      ]
    },
    {
      id: 'TR-7830',
      source: 'East Warehouse',
      destination: 'South Facility',
      date: 'May 11, 2025',
      status: 'In Transit',
      items: [
        { name: 'Gadget C', quantity: 20, sku: 'GC-9012' },
        { name: 'Gadget D', quantity: 15, sku: 'GD-3456' }
      ]
    },
    {
      id: 'TR-7831',
      source: 'South Facility',
      destination: 'Main Warehouse',
      date: 'May 12, 2025',
      status: 'Pending',
      items: [
        { name: 'Tool E', quantity: 40, sku: 'TE-7890' }
      ]
    },
    {
      id: 'TR-7832',
      source: 'North Facility',
      destination: 'East Warehouse',
      date: 'May 9, 2025',
      status: 'Cancelled',
      items: [
        { name: 'Device F', quantity: 10, sku: 'DF-1122' },
        { name: 'Device G', quantity: 25, sku: 'DG-3344' }
      ]
    }
  ];

  const filteredTransfers = filterStatus === 'All' 
    ? transfers 
    : transfers.filter(transfer => transfer.status === filterStatus);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Transfers</h1>
        <p className="text-gray-600">Manage and track inventory movements between locations</p>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilterStatus('All')}
              className={`px-3 py-1 text-sm rounded ${filterStatus === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              All Transfers
            </button>
            <button 
              onClick={() => setFilterStatus('Pending')}
              className={`px-3 py-1 text-sm rounded ${filterStatus === 'Pending' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilterStatus('In Transit')}
              className={`px-3 py-1 text-sm rounded ${filterStatus === 'In Transit' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              In Transit
            </button>
            <button 
              onClick={() => setFilterStatus('Completed')}
              className={`px-3 py-1 text-sm rounded ${filterStatus === 'Completed' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Completed
            </button>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
            New Transfer
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transfer ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{transfer.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transfer.source}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transfer.destination}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{transfer.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={transfer.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button 
                      onClick={() => setSelectedTransfer(transfer)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTransfers.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No transfers found with the selected filter.</p>
          </div>
        )}
      </div>
      
      {selectedTransfer && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl">
            <TransferDetails 
              transfer={selectedTransfer} 
              onClose={() => setSelectedTransfer(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;