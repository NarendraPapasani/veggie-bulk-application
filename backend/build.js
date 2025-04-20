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
    // Generate Prisma client
    await executeCommand("npx prisma generate");

    // For Render deployment - explicitly download Debian OpenSSL binary if needed
    if (process.env.NODE_ENV === "production") {
      console.log(
        "Running in production environment, ensuring correct engine binaries..."
      );

      // Check if the target directory exists, if not create it
      const engineDir = path.join(__dirname, "generated", "prisma");
      if (!fs.existsSync(engineDir)) {
        fs.mkdirSync(engineDir, { recursive: true });
      }

      // Download the specific engine binary for debian-openssl-3.0.x
      await executeCommand(
        "npx prisma-engines download --binary-platform debian-openssl-3.0.x"
      );

      // Get the downloaded engine file path
      const engineDownloadDir = path.join(
        __dirname,
        "node_modules",
        ".prisma",
        "client"
      );
      const engineFiles = fs.readdirSync(engineDownloadDir);

      // Find the debian engine file
      const debianEngine = engineFiles.find((file) =>
        file.includes("debian-openssl-3.0.x")
      );

      if (debianEngine) {
        // Copy it to the generated directory
        const sourcePath = path.join(engineDownloadDir, debianEngine);
        const destPath = path.join(engineDir, debianEngine);

        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${debianEngine} to ${engineDir}`);
      } else {
        console.error("Could not find debian engine file");
      }
    }

    console.log("Build completed successfully");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
