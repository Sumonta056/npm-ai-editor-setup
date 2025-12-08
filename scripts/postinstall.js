const fs = require('fs');
const path = require('path');

// Get the root directory where the package is installed
// INIT_CWD is set by npm/yarn/pnpm to the directory where install was run
// This is the most reliable way to get the project root during postinstall
let projectRoot = process.env.INIT_CWD;

// Fallback: if INIT_CWD is not set, walk up from current directory to find project root
if (!projectRoot) {
  let currentDir = process.cwd();
  
  // Walk up to find directory with package.json (but not in node_modules)
  for (let i = 0; i < 10; i++) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    
    // If we find package.json and we're not in node_modules, this is likely the project root
    if (fs.existsSync(packageJsonPath) && !currentDir.includes('node_modules')) {
      projectRoot = currentDir;
      break;
    }
    
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break; // Reached filesystem root
    currentDir = parentDir;
  }
  
  // Final fallback to current working directory
  if (!projectRoot) {
    projectRoot = process.cwd();
  }
}

// Normalize the path to absolute path
projectRoot = path.resolve(projectRoot);

// Get the template directory path
// When installed, the package is in node_modules/ai-editor-setup
// Templates are in node_modules/ai-editor-setup/templates
const packageDir = __dirname.replace(/[\\/]scripts$/, '');
const templatesDir = path.join(packageDir, 'templates');

// Function to copy a file
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
}

// Function to copy a directory recursively
function copyDirectory(src, dest, createdFiles = []) {
  if (!fs.existsSync(src)) {
    return { success: false, createdFiles };
  }
  
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    // Create destination directory if it doesn't exist
    const dirCreated = !fs.existsSync(dest);
    if (dirCreated) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    // Read all files and directories
    const entries = fs.readdirSync(src);
    
    entries.forEach(entry => {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      
      const entryStats = fs.statSync(srcPath);
      
      if (entryStats.isDirectory()) {
        const result = copyDirectory(srcPath, destPath, createdFiles);
        // Merge created files from subdirectory
        result.createdFiles.forEach(file => {
          if (!createdFiles.includes(file)) {
            createdFiles.push(file);
          }
        });
      } else {
        const fileCreated = copyFile(srcPath, destPath);
        if (fileCreated) {
          // Get relative path from project root for display
          const relativePath = path.relative(projectRoot, destPath);
          createdFiles.push(relativePath);
        }
      }
    });
    
    return { success: true, createdFiles };
  } else {
    const fileCreated = copyFile(src, dest);
    if (fileCreated) {
      const relativePath = path.relative(projectRoot, dest);
      createdFiles.push(relativePath);
    }
    return { success: fileCreated, createdFiles };
  }
}

console.log(`\n📦 ai-editor-setup: Setting up Cursor configuration in ${projectRoot}\n`);

// Copy everything from templates folder
if (!fs.existsSync(templatesDir)) {
  console.log(`⚠ Warning: Templates folder not found at ${templatesDir}`);
  console.log(`\n✅ Setup completed (no templates to copy)\n`);
  process.exit(0);
}

const createdFiles = [];
const entries = fs.readdirSync(templatesDir);

if (entries.length === 0) {
  console.log(`✓ Templates folder is empty (nothing to copy)`);
  console.log(`\n✅ Setup completed successfully!\n`);
  process.exit(0);
}

entries.forEach(entry => {
  const srcPath = path.join(templatesDir, entry);
  const destPath = path.join(projectRoot, entry);
  
  const stats = fs.statSync(srcPath);
  
  if (stats.isDirectory()) {
    const result = copyDirectory(srcPath, destPath, createdFiles);
    // Merge created files from subdirectory
    result.createdFiles.forEach(file => {
      if (!createdFiles.includes(file)) {
        createdFiles.push(file);
      }
    });
  } else {
    const fileCreated = copyFile(srcPath, destPath);
    if (fileCreated) {
      const relativePath = path.relative(projectRoot, destPath);
      createdFiles.push(relativePath);
    }
  }
});

if (createdFiles.length > 0) {
  console.log(`✓ Created ${createdFiles.length} file(s)/folder(s):`);
  createdFiles.forEach(file => {
    console.log(`  - ${file}`);
  });
} else {
  console.log(`✓ All template files already exist (preserving existing files)`);
}

console.log(`\n✅ Setup completed successfully!\n`);


