// Main entry point for the package
// Version is read from package.json to avoid version mismatches
const packageJson = require('./package.json');

module.exports = {
  name: 'ai-editor-setup',
  version: packageJson.version
};


