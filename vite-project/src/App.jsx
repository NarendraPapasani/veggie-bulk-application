import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import OrderForm from "./Pages/OrderForm";
import OrderStatus from "./Pages/OrderStatus";
import AdminDashboard from "./Pages/AdminDashBoard";
import AuthPage from "./Pages/AuthPage";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />

            {/* Protected routes */}
            <Route
              path="/order"
              element={
                <ProtectedRoute>
                  <OrderForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-status"
              element={
                <ProtectedRoute>
                  <OrderStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
