const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

// Get the default Metro configuration
const defaultConfig = getDefaultConfig(__dirname);

// Customize the config
module.exports = {
  ...defaultConfig,
  
  // Transformer configuration
  transformer: {
    ...defaultConfig.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    minifierConfig: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
  
  // Resolver configuration
  resolver: {
    ...defaultConfig.resolver,
    assetExts: [...defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'), 'db', 'ttf', 'otf'],
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg', 'cjs'],
    // Enhance module resolution
    extraNodeModules: {
      // Add common aliases
      '@components': path.resolve(__dirname, 'src/components'),
      '@screens': path.resolve(__dirname, 'src/screens'),
      '@navigation': path.resolve(__dirname, 'src/navigation'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@themes': path.resolve(__dirname, 'src/themes'),
      '@assets': path.resolve(__dirname, 'assets'),
    },
  },
  
  // Increase the worker count for better performance
  maxWorkers: 4,
  
  // Optimize watching
  watchFolders: [
    path.resolve(__dirname, '.'),
  ],
}; 