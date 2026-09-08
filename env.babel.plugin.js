/**
 * Plugin to replace environment values with value literals.
 * The environment values can be provided with
 *   .env.production.json  (committed)
 *   .env.local.json       (ignored)
 *
 * NODE_ENV is embedded by default
 */
const fs = require('fs');
const { resolve } = require('path');

function loadEnv() {
  const config = JSON.parse(fs.readFileSync(resolve(__dirname, '.runtime.config.json')));
  // const env = Object.assign({}, process.env);
  const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
  };
  const files = [".env.json", ".env.local.json"];
  files.forEach((file) => {
    if (fs.existsSync(resolve(config.directory, file))) {
      Object.assign(env, JSON.parse(fs.readFileSync(resolve(config.directory, file))));
    }
  });

  return env;
}

module.exports = function (options) {
  const t = options.types;

  const env = loadEnv();

  return {
    name: "custom-env-json-plugin",
    visitor: {
      MemberExpression: function MemberExpression(path, state) {
        if (t.isAssignmentExpression(path.parent) && path.parent.left == path.mode) return;
        if (path.get("object").matchesPattern("process.env")) {
          const key = path.toComputedKey();
          if (t.isStringLiteral(key)) {
            const name = key.value;
            const value = env[name];
            const replace = t.valueToNode(value);
            path.replaceWith(replace);
          }
        }
      }
    }
  }
}
