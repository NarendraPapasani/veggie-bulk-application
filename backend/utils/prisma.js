const { PrismaClient } = require("@prisma/client");

// Log the database URL (with password hidden)
const dbUrl = process.env.DATABASE_URL || "";
console.log("Database URL:", dbUrl.replace(/:([^:@]+)@/, ":****@"));

// Initialize Prisma Client with logging in development
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

// Add an event listener for connection issues
prisma.$on("query", (e) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Query: ${e.query}`);
    console.log(`Duration: ${e.duration}ms`);
  }
});

module.exports = prisma;
