const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function createBuddy(target) {
  const targetPlist = target;
  return function plistBuddy(key, type, value, fn = "ADD") {
    if (value && typeof value === 'string') {
      value = `'${value}'`;
    }
    if (fn === "SET") {
      type = '';
    }

    try {
      return execSync(`/usr/libexec/PlistBuddy -c "${fn} ${key} ${type} ${value}" "${targetPlist}"`).toString('utf-8')
    } catch (err) {
      if (fn === 'DELETE') return;
      throw err;
    }
  }
}

const config = JSON.parse(fs.readFileSync(path.resolve(process.env.SRCROOT, '../.runtime.config.json')));

// # Generate app link association for universal link usage
// $PLISTBUDDY -c "DELETE :com.apple.developer.associated-domains" "$TARGET_ENTITLEMENTS"
// $PLISTBUDDY -c "ADD :com.apple.developer.associated-domain array" "$TARGET_ENTITLEMENTS"
// $PLISTBUDDY -c "ADD :com.apple.developer.associated-domain:0 string 'applinks:domain'" "$TARGET_ENTITLEMENTS"

let domain = config.universalLink;
if (domain) {
  const plistBuddy = createBuddy(`${process.env.BUILT_PRODUCTS_DIR}/${process.env.FULL_PRODUCT_NAME}/ReactNativeShell.entitlements`);

  if (typeof domain !== 'string') {
    domain = domain.domain;
  }

  console.log(`Generating entitlement for universal app link ${domain}`);
  plistBuddy(':com.apple.developer.associated-domains', 'array', "", "DELETE");
  plistBuddy(':com.apple.developer.associated-domains', 'array', "");
  plistBuddy(':com.apple.developer.associated-domains:0', 'string', `applinks:${domain}`);
}

// Check if there is a deepLink to be edited as well
if (config.deepLink) {
  console.log('Updating DeepLink' + config.deepLink);
  const plistBuddy = createBuddy(`${process.env.BUILT_PRODUCTS_DIR}/${process.env.INFOPLIST_PATH}`);

  const res = plistBuddy(":CFBundleURLTypes", "array", "", "PRINT");
  // Found an existing array, need to figure out the index
  let count = 0;
  if (res.startsWith('Array')) {
    let existing = res.indexOf(`CFBundleURLName = ${config.id}`);
    let searchPos = -1;
    while (searchPos < existing) {
      searchPos = res.indexOf('Dict', searchPos + 1);
      if (searchPos === -1) break;
      count += 1;
    }
  }

  console.log('Found existing entry at', count - 1);

  const index = Math.max(0, count - 1);
  plistBuddy(`:CFBundleURLTypes:${index}:CFBundleURLName`, "string", config.id, "SET");
  plistBuddy(`:CFBundleURLTypes:${index}:CFBundleURLSchemes:0`, "string", config.deepLink, "SET");
}
