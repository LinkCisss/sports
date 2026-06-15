const { withInfoPlist } = require('@expo/config-plugins');

const withLiveActivities = (config) => {
  return withInfoPlist(config, (config) => {
    config.modResults.NSSupportsLiveActivities = true;
    return config;
  });
};

module.exports = withLiveActivities;
