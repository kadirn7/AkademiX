const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimize web bundling
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'web.tsx', 'web.ts', 'web.jsx', 'web.js'];

// Add web-specific resolver
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // Try to resolve web-specific files first
    const webModuleName = moduleName.replace(/\.(js|jsx|ts|tsx)$/, '.web.$1');
    try {
      return context.resolveRequest(context, webModuleName, platform);
    } catch (e) {
      // If web-specific file doesn't exist, fall back to normal resolution
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Optimize caching
config.cacheVersion = '1.0';
config.maxWorkers = 4;
config.transformer.minifierConfig = {
  compress: {
    drop_console: true,
  },
};

module.exports = config; 