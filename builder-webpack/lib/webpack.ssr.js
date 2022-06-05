const path = require('path');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin/src');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'production',
  output: {
    path: path.join(__dirname, 'dist/'),
    // library: "demo",
    filename: 'component1/[name].js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: 'ignore-loader',
      },
      {
        test: /.less$/,
        use: 'ignore-loader',
      },
    ],
  },
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
  devtool: 'source-map',
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
