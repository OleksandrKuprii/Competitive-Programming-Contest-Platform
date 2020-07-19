const path = require('path');

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({}),
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.ejs',
      filename: 'index.html',
      inject: true,
      templateParameters: ({
        themeColor: '#eeeeee',
        description: 'Toucan',
        title: 'Toucan',
      })
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '.build', 'dev'),
  },
  devServer: {
    contentBase: path.join(__dirname, '.build', 'dev'),
    compress: true,
    port: 3000
  },
};
