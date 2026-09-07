# React Native Shell
A shell for developing and building React Native apps.

### Objectives:
1. To keep one copy of React Native modules for any number of react native applications.
   And run a react native app like web application
2. Make react native application configurable with a simple config file, allowing to change
   app icons, splash screens, bundle id, versions, etc. 
3. Link native dependencies automatically
4. Make it easier to update react-native version from a single source.

### Usage
1. Clone the repo in the local folder
2. Link repo globally with `npm link` command
3. Use `rn-shell` as a direct replacement for `react-native` commands. Ex: `rn-shell run`
   in your application folder.
4. Export a default `App` component from the application main.
