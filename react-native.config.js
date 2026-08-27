const path = require('path');
const fs = require('fs');

const runTimeConfig = JSON.parse(fs.readFileSync('./.runtime.config.json'));

const config = {
  dependencies: {}
};

// Just list the dependencies from package.json to make sure if they have
// native dependencies they are picked up by the autolinking process
Object.keys(runTimeConfig.dependencies).forEach((dependency) => {
  const dependencyPath = path.resolve(runTimeConfig.directory, 'node_modules', dependency);

  if (fs.existsSync(dependencyPath)) {
    config.dependencies[dependency] = {
      root: dependencyPath
    }
  }
});

module.exports = config;
