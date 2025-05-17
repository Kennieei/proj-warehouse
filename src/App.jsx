import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from './layout/MainLayout';
import Login from "./pages/Login"; 
import AuditLog from "./pages/AuditLog";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Stocks from "./pages/Stocks";
import Suppliers from './pages/Suppliers';
import Warehouse from './pages/Warehouse';
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Routes>
      {/* Route for Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes inside MainLayout */}
      <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
      <Route path="/warehouses" element={<MainLayout><Warehouse /></MainLayout>} />
      <Route path="/stocks" element={<MainLayout><Stocks /></MainLayout>} />
      <Route path="/suppliers" element={<MainLayout><Suppliers /></MainLayout>} />
      <Route path="/orders" element={<MainLayout><Orders /></MainLayout>} />
      <Route path="/auditLog" element={<MainLayout><AuditLog /></MainLayout>} />
    </Routes>
  );
};

export default App;
