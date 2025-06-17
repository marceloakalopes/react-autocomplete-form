#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

// Helper functions
const copyDirectory = (src: string, dest: string) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const getProjectRoot = () => {
  let currentDir = process.cwd();
  while (currentDir !== path.parse(currentDir).root) {
    if (
      fs.existsSync(path.join(currentDir, "package.json"))
    ) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  throw new Error("Could not find project root (no package.json found)");
};

const checkDependencies = async (projectRoot: string) => {
  const pkgPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(pkgPath)) {
    throw new Error("No package.json found. Please run this command in a React project.");
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  if (!deps.react) {
    throw new Error("React is required but not found in dependencies.");
  }

  return true;
};

const installDependencies = async (projectRoot: string) => {
  const dependencies = [
    "clsx@latest",
    "tailwind-merge@latest",
    "lucide-react@latest"
  ];

  console.log(chalk.blue("\n🔄 Installing required dependencies..."));
  
  try {
    const { stdout, stderr } = await execAsync(`npm install ${dependencies.join(" ")}`, {
      cwd: projectRoot
    });
    
    if (stderr && !stderr.includes("npm notice")) {
      console.error(chalk.yellow("\n⚠️ Warnings during installation:"));
      console.error(stderr);
    }
    
    console.log(chalk.green("✅ Dependencies installed successfully!"));
  } catch (error: any) {
    console.error(chalk.red("\n✖ Error installing dependencies:"), error.message);
    throw error;
  }
};

// Commands
program
  .name("react-autocomplete-form")
  .description("Add pre-configured React components to your project")
  .version("0.0.1");

program
  .command("init")
  .description("Initialize and add all components to your project")
  .action(async () => {
    try {
      const projectRoot = getProjectRoot();
      await checkDependencies(projectRoot);
      
      console.log(chalk.blue("\n 📦 Initializing react-autocomplete-form..."));
      
      // Install dependencies first
      await installDependencies(projectRoot);
      
      // Define source and target paths
      const templatesDir = path.join(__dirname, "..", "templates");
      const targetComponentsDir = path.join(projectRoot, "components");
      const targetLibDir = path.join(projectRoot, "lib");
      const targetContextDir = path.join(projectRoot, "context");
      
      // Copy all directories
      console.log(chalk.blue("\n 📂 Copying components..."));
      copyDirectory(path.join(templatesDir, "components"), targetComponentsDir);
      
      console.log(chalk.blue(" 📂 Copying utilities..."));
      copyDirectory(path.join(templatesDir, "lib"), targetLibDir);
      
      console.log(chalk.blue(" 📂 Copying context..."));
      copyDirectory(path.join(templatesDir, "context"), targetContextDir);

      console.log(chalk.green("\n✅ Installation complete!"));
      console.log(chalk.blue("\nAvailable components:"));
      console.log("- AutocompleteForm");
      console.log("- LocationInput");
      console.log("- CityInput");
      console.log("- ProvinceStateInput");
      console.log("- PostalcodeInput");

    } catch (error: any) {
      console.error(chalk.red("\n✖ Error:"), error.message);
      process.exit(1);
    }
  });

program.parse();
