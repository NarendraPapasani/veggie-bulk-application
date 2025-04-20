const { PrismaClient } = require("@prisma/client");

// Log the database URL (with password hidden)
const dbUrl = process.env.DATABASE_URL || "";
console.log("Database URL:", dbUrl.replace(/:([^:@]+)@/, ":****@"));

// Initialize Prisma Client with better error handling
const prisma = new PrismaClient({
  log: ["error", "warn", "info"],
  errorFormat: "pretty",
});

// Add connection testing on startup
async function testConnection() {
  try {
    console.log("Testing database connection from prisma.js...");
    await prisma.$connect();
    console.log("Database connection successful!");

    // Test querying products table to make sure it exists
    try {
      const productCount = await prisma.product.count();
      console.log(`The products table exists with ${productCount} records`);
    } catch (tableErr) {
      console.error("Error accessing products table:", tableErr);

      // If we're in development, we can try to create tables
      if (process.env.NODE_ENV !== "production") {
        console.log("Running db push to create missing tables...");
        const { execSync } = require("child_process");
        try {
          execSync("npx prisma db push", { stdio: "inherit" });
          console.log("Database schema pushed successfully");
        } catch (pushErr) {
          console.error("Failed to push database schema:", pushErr);
        }
      }
    }
  } catch (err) {
    console.error("Database connection failed:", err);
    // Don't crash the app, but log the error
  }
}

// Run the test when this file is imported
testConnection();

module.exports = prisma;
