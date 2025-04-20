const { execSync } = require("child_process");

try {
  console.log("Running Prisma generate...");
  execSync("npx prisma generate");
  console.log("Prisma client generated successfully");
} catch (error) {
  console.error("Failed to generate Prisma client:", error);
  process.exit(1);
}
