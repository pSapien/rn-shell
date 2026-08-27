const fs = require('fs');
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const runTimeConfig = JSON.parse(fs.readFileSync('./.runtime.config.json'));
// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
const defaultConfig = getDefaultConfig(__dirname);

const shellRoot = __dirname;
const workspaceRoot = undefined;
const applicationRoot = runTimeConfig.directory;

const config = {
  projectRoot: shellRoot,
  watchFolders: [
    applicationRoot,
    shellRoot,
  ],
  resolver: {
    ...defaultConfig.resolver,
    disableHierarchicalLookup: true,
    nodeModulesPaths: [
      path.resolve(shellRoot, 'node_modules'),
      path.resolve(applicationRoot, 'node_modules'),
    ],
    extraNodeModules: {
      // Point to the project root to load the main App component
      '@@app': applicationRoot,
    },
  }
};

// If we have an workspace we will need to watch that as well
if (workspaceRoot) {
  // config.watchFolders.push(workspaceRoot);
  config.resolver.nodeModulesPaths.push(path.resolve(workspaceRoot, 'node_modules'));
}


//
// // console.log('Shell Root', shellRoot);
// const config = {
//   applicationRoot: runTimeConfig.directory,
//   watchFolders: [
//     runTimeConfig.directory,
//     shellRoot,
//   ],
//   resolver: {
//     ...defaultConfig.resolver,
//     unstable_enableSymlinks: true,

//     // do not search within folders
//     // disableHierarchicalLookup: true,
//     nodeModulesPaths: [
//       path.resolve(runTimeConfig.directory, 'node_modules'),
//       // path.resolve(shellRoot, 'node_modules'),
//     ],
//     extraNodeModules: {
//       'react': path.resolve(shellRoot, 'node_modules/react'),
//       'react-native': path.resolve(shellRoot, 'node_modules/react-native'),
//     },
//     // Prevent Metro from searching inside sub-node_modules for React
//     blockList: [
//       // path.resolve(runTimeConfig.directory, 'node_modules/react'),
//       // path.resolve(runTimeConfig.directory, 'node_modules/react-native'),
//       // new RegExp(/node_modules\/.*\/node_modules\/react\/.*/),
//       // new RegExp(/node_modules\/.*\/node_modules\/react-native\/.*/),

//     ],
//   }
// }

// // console.log('Metro Config', defaultConfig, config);

module.exports = mergeConfig(defaultConfig, config);
