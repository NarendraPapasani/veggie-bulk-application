const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Function to execute shell commands
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

async function build() {
  try {
    console.log("Setting environment variables for Prisma...");
    // Force Prisma to use the specified binary target
    process.env.PRISMA_SCHEMA_ENGINE_BINARY =
      "schema-engine-debian-openssl-3.0.x";
    process.env.PRISMA_QUERY_ENGINE_BINARY =
      "query-engine-debian-openssl-3.0.x";
    process.env.PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING = "1";

    // Generate Prisma client with specific binary targets
    console.log("Generating Prisma client with specific binary targets...");
    await executeCommand("npx prisma generate --schema=./prisma/schema.prisma");

    console.log("Build completed successfully");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
