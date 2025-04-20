const router = require("express").Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
} = require("../controllers/orderController.js");

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/add", createOrder);
router.put("/:id/status", updateOrder);

module.exports = router;
