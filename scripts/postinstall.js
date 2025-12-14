const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Get the root directory where the package is installed
let projectRoot = process.env.INIT_CWD;

if (!projectRoot) {
  let currentDir = process.cwd();
  for (let i = 0; i < 10; i++) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath) && !currentDir.includes('node_modules')) {
      projectRoot = currentDir;
      break;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }
  if (!projectRoot) {
    projectRoot = process.cwd();
  }
}

projectRoot = path.resolve(projectRoot);
const packageDir = __dirname.replace(/[\\/]scripts$/, '');
const templatesDir = path.join(packageDir, 'templates');

// Editor to folder mapping
const editorMap = {
  cursor: ['.cursor', '.cursorignore'],
  claude: ['.ai'],
  vscode: ['.vscode','.github'],
  intellij: ['.idea'],
  windsurf: ['.windsurf']
};

// Common files that should always be included
const commonFiles = [, '.gitignore'];

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
    const dirCreated = !fs.existsSync(dest);
    if (dirCreated) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src);
    
    entries.forEach(entry => {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      const entryStats = fs.statSync(srcPath);
      
      if (entryStats.isDirectory()) {
        const result = copyDirectory(srcPath, destPath, createdFiles);
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

// Function to prompt user for editor selection
function promptEditorSelection() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\n📦 ai-editor-setup: Select which editor configuration(s) you want to install:\n');
    console.log('1. Cursor');
    console.log('2. Claude');
    console.log('3. VS Code');
    console.log('4. IntelliJ IDEA');
    console.log('5. Windsurf');
    console.log('6. All editors');
    console.log('\nEnter numbers separated by commas (e.g., 1,3,5) or press Enter for all:');

    rl.question('> ', (answer) => {
      rl.close();
      
      const selected = [];
      if (!answer.trim()) {
        // Default to all
        selected.push('cursor', 'claude', 'vscode', 'intellij', 'windsurf');
      } else {
        const choices = answer.split(',').map(c => c.trim());
        if (choices.includes('6')) {
          selected.push('cursor', 'claude', 'vscode', 'intellij', 'windsurf');
        } else {
          choices.forEach(choice => {
            if (choice === '1') selected.push('cursor');
            else if (choice === '2') selected.push('claude');
            else if (choice === '3') selected.push('vscode');
            else if (choice === '4') selected.push('intellij');
            else if (choice === '5') selected.push('windsurf');
          });
        }
      }
      
      resolve(selected);
    });
  });
}

// Main installation function
async function install() {
  if (!fs.existsSync(templatesDir)) {
    console.log(`⚠ Warning: Templates folder not found at ${templatesDir}`);
    console.log(`\n✅ Setup completed (no templates to copy)\n`);
    process.exit(0);
  }

  // Prompt for editor selection
  const selectedEditors = await promptEditorSelection();

  if (selectedEditors.length === 0) {
    console.log('\n⚠ No editors selected. Setup cancelled.\n');
    process.exit(0);
  }

  console.log(`\n📦 Installing configuration for: ${selectedEditors.join(', ')}\n`);

  // Collect all folders to copy
  const foldersToCopy = new Set();
  
  // Add selected editor folders
  selectedEditors.forEach(editor => {
    if (editorMap[editor]) {
      editorMap[editor].forEach(folder => {
        foldersToCopy.add(folder);
      });
    }
  });

  // Always add common files
  commonFiles.forEach(file => {
    foldersToCopy.add(file);
  });

  const createdFiles = [];

  // Copy selected folders
  foldersToCopy.forEach(folder => {
    const srcPath = path.join(templatesDir, folder);
    const destPath = path.join(projectRoot, folder);
    
    if (fs.existsSync(srcPath)) {
      const stats = fs.statSync(srcPath);
      if (stats.isDirectory()) {
        const result = copyDirectory(srcPath, destPath, createdFiles);
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
}

install().catch(err => {
  console.error('Error during installation:', err);
  process.exit(1);
});


