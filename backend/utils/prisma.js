const { PrismaClient } = require("@prisma/client");
const { exec } = require("child_process");

// Log the database URL (with password hidden)
const dbUrl = process.env.DATABASE_URL || "";
console.log("Database URL:", dbUrl.replace(/:([^:@]+)@/, ":****@"));

// Initialize Prisma Client with better error handling
const prisma = new PrismaClient({
  log: ["error", "warn", "info"],
  errorFormat: "pretty",
});

// Run a command asynchronously and return a promise
const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
};

// Add connection testing and schema creation on startup
async function testConnection() {
  try {
    console.log("Testing database connection from prisma.js...");
    await prisma.$connect();
    console.log("Database connection successful!");

    // Test querying products table to make sure it exists
    try {
      // Using Product with capital P as defined in the schema
      const productCount = await prisma.Product.count();
      console.log(`The products table exists with ${productCount} records`);
    } catch (tableErr) {
      console.error("Error accessing products table:", tableErr);
      console.log("Tables might not exist, attempting to create schema...");

      try {
        // Force schema creation since we're on a free plan without shell access
        console.log("Running db push to create missing tables...");
        await execPromise("npx prisma db push --accept-data-loss");
        console.log("Database schema pushed successfully");

        // Try to seed the database
        try {
          console.log("Seeding the database with initial data...");
          await execPromise("npx prisma db seed");
          console.log("Database seeded successfully");
        } catch (seedErr) {
          console.error("Error seeding database:", seedErr);
        }

        // Verify tables were created
        try {
          const productCount = await prisma.Product.count();
          console.log(
            `✅ Products table now exists with ${productCount} records`
          );

          const userCount = await prisma.User.count();
          console.log(`✅ Users table now exists with ${userCount} records`);

          const orderCount = await prisma.Order.count();
          console.log(`✅ Orders table now exists with ${orderCount} records`);
        } catch (verifyErr) {
          console.error("Error verifying tables:", verifyErr);
        }
      } catch (pushErr) {
        console.error("Failed to push database schema:", pushErr);
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
