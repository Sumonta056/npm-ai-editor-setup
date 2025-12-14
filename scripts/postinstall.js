const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ============================================================================
// CONFIGURATION - Add new editors here easily
// ============================================================================

/**
 * Editor Configuration
 * 
 * To add a new editor:
 * 1. Create the template folder/files in templates/ directory
 * 2. Add a new entry to this array with:
 *    - id: unique identifier (lowercase, no spaces)
 *    - name: display name shown to users
 *    - folders: array of folder/file names from templates/ to copy
 * 
 * Example:
 * {
 *   id: 'neovim',
 *   name: 'Neovim',
 *   folders: ['.nvim', '.nvimrc']
 * }
 * 
 * That's it! The rest is handled automatically.
 * 
 * @property {string} id - Unique identifier (lowercase, no spaces)
 * @property {string} name - Display name shown to users
 * @property {string[]} folders - Array of folder/file names in templates/ to copy
 */
const EDITOR_CONFIG = [
  {
    id: 'cursor',
    name: 'Cursor',
    folders: ['.cursor', '.cursorignore']
  },
  {
    id: 'claude',
    name: 'Claude',
    folders: ['.ai']
  },
  {
    id: 'vscode',
    name: 'VS Code',
    folders: ['.vscode', '.github']
  },
  {
    id: 'intellij',
    name: 'IntelliJ IDEA',
    folders: ['.idea']
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    folders: ['.windsurf']
  }
];

/**
 * Common files that should always be included regardless of editor selection
 */
const COMMON_FILES = ['.gitignore'];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the project root directory where the package is installed
 */
function getProjectRoot() {
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

  return path.resolve(projectRoot);
}

/**
 * Get editor configuration by ID
 */
function getEditorById(id) {
  return EDITOR_CONFIG.find(editor => editor.id === id);
}

/**
 * Get all editor IDs
 */
function getAllEditorIds() {
  return EDITOR_CONFIG.map(editor => editor.id);
}

/**
 * Get editor display names for prompt
 */
function getEditorDisplayList() {
  return EDITOR_CONFIG.map((editor, index) => `${index + 1}. ${editor.name}`);
}

// Initialize paths
const projectRoot = getProjectRoot();
const packageDir = __dirname.replace(/[\\/]scripts$/, '');
const templatesDir = path.join(packageDir, 'templates');

// ============================================================================
// FILE OPERATIONS
// ============================================================================

/**
 * Copy a single file from source to destination
 * @param {string} src - Source file path
 * @param {string} dest - Destination file path
 * @returns {boolean} - True if file was created, false if it already existed
 */
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

/**
 * Copy a directory recursively from source to destination
 * @param {string} src - Source directory path
 * @param {string} dest - Destination directory path
 * @param {string[]} createdFiles - Array to track created files
 * @returns {{success: boolean, createdFiles: string[]}}
 */
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

// ============================================================================
// USER INTERACTION
// ============================================================================

/**
 * Prompt user to select which editors to install
 * @returns {Promise<string[]>} - Array of selected editor IDs
 */
function promptEditorSelection() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const allOptionNumber = EDITOR_CONFIG.length + 1;
    const editorList = getEditorDisplayList();

    console.log('\n📦 ai-editor-setup: Select which editor configuration(s) you want to install:\n');
    editorList.forEach(item => console.log(item));
    console.log(`${allOptionNumber}. All editors`);
    console.log('\nEnter numbers separated by commas (e.g., 1,3,5) or press Enter for all:');

    rl.question('> ', (answer) => {
      rl.close();
      
      const selected = [];
      const answerTrimmed = answer.trim();
      
      if (!answerTrimmed) {
        // Default to all editors
        selected.push(...getAllEditorIds());
      } else {
        const choices = answerTrimmed.split(',').map(c => c.trim());
        const allOption = String(allOptionNumber);
        
        if (choices.includes(allOption)) {
          // User selected "All editors"
          selected.push(...getAllEditorIds());
        } else {
          // Parse individual selections
          choices.forEach(choice => {
            const index = parseInt(choice, 10) - 1;
            if (index >= 0 && index < EDITOR_CONFIG.length) {
              const editor = EDITOR_CONFIG[index];
              if (editor && !selected.includes(editor.id)) {
                selected.push(editor.id);
              }
            }
          });
        }
      }
      
      resolve(selected);
    });
  });
}

// ============================================================================
// INSTALLATION LOGIC
// ============================================================================

/**
 * Get all folders that need to be copied based on selected editors
 * @param {string[]} selectedEditorIds - Array of selected editor IDs
 * @returns {Set<string>} - Set of folder/file names to copy
 */
function getFoldersToCopy(selectedEditorIds) {
  const foldersToCopy = new Set();
  
  // Add folders from selected editors
  selectedEditorIds.forEach(editorId => {
    const editor = getEditorById(editorId);
    if (editor) {
      editor.folders.forEach(folder => {
        foldersToCopy.add(folder);
      });
    }
  });

  // Always add common files
  COMMON_FILES.forEach(file => {
    if (file) { // Filter out empty strings
      foldersToCopy.add(file);
    }
  });

  return foldersToCopy;
}

/**
 * Copy template files to project root
 * @param {Set<string>} foldersToCopy - Set of folder/file names to copy
 * @returns {string[]} - Array of created file paths (relative to project root)
 */
function copyTemplateFiles(foldersToCopy) {
  const createdFiles = [];

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

  return createdFiles;
}

/**
 * Get display names for selected editors
 * @param {string[]} selectedEditorIds - Array of selected editor IDs
 * @returns {string[]} - Array of editor display names
 */
function getSelectedEditorNames(selectedEditorIds) {
  return selectedEditorIds
    .map(id => {
      const editor = getEditorById(id);
      return editor ? editor.name : id;
    })
    .filter(Boolean);
}

/**
 * Main installation function
 */
async function install() {
  // Validate templates directory exists
  if (!fs.existsSync(templatesDir)) {
    console.log(`⚠ Warning: Templates folder not found at ${templatesDir}`);
    console.log(`\n✅ Setup completed (no templates to copy)\n`);
    process.exit(0);
  }

  // Prompt for editor selection
  const selectedEditorIds = await promptEditorSelection();

  if (selectedEditorIds.length === 0) {
    console.log('\n⚠ No editors selected. Setup cancelled.\n');
    process.exit(0);
  }

  // Display selected editors
  const selectedNames = getSelectedEditorNames(selectedEditorIds);
  console.log(`\n📦 Installing configuration for: ${selectedNames.join(', ')}\n`);

  // Get folders to copy
  const foldersToCopy = getFoldersToCopy(selectedEditorIds);

  // Copy files
  const createdFiles = copyTemplateFiles(foldersToCopy);

  // Display results
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

// ============================================================================
// ENTRY POINT
// ============================================================================

install().catch(err => {
  console.error('Error during installation:', err);
  process.exit(1);
});


