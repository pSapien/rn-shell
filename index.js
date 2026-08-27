/**
 * @format
 */

import { AppRegistry } from 'react-native';
// import App from './App.tsx';
// import { name as appName } from './app.json';
import App from '@@app';

// import runtimeConfig from '.runtime.config.json';

// const defaultApp = require(runtimeConfig.script);

AppRegistry.registerComponent("ReactNativeShell", () => App);
