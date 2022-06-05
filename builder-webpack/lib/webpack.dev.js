const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackBase = require('./webpack.base');


const webpackDev = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    stats: 'errors-only',
    hot: true,
    contentBase: 'dist/',
  },
  devtool: 'cheap-source-map',
};

module.exports = webpackMerge(webpackBase, webpackDev);
