const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        },
      ],
    });

    config.resolve.extensions.push('.ts', '.tsx');

    const componentsPath = path.join(__dirname, '..', 'src', 'components');
    const srcPath = path.join(__dirname, '..', 'src');

    config.resolve.alias['@'] = componentsPath;
    config.resolve.alias['~'] = srcPath;

    return config;
  },
};
