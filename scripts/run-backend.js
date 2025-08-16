const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const backendPath = path.join(__dirname, "../backend/FMSbackend");
const venvPath = path.join(__dirname, "../venv");

try {
  console.log("Setting up Python virtual environment...");

  
  if (!fs.existsSync(venvPath)) {
    console.log("Creating virtual environment...");
    execSync(`python -m venv ${venvPath}`, { stdio: "inherit" });
  }

  
  const pipPath = path.join(venvPath, "Scripts", "pip");
  const reqFile = path.join(backendPath, "requirements.txt");

  if (fs.existsSync(reqFile)) {
    console.log("Installing Python dependencies...");
    execSync(`"${pipPath}" install -r "${reqFile}"`, { stdio: "inherit" });
  } else {
    console.log("No requirements.txt found. Installing Django manually...");
    execSync(`"${pipPath}" install django djangorestframework`, { stdio: "inherit" });
  }

 
  const pythonPath = path.join(venvPath, "Scripts", "python");
  console.log("Starting Django backend server...");
  execSync(`cd "${backendPath}" && "${pythonPath}" manage.py runserver`, { stdio: "inherit" });

} catch (err) {
  console.error("Backend failed to start:", err);
  process.exit(1);
}
