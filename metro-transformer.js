/**
 * Metro transformer used to override babel behaviour
 */
const babel = require('@babel/core');
const fs = require('fs');

// the default transformer
const upstreamTransformer = require('@react-native/metro-babel-transformer');

module.exports.transform = function ({ src, filename, options }) {
  // Force Babel to use a specific configuration file path
  let customOptions = options;
  if (!filename.includes('node_modules')) {

    const plugins = [
      [require.resolve('./env.babel.plugin.js')]
    ];

    if (process.env.NODE_ENV === 'production') {
      plugins.push(['transform-remove-console']);
    }

    const result = babel.transformSync(src, {
      filename,
      ast: false,
      code: true,
      configFile: false,
      babelrc: false,
      presets: ['module:@react-native/babel-preset'],
      plugins,
    });

    if (result && result.code) {
      src = result.code;
    }
  }

  return upstreamTransformer.transform({ src, filename, options: customOptions });
};
