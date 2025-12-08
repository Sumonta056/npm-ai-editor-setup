# ai-editor-setup

An npm package that automatically sets up Cursor IDE configuration files for your project. It creates essential development files including `.cursor/` configuration, rules, and ignore patterns to streamline your development workflow.

## About

`ai-editor-setup` eliminates manual configuration overhead by automatically generating Cursor IDE settings when installed. The package uses npm's postinstall hook to copy configuration templates to your project root, ensuring consistent development environments across projects.

**What gets created:**
- `.cursor/` folder with `cursor.json` configuration and `rules/core.mdc` development guidelines
- `.cursorignore` file to exclude files from Cursor's indexing
- Additional AI editor configurations (`.ai/`, `.aiassistant/`)

## Installation

Install the package in your project:

```bash
npm install ai-editor-setup
```

The package will automatically run after installation and create the configuration files in your project root. Existing files are preserved and won't be overwritten.

**Prerequisites:**
- Node.js v14 or higher
- npm v6 or higher
- An existing npm project (with `package.json`)

## Updating

To update to the latest version:

```bash
npm update ai-editor-setup
```

The postinstall script will run automatically after the update. Note that existing configuration files won't be overwritten - you'll need to manually update them if you want to incorporate new template changes.

To force update configuration files, you can temporarily rename or remove existing files before updating:

```bash
# Backup existing files (optional)
mv .cursor .cursor.backup
mv .cursorignore .cursorignore.backup

# Update the package
npm update ai-editor-setup

# Compare and merge changes as needed
```

## Contributing

Contributions are welcome! Here's how you can help:

1. **Report Issues**: Found a bug or have a feature request? Open an issue on [GitHub](https://github.com/sumonta056/ai-editor-setup/issues)

2. **Submit Pull Requests**:
   - Fork the repository
   - Create a feature branch (`git checkout -b feature/amazing-feature`)
   - Make your changes
   - Commit your changes (`git commit -m 'Add some amazing feature'`)
   - Push to the branch (`git push origin feature/amazing-feature`)
   - Open a Pull Request

3. **Improve Templates**: Help improve the default configuration templates in the `templates/` directory

4. **Documentation**: Improve documentation, fix typos, or add examples

**Development Setup:**
```bash
# Clone the repository
git clone https://github.com/sumonta056/ai-editor-setup.git
cd ai-editor-setup

# Install dependencies
npm install

# Test your changes locally
npm link
# Then in another project: npm link ai-editor-setup
```

## License

MIT
