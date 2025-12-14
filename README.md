# AI Editor Setup

<div align="center">

**Automatically configure your favorite AI-powered code editors with a single command**

[![npm version](https://img.shields.io/npm/v/ai-editor-setup.svg)](https://www.npmjs.com/package/ai-editor-setup)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)

</div>

---

## 📖 Introduction

**AI Editor Setup** is an npm package that streamlines your development workflow by automatically configuring your preferred AI-powered code editor. Instead of manually setting up configuration files for Cursor, Claude, VS Code, IntelliJ IDEA, or Windsurf, this package does it all for you with a simple installation command.

Whether you're starting a new project or want to standardize your development environment across multiple projects, `ai-editor-setup` eliminates the tedious manual configuration process and ensures consistency across your team.

### Why Use AI Editor Setup?

- ⚡ **Zero Configuration**: Get up and running in seconds
- 🎯 **Editor-Specific**: Choose only the editors you use
- 🔒 **Safe**: Never overwrites existing files
- 🚀 **Automated**: Runs automatically after installation
- 📦 **Comprehensive**: Includes best practices and templates

---

## ✨ Features

- **Multi-Editor Support**: Configure Cursor, Claude, VS Code, IntelliJ IDEA, and Windsurf
- **Interactive Selection**: Choose which editor configurations to install during setup
- **Smart File Management**: Automatically creates necessary folders and configuration files
- **GitHub Integration**: Includes GitHub templates for issues and CI/CD workflows
- **Best Practices**: Pre-configured with industry-standard settings and rules
- **Non-Destructive**: Preserves existing files - never overwrites your custom configurations
- **Extensible**: Easy to customize templates for your specific needs

### What Gets Created?

Depending on your editor selection, the package creates:

- **Cursor**: `.cursor/` configuration, rules, and `.cursorignore`
- **Claude**: `.ai/` configuration and prompt templates
- **VS Code**: `.vscode/` settings and recommended extensions
- **IntelliJ IDEA**: `.idea/` project configuration
- **Windsurf**: `.windsurf/` configuration files
- **Common**: `.github/` templates and `.gitignore`

---

## 🚀 How to Use

### Quick Start

1. **Install the package** in your project:

```bash
npm install ai-editor-setup
```

2. **Select your editors** when prompted:

```
📦 ai-editor-setup: Select which editor configuration(s) you want to install:

1. Cursor
2. Claude
3. VS Code
4. IntelliJ IDEA
5. Windsurf
6. All editors

Enter numbers separated by commas (e.g., 1,3,5) or press Enter for all:
> 1,3
```

3. **Done!** Your configuration files are automatically created in your project root.

### Installation Options

**Install specific editors:**
```bash
# Select editors interactively
npm install ai-editor-setup
# Then choose: 1,3 (for Cursor and VS Code)
```

**Install all editors:**
```bash
npm install ai-editor-setup
# Press Enter when prompted to select all
```

**Update existing installation:**
```bash
npm update ai-editor-setup
```

---

## 📋 Setup Guide

### Prerequisites

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (or yarn/pnpm)
- **Existing Project**: A project with `package.json`

### Step-by-Step Installation

#### 1. Navigate to Your Project

```bash
cd your-project-directory
```

#### 2. Install the Package

```bash
npm install ai-editor-setup
```

#### 3. Interactive Editor Selection

When the installation runs, you'll see a prompt:

```
📦 ai-editor-setup: Select which editor configuration(s) you want to install:

1. Cursor
2. Claude
3. VS Code
4. IntelliJ IDEA
5. Windsurf
6. All editors

Enter numbers separated by commas (e.g., 1,3,5) or press Enter for all:
```

**Examples:**
- Type `1` and press Enter → Install only Cursor
- Type `1,3,5` and press Enter → Install Cursor, VS Code, and Windsurf
- Press Enter without typing → Install all editors

#### 4. Verify Installation

After installation, you should see:

```
✓ Created X file(s)/folder(s):
  - .cursor/cursor.json
  - .cursor/rules/core.mdc
  - .vscode/settings.json
  ...

✅ Setup completed successfully!
```

### Updating Configuration Files

The package **never overwrites** existing files. To update your configuration:

1. **Backup existing files** (optional):
```bash
mv .cursor .cursor.backup
mv .vscode .vscode.backup
```

2. **Update the package**:
```bash
npm update ai-editor-setup
```

3. **Compare and merge** changes as needed

### Customization

All configuration files are created in your project root. You can customize them directly:

- Edit `.cursor/cursor.json` for Cursor settings
- Modify `.vscode/settings.json` for VS Code preferences
- Update `.ai/config.json` for Claude configuration
- Adjust `.github/workflows/ci.yml` for CI/CD

---

## 🤝 Contributing

We welcome contributions from the community! Whether you want to report a bug, suggest a feature, or submit code changes, your help is appreciated.

### How to Contribute

#### 1. Report Issues

Found a bug or have a feature request?

- 🐛 [Open a bug report](https://github.com/Sumonta056/npm-ai-editor-setup/issues/new?template=bug_report.md)
- 💡 [Suggest a feature](https://github.com/Sumonta056/npm-ai-editor-setup/issues/new?template=feature_request.md)

#### 2. Submit Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/npm-ai-editor-setup.git
   cd npm-ai-editor-setup
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm install
   npm link
   # Test in another project: npm link ai-editor-setup
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

6. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub.

### Areas for Contribution

- 🎨 **Improve Templates**: Enhance default configuration templates
- 📚 **Documentation**: Fix typos, add examples, improve clarity
- 🐛 **Bug Fixes**: Fix issues and improve reliability
- ✨ **New Features**: Add support for new editors or features
- 🧪 **Testing**: Add tests to improve code quality

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Sumonta056/npm-ai-editor-setup.git
cd npm-ai-editor-setup

# Install dependencies
npm install

# Link for local testing
npm link

# In another project, test your changes
cd ../test-project
npm link ai-editor-setup
```

### Code of Conduct

Please be respectful and constructive in all interactions. We're all here to make this project better.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this project
- Inspired by the need for consistent development environments
- Built with ❤️ for the developer community

---

## 📞 Support

- 📧 **Email**: sumontasaha80@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/Sumonta056/npm-ai-editor-setup/issues)
- 📖 **Documentation**: [GitHub Repository](https://github.com/Sumonta056/npm-ai-editor-setup)

---

<div align="center">

**Made with ❤️ by [Sumonta Saha](https://github.com/Sumonta056)**

⭐ Star this repo if you find it helpful!

</div>
