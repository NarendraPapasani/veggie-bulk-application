const { PrismaClient } = require("@prisma/client");

// Log database connection string (but hide password)
const dbUrl = process.env.DATABASE_URL || "";
console.log(
  "Connecting to database:",
  dbUrl.replace(/postgres:\/\/[^:]+:[^@]+@/, "postgres://<user>:<password>@")
);

// Initialize Prisma Client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Test the database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

// Run the test when this file is imported
testConnection();

module.exports = prisma;
