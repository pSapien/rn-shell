#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const rncli = require(require.resolve(path.resolve(__dirname, "node_modules", "@react-native-community", "cli")));

// Create a run time config from the current working directory
const pkg = JSON.parse(fs.readFileSync(path.resolve('./package.json')));

const runConfig = {
  name: pkg.name,
  version: pkg.version,

  directory: process.cwd(), // The application working director

  main: pkg.main,       // Relative to directory

  dependencies: pkg.dependencies,
}

// Change the root directory to the Shell root
process.chdir(__dirname);
fs.writeFileSync('.runtime.config.json', JSON.stringify(runConfig, undefined, 2));

// run via react-native cli
rncli.run('react-native');
