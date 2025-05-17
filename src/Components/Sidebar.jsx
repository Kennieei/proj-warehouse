import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./Sidebar.css"; // Make sure this CSS file is created

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sidebar-layout">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="brand">Multi-Warehouse</div>

        <div className="nav-links">
          <Link to="/" className="nav-item">Dashboard</Link>
          <Link to="/products" className="nav-item">Inventory</Link>
          <Link to="/warehouses" className="nav-item">Warehouses</Link>
          <Link to="/stocks" className="nav-item">Stocks</Link>
          <Link to="/orders" className="nav-item">Orders</Link>
          <Link to="/suppliers" className="nav-item">Suppliers</Link>
          <Link to="/auditlog" className="nav-item">Audit Log</Link>
          <button
            className="nav-item logout-button"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Toggle Button (Mobile) */}
      <button onClick={toggleSidebar} className="toggle-btn">
        ☰
      </button>

      {/* Main content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
