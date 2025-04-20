import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import React from "react";

const OrderStatus = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("orderId");
    if (id) {
      setOrderId(id);
      fetchOrder(id);
    }
  }, [location]);

  const fetchOrder = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://veggie-bulk-application.onrender.com/api/orders/${id}`
      );
      setOrder(response.data);
    } catch (err) {
      toast.error("Failed to fetch order details");
      setOrder(null);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderId) {
      fetchOrder(orderId);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  console.log(order);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Track Order</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID"
            className="flex-1 p-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Track
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : order ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order #{order.id}</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">Buyer Details</h3>
              <p className="text-gray-600">{order.buyerName}</p>
              <p className="text-gray-600">{order.contactNumber}</p>
              <p className="text-gray-600">{order.deliveryAddress}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Order Items</h3>
              <div className="space-y-2">
                {order.orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span className="text-gray-600">
                      {item.product.name} x {item.quantity}kg
                    </span>
                    <span className="text-gray-600">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-medium">Total Amount</span>
              <span className="font-medium text-green-600">
                $
                {order.orderItems
                  .reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OrderStatus;
