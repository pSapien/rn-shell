module.exports = {
  root: true,
  extends: '@react-native',

  parserOptions: {
    // Disable linter error on configuration files (metro.config.js, react-native.config.js, etc)
    requireConfigFile: false, // Disables the requirement for a separate Babel config file
  },
};
