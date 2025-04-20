import React from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaTruck,
  FaLeaf,
  FaBox,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      className="max-w-4xl mx-auto text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className="text-4xl font-bold text-green-600 mb-6"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to VeggieBulk
      </motion.h1>
      <motion.p
        className="text-xl text-gray-600 mb-8"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your one-stop solution for bulk vegetable and fruit orders
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center justify-center">
            <FaShoppingCart className="mr-2" /> For Buyers
          </h2>
          <p className="text-gray-600 mb-4">
            Browse our fresh produce and place bulk orders with ease
          </p>
          <Link
            to="/products"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            View Products
          </Link>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center justify-center">
            <FaTruck className="mr-2" /> Track Orders
          </h2>
          <p className="text-gray-600 mb-4">
            Check the status of your orders in real-time
          </p>
          <Link
            to="/order-status"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Track Order
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="bg-green-50 p-6 rounded-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-green-600 mb-4">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div whileHover={{ scale: 1.1 }}>
            <h3 className="font-semibold text-green-600 flex items-center justify-center">
              <FaLeaf className="mr-2" /> Fresh Produce
            </h3>
            <p className="text-gray-600">Direct from farms to your doorstep</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <h3 className="font-semibold text-green-600 flex items-center justify-center">
              <FaBox className="mr-2" /> Bulk Orders
            </h3>
            <p className="text-gray-600">
              Great prices for wholesale quantities
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <h3 className="font-semibold text-green-600 flex items-center justify-center">
              <FaClock className="mr-2" /> Fast Delivery
            </h3>
            <p className="text-gray-600">Quick and reliable delivery service</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
