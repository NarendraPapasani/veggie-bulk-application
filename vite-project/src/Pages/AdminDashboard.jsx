import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import React from "react";
import { FaEdit, FaTrash, FaPlus, FaBox, FaShoppingCart } from "react-icons/fa";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get("http://localhost:3000/api/orders"),
        axios.get("http://localhost:3000/api/products"),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      toast.error("Failed to fetch data");
    }
    setLoading(false);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success("Order status updated");
      fetchData();
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/products/add", newProduct);
      toast.success("Product added successfully");
      setNewProduct({ name: "", price: "", stock: "" });
      fetchData();
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/products/update/${editingProduct.id}`,
        editingProduct
      );
      toast.success("Product updated successfully");
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `http://localhost:3000/api/products/delete/${productId}`
        );
        toast.success("Product deleted successfully");
        fetchData();
      } catch (err) {
        toast.error("Failed to delete product");
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  let content;
  switch (activeTab) {
    case "orders":
      content = (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div>{order.buyerName}</div>
                      <div className="text-sm text-gray-500">
                        {order.contactNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.product.name} x {item.quantity}kg
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">No items</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order.id, e.target.value)
                        }
                        className="text-sm border rounded-md p-1"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
      break;

    case "edit":
      content = (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <form
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={editingProduct ? editingProduct.name : newProduct.name}
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    : setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price per kg
              </label>
              <input
                type="number"
                step="0.01"
                value={editingProduct ? editingProduct.price : newProduct.price}
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    : setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock (kg)
              </label>
              <input
                type="number"
                value={editingProduct ? editingProduct.stock : newProduct.stock}
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({
                        ...editingProduct,
                        stock: e.target.value,
                      })
                    : setNewProduct({ ...newProduct, stock: e.target.value })
                }
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      );
      break;

    case "products":
      content = (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">${product.price}/kg</td>
                  <td className="px-6 py-4">{product.stock}kg</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setActiveTab("edit");
                      }}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer flex items-center"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      break;
    default:
      content = <div>Unknown tab selected</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-6 flex items-center">
        <FaBox className="mr-2" /> Admin Dashboard
      </h1>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md cursor-pointer flex items-center ${
            activeTab === "orders"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          <FaShoppingCart className="mr-2" /> Orders
        </button>
        <button
          className={`px-4 py-2 rounded-md cursor-pointer flex items-center ${
            activeTab === "products"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("products")}
        >
          <FaBox className="mr-2" /> Products
        </button>
        <button
          className={`px-4 py-2 rounded-md cursor-pointer flex items-center ${
            activeTab === "edit"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("edit")}
        >
          <FaPlus className="mr-2" /> Edit/Add Product
        </button>
      </div>

      <div className="space-y-6">{content}</div>
    </div>
  );
};

export default AdminDashboard;
