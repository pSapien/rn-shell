const path = require('path');
const fs = require('fs');

const runTimeConfig = JSON.parse(fs.readFileSync('./.runtime.config.json'));

const config = {
  dependencies: {}
};

// Just list the dependencies from package.json to make sure if they have
// native dependencies they are picked up by the autolinking process
Object.keys(runTimeConfig.dependencies).forEach((dependency) => {
  let dependencyPath = path.resolve(runTimeConfig.directory, 'node_modules', dependency);
  // Search in workspace root if not available
  if (!fs.existsSync(dependencyPath)) {
    if (runTimeConfig.workspaceRoot) {
      dependencyPath = path.resolve(runTimeConfig.workspaceRoot, "node_modules", dependency);
      if (!fs.existsSync(dependencyPath)) {
        dependencyPath = '';
      }
    }
  }

  if (dependencyPath) {
    config.dependencies[dependency] = {
      root: dependencyPath
    }
  }
});

if (runTimeConfig.assets) {
  config.assets = runTimeConfig.assets.map(p => path.resolve(runTimeConfig.directory, p));
}

module.exports = config;
