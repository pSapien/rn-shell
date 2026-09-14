const { execSync } = require('child_process');

function createPlistBuddy(target) {
  const targetPlist = target;

  function runCommand(command) {
    return execSync(`/usr/libexec/PlistBuddy -c "${command}" "${targetPlist}"`).toString('utf-8');
  }

  return {
    add(key, value) {
      let plistType = 'string';

      if (typeof value === 'boolean') {
        plistType = 'bool';
      } else if (typeof value === 'number') {
        plistType = 'integer';
      } else {
        plistType = 'string'
        value = `'${value}'`;
      }

      return runCommand(`ADD ${key} ${plistType} ${value}`);
    },

    delete(key) {
      try {
        return runCommand(`DELETE ${key}`);
      } catch (err) {
        /** Will show errors if key does not exist when deleting */
        console.warn(err.message);
        return;
      }
    },
  };
}

function updateInfoPlist(path, infoPlist) {
  if (!path) {
    console.warn('[updateInfoPlist] Warn: Target Info.plist path is missing');
    return;
  }

  if (!infoPlist || typeof infoPlist !== 'object') {
    console.warn('[updateInfoPlist] Warn: Provided "infoPlist" configuration is invalid or empty.');
    return;
  }

  console.log('Injecting custom iOS Info.plist entries...', path);
  const plistBuddy = createPlistBuddy(path);
  
  Object.entries(infoPlist).forEach(([key, value]) => {
    plistBuddy.delete(key);
    plistBuddy.add(key, value);
  });
}

module.exports = updateInfoPlist;