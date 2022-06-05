const webpackMerge = require('webpack-merge');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const webpackBase = require('./webpack.base.js');

const webpackProd = {
  mode: 'production',
  plugins: [
    // css文件压缩
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
    }),

    // 文件模块引入
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://unpkg.com/react@18/umd/react.production.min.js',
          global: 'React',
        }, {
          module: 'react-dom',
          entry: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
          global: 'ReactDOM',
        },
      ],
    }),
  ],
  // 公用文件提取
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          minChunks: 2,
          name: 'commons',
          chunks: 'all',
        },
      },
    },
  },
};

module.exports = webpackMerge(webpackBase, webpackProd);
