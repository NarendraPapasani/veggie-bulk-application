import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import React from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const OrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://veggie-bulk-application.onrender.com/api/products"
        );
        setProducts(response.data);

        const params = new URLSearchParams(location.search);
        const productId = params.get("product");
        if (productId) {
          setSelectedProducts([{ id: parseInt(productId), quantity: 1 }]);
        }

        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location]);

  const addProduct = () => {
    setSelectedProducts([...selectedProducts, { id: "", quantity: 1 }]);
  };

  const removeProduct = (index) => {
    const newProducts = [...selectedProducts];
    newProducts.splice(index, 1);
    setSelectedProducts(newProducts);
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...selectedProducts];
    newProducts[index][field] = field === "id" ? parseInt(value) : value;
    setSelectedProducts(newProducts);
  };

  const onSubmit = async (data) => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    const orderData = {
      ...data,
      items: selectedProducts.map((item) => ({
        productId: item.id,
        quantity: parseInt(item.quantity),
      })),
    };

    try {
      const response = await axios.post(
        "https://veggie-bulk-application.onrender.com/api/orders/add",
        orderData
      );
      toast.success("Order placed successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Failed to place order");
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Place Order</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            {...register("buyerName", { required: "Name is required" })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.buyerName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.buyerName.message}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <label className="block text-gray-700 mb-2">Contact Number</label>
          <input
            type="tel"
            {...register("contactNumber", {
              required: "Contact number is required",
            })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.contactNumber.message}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label className="block text-gray-700 mb-2">Delivery Address</label>
          <textarea
            {...register("deliveryAddress", {
              required: "Delivery address is required",
            })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          {errors.deliveryAddress && (
            <p className="text-red-500 text-sm mt-1">
              {errors.deliveryAddress.message}
            </p>
          )}
        </motion.div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-green-600">
              Selected Products
            </h2>
            <button
              type="button"
              onClick={addProduct}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlus /> Add Product
            </button>
          </div>

          {selectedProducts.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex gap-4 items-center mb-4"
            >
              <select
                value={item.id}
                onChange={(e) =>
                  handleProductChange(index, "id", e.target.value)
                }
                className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}/kg
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleProductChange(index, "quantity", e.target.value)
                }
                min="1"
                className="w-24 p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                required
              />

              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="text-red-500 hover:text-red-700 flex items-center gap-2"
              >
                <FaTrashAlt /> Remove
              </button>
            </motion.div>
          ))}
        </div>

        <motion.button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Place Order
        </motion.button>
      </form>
    </div>
  );
};

export default OrderForm;
