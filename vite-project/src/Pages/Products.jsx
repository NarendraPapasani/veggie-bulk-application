import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://veggie-bulk-application.onrender.com/api/products"
        );
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleOrderClick = (e, productId) => {
    e.preventDefault();

    if (!user) {
      // User is not logged in
      toast.info("Please log in to place an order");
      // Redirect to login page with return URL info
      navigate("/auth", { state: { from: `/order?product=${productId}` } });
    } else {
      // User is logged in, redirect to order page
      navigate(`/order?product=${productId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          className="text-xl text-green-600"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Loading products...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600">
          Available Products
        </h1>
        {user && (
          <Link
            to="/order"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Place Order
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold text-green-600 mb-2 flex items-center">
                {product.name}
              </h2>
              <p className="text-gray-600 mb-2 flex items-center">
                Price: ${product.price}/kg
              </p>
              <p
                className={`text-gray-600 mb-4 flex items-center ${
                  product.stock < 100 ? "text-red-600" : "text-green-600"
                }`}
              >
                {product.stock < 100 ? (
                  <FaExclamationTriangle className="mr-2" />
                ) : (
                  <FaCheckCircle className="mr-2" />
                )}
                Stock:{" "}
                {product.stock > 0
                  ? `${product.stock} kg available`
                  : "Out of stock"}
              </p>
              <a
                href="#"
                onClick={(e) =>
                  product.stock > 0 && handleOrderClick(e, product.id)
                }
                className={`inline-block w-full text-center py-2 rounded-md ${
                  product.stock > 0
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {product.stock > 0 ? "Order Now" : "Out of Stock"}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Products;
