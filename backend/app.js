const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const productRoutes = require("./routes/product.routes.js");
const orderRoutes = require("./routes/order.routes.js");
const authRoutes = require("./routes/auth.routes.js");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL (exact match required)
    credentials: true, // Allow credentials (cookies, auth headers)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
