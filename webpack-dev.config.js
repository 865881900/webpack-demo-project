const path = require('path')

// 用来自动创建html5文件,并引入bundle.js文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    vue: path.resolve(__dirname, './src/vue/index.js'),
    react: path.resolve(__dirname, './src/react/index.js'),
  },
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 10,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'image/[folder]/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8][ext]',
            },
          },
        ],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name][contenthash:8].css`
    }),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    new HtmlWebpackPlugin({
      title: 'vueDemo',
      template: path.join(__dirname, './index.html'),
      filename: 'vue.html',
      chunks: ['vue'],// 需要注入的模块(入口)
      inject: true, //是否注入脚本, 和脚本注入位置
      minify: {
        html5: true, //使用html规范
        collapseWhitespace: true, // 折叠构成文档树中文本节点的空白
        preserveLineBreaks: false, // 当标签之间的空格包含换行符时，总是折叠为1个换行符(永远不要完全删除它)。必须与collapseWhitespace=true一起使用
        minifyCSS: true, // 压缩css
        minifyJS: true, //压缩js
        removeComments: false, //删除注释
      }
    }),
    new HtmlWebpackPlugin({
      title: 'reactDemo',
      template: path.join(__dirname, './index.html'),
      filename: 'react.html',
      chunks: ['react'],// 需要注入的模块(入口)
      inject: true, //是否注入脚本, 和脚本注入位置
      minify: {
        html5: true, //使用html规范
        collapseWhitespace: true, // 折叠构成文档树中文本节点的空白
        preserveLineBreaks: false, // 当标签之间的空格包含换行符时，总是折叠为1个换行符(永远不要完全删除它)。必须与collapseWhitespace=true一起使用
        minifyCSS: true, // 压缩css
        minifyJS: true, //压缩js
        removeComments: false, //删除注释
      }
    }),
    new FriendlyErrorsWebpackPlugin()
  ],
  devServer: {
    stats: "errors-only",
    hot: true,
    contentBase: 'dist/'
  },
  // devtool: 'cheap-source-map'
  devtool: 'source-map',

  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       test: /(react | reack-dom)/,
  //       name: 'my-react',
  //       chunks: 'all'
  //     }
  //     // minSize: ,
  //     // chunks: 'all',
  //   },
  // },
}