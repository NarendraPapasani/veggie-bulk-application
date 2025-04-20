import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaShoppingBasket,
  FaTruck,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://veggie-bulk-application.onrender.com/api/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Clear local state
      localStorage.removeItem("user");
      setUser(null);

      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center text-xl font-bold">
            <FaLeaf className="text-2xl mr-2" />
            VeggieBulk
          </Link>
          <div className="flex space-x-6">
            <Link
              to="/products"
              className="flex items-center hover:bg-green-700 px-3 py-2 rounded transition-colors"
            >
              <FaShoppingBasket className="mr-2" />
              Products
            </Link>

            {/* Conditional navigation links based on auth status */}
            {user ? (
              <>
                <Link
                  to="/order"
                  className="flex items-center hover:bg-green-700 px-3 py-2 rounded transition-colors"
                >
                  <FaShoppingBasket className="mr-2" />
                  Place Order
                </Link>
                <Link
                  to="/order-status"
                  className="flex items-center hover:bg-green-700 px-3 py-2 rounded transition-colors"
                >
                  <FaTruck className="mr-2" />
                  Track Order
                </Link>

                {/* Only show Admin link if user has admin role */}
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center hover:bg-green-700 px-3 py-2 rounded transition-colors"
                  >
                    <FaUserShield className="mr-2" />
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center hover:bg-green-700 px-3 py-2 rounded transition-colors"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/auth"
                  className="flex items-center hover:bg-green-700 px-3 py-2 rounded transition-colors"
                >
                  <FaSignInAlt className="mr-2" />
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
