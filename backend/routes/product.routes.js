const router = require("express").Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController.js");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/add", createProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
