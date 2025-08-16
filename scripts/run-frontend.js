const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const frontendPath = path.join(__dirname, "../frontend/shorat-connect");
const nodeModulesPath = path.join(frontendPath, "node_modules");

process.chdir(frontendPath);


if (!fs.existsSync(nodeModulesPath)) {
  console.log("📦 Installing frontend dependencies...");
  execSync("npm install", { stdio: "inherit", shell: true });
}




execSync("npm run dev", { stdio: "inherit", shell: true });
