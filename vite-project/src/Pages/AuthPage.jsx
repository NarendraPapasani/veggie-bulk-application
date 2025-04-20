import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaSignInAlt,
  FaUserPlus,
  FaUserShield,
} from "react-icons/fa";

axios.defaults.withCredentials = true;

// Admin credentials (hardcoded)
const ADMIN_CREDENTIALS = {
  email: "admin@gmail.com",
  password: "admin123",
};

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/products";

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm();

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    watch: watchSignup,
  } = useForm();

  const password = watchSignup?.("password", "");

  const onLogin = async (data) => {
    try {
      // Check if credentials match admin credentials
      if (
        data.email === ADMIN_CREDENTIALS.email &&
        data.password === ADMIN_CREDENTIALS.password
      ) {
        // Handle admin login (without server validation since it's hardcoded)
        const adminUser = {
          id: "admin",
          name: "Administrator",
          email: ADMIN_CREDENTIALS.email,
          isAdmin: true,
        };

        localStorage.setItem("user", JSON.stringify(adminUser));
        setUser(adminUser);

        toast.success("Admin login successful!");
        navigate("/admin");
        return;
      }

      // Regular user login via API
      const response = await axios.post(
        "https://veggie-bulk-application.onrender.com/api/auth/login",
        data,
        { withCredentials: true }
      );

      // Add isAdmin flag (false for regular users)
      const userData = {
        ...response.data.user,
        isAdmin: false,
      };

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      toast.success("Login successful!");
      navigate(from);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const onSignup = async (data) => {
    try {
      // Don't allow signup with admin email
      if (data.email === ADMIN_CREDENTIALS.email) {
        toast.error("This email is restricted. Please use another email.");
        return;
      }

      const response = await axios.post(
        "https://veggie-bulk-application.onrender.com/api/auth/signup",
        data
      );
      toast.success("Signup successful! Please log in.");
      setActiveTab("login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  // If user is already logged in, show appropriate message
  if (user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          {user.isAdmin ? "Admin Dashboard" : "Welcome"}, {user.name}!
        </h2>
        <p className="mb-6">You are already logged in.</p>

        <div className="flex flex-col space-y-4">
          {user.isAdmin ? (
            <Link
              to="/admin"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            >
              <FaUserShield className="mr-2" /> Go to Admin Dashboard
            </Link>
          ) : (
            <Link
              to="/products"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center"
            >
              <FaShoppingBasket className="mr-2" /> Browse Products
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
          >
            <FaSignOutAlt className="mr-2 inline" /> Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex mb-6">
        <button
          className={`flex-1 py-2 font-medium ${
            activeTab === "login"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("login")}
        >
          <span className="flex items-center justify-center">
            <FaSignInAlt className="mr-2" /> Login
          </span>
        </button>
        <button
          className={`flex-1 py-2 font-medium ${
            activeTab === "signup"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("signup")}
        >
          <span className="flex items-center justify-center">
            <FaUserPlus className="mr-2" /> Sign Up
          </span>
        </button>
      </div>

      {activeTab === "login" ? (
        <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FaEnvelope />
              </div>
              <input
                type="email"
                {...registerLogin("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="your@email.com"
              />
            </div>
            {loginErrors.email && (
              <p className="text-red-500 text-xs mt-1">
                {loginErrors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FaLock />
              </div>
              <input
                type="password"
                {...registerLogin("password", {
                  required: "Password is required",
                })}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>
            {loginErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {loginErrors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
          >
            Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FaUser />
              </div>
              <input
                type="text"
                {...registerSignup("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="johndoe"
              />
            </div>
            {signupErrors.username && (
              <p className="text-red-500 text-xs mt-1">
                {signupErrors.username.message}
              </p>
            )}
          </div>

          {/* Email field */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FaEnvelope />
              </div>
              <input
                type="email"
                {...registerSignup("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="your@email.com"
              />
            </div>
            {signupErrors.email && (
              <p className="text-red-500 text-xs mt-1">
                {signupErrors.email.message}
              </p>
            )}
          </div>

          {/* Mobile number field */}
          <div>
            <label className="block text-gray-700 mb-1">Mobile Number</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FaPhone />
              </div>
              <input
                type="tel"
                {...registerSignup("mobileNumber", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit mobile number",
                  },
                })}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="1234567890"
              />
            </div>
            {signupErrors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1">
                {signupErrors.mobileNumber.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FaLock />
              </div>
              <input
                type="password"
                {...registerSignup("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>
            {signupErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {signupErrors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password field */}
          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FaLock />
              </div>
              <input
                type="password"
                {...registerSignup("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>
            {signupErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {signupErrors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
          >
            Sign Up
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthPage;
