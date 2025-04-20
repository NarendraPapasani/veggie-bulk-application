const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const productRoutes = require("./routes/product.routes.js");
const orderRoutes = require("./routes/order.routes.js");
const authRoutes = require("./routes/auth.routes.js");

const app = express();

// Define allowed origins based on environment
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://grand-cendol-1d0537.netlify.app", // Without trailing slash
        "https://grand-cendol-1d0537.netlify.app/", // With trailing slash (just to be safe)
      ]
    : ["http://localhost:5173"];

// Simplified and more permissive CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Add a route for health checks
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
