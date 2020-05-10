const CracoWorkboxPlugin = require('craco-workbox');
const CracoAlias = require('craco-alias');

module.exports = {
  plugins: [
    {
      plugin: CracoWorkboxPlugin,
    },
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.extend.json',
      },
    },
  ],
};
