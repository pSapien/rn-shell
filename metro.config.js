const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');

const runTimeConfig = JSON.parse(fs.readFileSync('./.runtime.config.json'));
// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
const defaultConfig = getDefaultConfig(__dirname);

const shellRoot = __dirname;
const workspaceRoot = runTimeConfig.workspaceRoot;
const applicationRoot = runTimeConfig.directory;

const config = {
  ...defaultConfig,

  projectRoot: applicationRoot,

  watchFolders: [
    shellRoot,
  ],
  resolver: {
    ...defaultConfig.resolver,
    resolveRequest: (context, moduleName, platform) => {
      console.log('Resolve request', platform, moduleName);
      if (moduleName === "./index") {
        if (!fs.existsSync(path.join(applicationRoot, 'index.js'))) {
          return {
            filePath: path.resolve(__dirname, 'index.js'),
            type: 'sourceFile',
          };
        }
      }
      // console.log('Resolve Request', moduleName, platform);
      return context.resolveRequest(context, moduleName, platform);
    },
    disableHierarchicalLookup: true,
    nodeModulesPaths: [
      path.resolve(shellRoot, 'node_modules'),
      path.resolve(applicationRoot, 'node_modules'),
    ],
    extraNodeModules: {
      // Point to the project root to load the main App component
      '@@app': applicationRoot,
    },
  },
  transformer: {
    ...defaultConfig.transformer,

    // Disabel babel.config.js
    enableBabelRCLookup: false,

    // Use our custom babel transformer
    babelTransformerPath: require.resolve('./metro-transformer.js'),
  },
};

// If we have an workspace we will need to watch that as well
if (workspaceRoot) {
  // config.watchFolders.push(workspaceRoot);
  config.resolver.nodeModulesPaths.push(path.resolve(workspaceRoot, 'node_modules'));
  config.watchFolders.push(workspaceRoot);
} else {
  config.watchFolders.push(applicationRoot);
}


module.exports = config;
