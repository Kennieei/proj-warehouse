import React, { useState } from 'react';

// Tab component for settings sections
const SettingsTab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium text-sm rounded-t-lg border-b-2 ${
      active
        ? 'text-blue-600 border-blue-600 bg-white'
        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {label}
  </button>
);

// Settings card component
const SettingsCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-sm mb-6">
    <div className="border-b px-6 py-4">
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Switch toggle component
const ToggleSwitch = ({ enabled, onChange, label }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${enabled ? 'bg-blue-600' : 'bg-gray-200'}
      `}
      role="switch"
      aria-checked={enabled}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
          transition duration-200 ease-in-out
          ${enabled ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  // General settings state
  const [companyName, setCompanyName] = useState('Inventory Pro, Inc.');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [autoReorder, setAutoReorder] = useState(false);
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState({
    lowStock: true,
    newTransfer: true,
    transferCompleted: true,
    userActivity: false,
    systemUpdates: true,
  });
  
  // Integration settings state
  const [integrations, setIntegrations] = useState({
    erp: {
      enabled: true,
      apiKey: 'sk_erp_7a8b9c0d1e2f',
      syncFrequency: 'hourly',
    },
    ecommerce: {
      enabled: false,
      apiKey: '',
      syncFrequency: 'daily',
    },
    accounting: {
      enabled: true,
      apiKey: 'sk_acc_3e4f5g6h7i8j',
      syncFrequency: 'daily',
    }
  });
  
  // Handle form submissions
  const handleGeneralSettingsSubmit = (e) => {
    e.preventDefault();
    // Save general settings
    console.log('General settings saved');
  };
  
  const handleNotificationSettingsSubmit = (e) => {
    e.preventDefault();
    // Save notification settings
    console.log('Notification settings saved');
  };
  
  const handleIntegrationUpdate = (key, field, value) => {
    setIntegrations({
      ...integrations,
      [key]: {
        ...integrations[key],
        [field]: value
      }
    });
  };
  
  const handleEmailNotificationChange = (key, value) => {
    setEmailNotifications({
      ...emailNotifications,
      [key]: value
    });
  };
  
  // Warehouses data for locations tab
  const [warehouses, setWarehouses] = useState([
    {
      id: 'WH001',
      name: 'Main Warehouse',
      address: '123 Storage Rd, Warehouse City, WC 12345',
      manager: 'John Doe',
      isActive: true
    },
    {
      id: 'WH002',
      name: 'North Facility',
      address: '456 Depot St, North Town, NT 23456',
      manager: 'Jane Smith',
      isActive: true
    },
    {
      id: 'WH003',
      name: 'South Facility',
      address: '789 Supply Ave, South City, SC 34567',
      manager: 'Robert Johnson',
      isActive: true
    },
    {
      id: 'WH004',
      name: 'East Warehouse',
      address: '101 Logistics Blvd, East Harbor, EH 45678',
      manager: 'Emily Davis',
      isActive: false
    }
  ]);
  
  const [newWarehouse, setNewWarehouse] = useState({
    name: '',
    address: '',
    manager: '',
    isActive: true
  });
  
  const handleAddWarehouse = (e) => {
    e.preventDefault();
    const id = `WH00${warehouses.length + 1}`;
    setWarehouses([...warehouses, { ...newWarehouse, id }]);
    setNewWarehouse({ name: '', address: '', manager: '', isActive: true });
  };
  
  const handleWarehouseStatusChange = (id, isActive) => {
    setWarehouses(
      warehouses.map(wh => 
        wh.id === id ? { ...wh, isActive } : wh
      )
    );
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Configure system settings and preferences</p>
      </div>
      
      {/* Settings tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <SettingsTab
            label="General"
            active={activeTab === 'general'}
            onClick={() => setActiveTab('general')}
          />
          <SettingsTab
            label="Notifications"
            active={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
          />
          <SettingsTab
            label="Locations"
            active={activeTab === 'locations'}
            onClick={() => setActiveTab('locations')}
          />
          <SettingsTab
            label="Integrations"
            active={activeTab === 'integrations'}
            onClick={() => setActiveTab('integrations')}
          />
          <SettingsTab
            label="System"
            active={activeTab === 'system'}
            onClick={() => setActiveTab('system')}
          />
        </nav>
      </div>
      
      {/* General settings tab */}
      {activeTab === 'general' && (
        <div>
          <SettingsCard title="Company Information">
            <form onSubmit={handleGeneralSettingsSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Zone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">System Preferences</h4>
                <ToggleSwitch
                  enabled={lowStockAlert}
                  onChange={setLowStockAlert}
                  label="Enable low stock alerts"
                />
                <ToggleSwitch
                  enabled={autoReorder}
                  onChange={setAutoReorder}
                  label="Enable automatic reordering"
                />
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </SettingsCard>
        </div>
      )}
      
      {/* Notifications settings tab */}
      {activeTab === 'notifications' && (
        <div>
          <SettingsCard title="Email Notifications">
            <form onSubmit={handleNotificationSettingsSubmit}>
              <div className="space-y-3">
                <ToggleSwitch
                  enabled={emailNotifications.lowStock}
                  onChange={(val) => handleEmailNotificationChange('lowStock', val)}
                  label="Low stock alerts"
                />
                <ToggleSwitch
                  enabled={emailNotifications.newTransfer}
                  onChange={(val) => handleEmailNotificationChange('newTransfer', val)}
                  label="New transfer requests"
                />
                <ToggleSwitch
                  enabled={emailNotifications.transferCompleted}
                  onChange={(val) => handleEmailNotificationChange('transferCompleted', val)}
                  label="Transfer completion"
                />
                <ToggleSwitch
                  enabled={emailNotifications.userActivity}
                  onChange={(val) => handleEmailNotificationChange('userActivity', val)}
                  label="User activity logs"
                />
                <ToggleSwitch
                  enabled={emailNotifications.systemUpdates}
                  onChange={(val) => handleEmailNotificationChange('systemUpdates', val)}
                  label="System updates and maintenance"
                />
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </SettingsCard>
        </div>
      )}
      
      {/* Locations settings tab */}
      {activeTab === 'locations' && (
        <div>
          <SettingsCard title="Warehouse Locations">
            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {warehouses.map((warehouse) => (
                    <tr key={warehouse.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warehouse.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{warehouse.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warehouse.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warehouse.manager}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            warehouse.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {warehouse.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleWarehouseStatusChange(warehouse.id, !warehouse.isActive)}
                          className={`${
                            warehouse.isActive
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {warehouse.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="ml-3 text-blue-600 hover:text-blue-900">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-800 mb-4">Add New Warehouse</h4>
              <form onSubmit={handleAddWarehouse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warehouse Name
                  </label>
                  <input
                    type="text"
                    value={newWarehouse.name}
                    onChange={(e) => setNewWarehouse({...newWarehouse, name: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manager
                  </label>
                  <input
                    type="text"
                    value={newWarehouse.manager}
                    onChange={(e) => setNewWarehouse({...newWarehouse, manager: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newWarehouse.address}
                    onChange={(e) => setNewWarehouse({...newWarehouse, address: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    id="warehouseActive"
                    checked={newWarehouse.isActive}
                    onChange={(e) => setNewWarehouse({...newWarehouse, isActive: e.target.checked})}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="warehouseActive" className="ml-2 text-sm text-gray-700">
                    Set as active
                  </label>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Warehouse
                  </button>
                </div>
              </form>
            </div>
          </SettingsCard>
        </div>
      )}
      
      {/* Integrations settings tab */}
      {activeTab === 'integrations' && (
        <div>
          <SettingsCard title="ERP Integration">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-800">ERP System</h4>
                  <p className="text-sm text-gray-500">Connect with your Enterprise Resource Planning system</p>
                </div>
                <ToggleSwitch
                  enabled={integrations.erp.enabled}
                  onChange={(val) => handleIntegrationUpdate('erp', 'enabled', val)}
                  label=""
                />
              </div>
              
              {integrations.erp.enabled && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={integrations.erp.apiKey}
                      onChange={(e) => handleIntegrationUpdate('erp', 'apiKey', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sync Frequency
                    </label>
                    <select
                      value={integrations.erp.syncFrequency}
                      onChange={(e) => handleIntegrationUpdate('erp', 'syncFrequency', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="15min">Every 15 minutes</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="manual">Manual Only</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </SettingsCard>
          
          <SettingsCard title="E-commerce Integration">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-800">E-commerce Platform</h4>
                  <p className="text-sm text-gray-500">Sync inventory with your online store</p>
                </div>
                <ToggleSwitch
                  enabled={integrations.ecommerce.enabled}
                  onChange={(val) => handleIntegrationUpdate('ecommerce', 'enabled', val)}
                  label=""
                />
              </div>
              
              {integrations.ecommerce.enabled && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={integrations.ecommerce.apiKey}
                      onChange={(e) => handleIntegrationUpdate('ecommerce', 'apiKey', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sync Frequency
                    </label>
                    <select
                      value={integrations.ecommerce.syncFrequency}
                      onChange={(e) => handleIntegrationUpdate('ecommerce', 'syncFrequency', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="15min">Every 15 minutes</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="manual">Manual Only</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </SettingsCard>
          
          <SettingsCard title="Accounting Integration">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-800">Accounting Software</h4>
                  <p className="text-sm text-gray-500">Connect with your accounting software</p>
                </div>
                <ToggleSwitch
                  enabled={integrations.accounting.enabled}
                  onChange={(val) => handleIntegrationUpdate('accounting', 'enabled', val)}
                  label=""
                />
              </div>
              
              {integrations.accounting.enabled && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={integrations.accounting.apiKey}
                      onChange={(e) => handleIntegrationUpdate('accounting', 'apiKey', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sync Frequency
                    </label>
                    <select
                      value={integrations.accounting.syncFrequency}
                      onChange={(e) => handleIntegrationUpdate('accounting', 'syncFrequency', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="15min">Every 15 minutes</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="manual">Manual Only</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </SettingsCard>
        </div>
      )}
      
      {/* System settings tab */}
      {activeTab === 'system' && (
        <div>
          <SettingsCard title="System Information">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Version</h4>
                  <p className="text-gray-900">Inventory Pro 2.4.1</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                  <p className="text-gray-900">May 5, 2025</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Database Size</h4>
                  <p className="text-gray-900">1.2 GB</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Active Users</h4>
                  <p className="text-gray-900">12</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded border text-left">
                <span className="text-sm font-medium">Check for Updates</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded border text-left">
                <span className="text-sm font-medium">Backup Database</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded border text-left">
                <span className="text-sm font-medium">System Logs</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
            </div>
          </SettingsCard>
          
          <SettingsCard title="Danger Zone">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Reset System Settings</h4>
                  <p className="text-sm text-gray-500">Reset all settings to default values</p>
                </div>
                <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200">
                  Reset
                </button>
              </div>
              
              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Clear All Data</h4>
                  <p className="text-sm text-gray-500">Remove all inventory, transfers, and user data</p>
                </div>
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
                  Clear Data
                </button>
              </div>
            </div>
          </SettingsCard>
        </div>
      )}
    </div>
  );
};

export default Settings;