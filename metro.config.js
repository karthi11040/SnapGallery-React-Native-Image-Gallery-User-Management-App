const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure polyfill resolution for RN 0.87+ compatibility
config.serializer.getPolyfills = ({ platform }) => {
  if (!platform) return [];
  try {
    return require('react-native/rn-get-polyfills')();
  } catch (e) {
    try {
      return require('@react-native/js-polyfills')();
    } catch (err) {
      return [];
    }
  }
};

module.exports = config;
