import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import MainLayout from './layout/MainLayout';
import Login from "./pages/Login"; 
import AuditLog from "./pages/AuditLog";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Stocks from "./pages/Stocks";
import Suppliers from './pages/Suppliers';
import Warehouse from './pages/Warehouse';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Login />} />
          <Route path="Sidebar" element={<Sidebar />} />
          <Route path="AuditLog" element={<AuditLog />} />
          <Route path="Orders" element={<Orders />} />
          <Route path="Products" element={<Products />} />
          <Route path="Stocks" element={<Stocks/>} />
          <Route path="Suppliers" element={<Suppliers />} />
          <Route path="Warehouse" element={<Warehouse />} />
        </Route> {/* This closing tag was missing */}
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);