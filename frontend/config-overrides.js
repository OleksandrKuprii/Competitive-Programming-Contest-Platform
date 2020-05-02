/* eslint-disable */

const {
  rewireWorkboxInject,
  defaultInjectConfig: workboxDefaultInjectConfig,
} = require('react-app-rewire-workbox');

const path = require('path');

module.exports = {
  webpack: function override(config, env) {
    const workboxConfig = {
      ...workboxDefaultInjectConfig,
      swSrc: path.join(__dirname, 'src', 'custom-sw.js'),
    };

    if (env === 'production') {
      workboxConfig.importWorkboxFrom = 'local';
    }

    config = rewireWorkboxInject(workboxConfig)(config, env);

    return config;
  },
};
