const path = require('path')
const {glob} = require("glob");
// 用来自动创建html5文件,并引入bundle.js文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");


function getModule(filterList = []) {
  const entry = {};
  const pluginsList = [];
  // 获取需要提取的模块js文件
  const modulePathList = glob.sync(path.join(__dirname, './src/*/index.js'));
  // 获取模块的文件名
  for (let i = 0; i < modulePathList.length; i++) {
    const matchList = modulePathList[i].match(/\/src\/(.*)\/index\.js$/);
    if (matchList && matchList[1] && !filterList.includes(matchList[1])) {
      const moduleName = matchList[1];
      entry[moduleName] = path.resolve(modulePathList[i]);
      pluginsList.push(new HtmlWebpackPlugin({
        template: path.join(__dirname, './index.html'),
        filename: `${moduleName}.html`,
        chunks: [moduleName, 'commons'],// 需要注入的模块(入口)
        inject: true, //是否注入脚本, 和脚本注入位置
        minify: {
          html5: true, //使用html规范
          collapseWhitespace: true, // 折叠构成文档树中文本节点的空白
          preserveLineBreaks: false, // 当标签之间的空格包含换行符时，总是折叠为1个换行符(永远不要完全删除它)。必须与collapseWhitespace=true一起使用
          minifyCSS: true, // 压缩css
          minifyJS: true, //压缩js
          removeComments: false, //删除注释
        }
      }))

    }
  }

  return {
    entry,
    pluginsList
  }
}


const {entry, pluginsList} = getModule();
module.exports = {
  entry,
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].[chunkhash].js',
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
          // {
          //   loader: 'style-loader',
          //   options: {
          //     insertAt: 'top',
          //     singleton: true
          //   }
          // },
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  overrideBrowserslist: ['last 2 version', '>1%', 'IE 10']
                })
              ]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUni: 75,
              remPrecision: 8
            }
          }
        ]
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  overrideBrowserslist: ['last 2 version', '>1%', 'IE 10']
                })
              ]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUni: 47.5,
              remPrecision: 8
            }
          }
        ]
      },
    ]
  },
  plugins: [
    ...pluginsList,
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `[name][contenthash:8].css`
    }),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    new FriendlyErrorsWebpackPlugin(),
    function () {
      this.hooks.done.tap('done', (state) => {
        // console.log('state', state);
        // console.log('compilation', state.compilation);
        // console.log('errors', state.compilation.errors);
        // console.log('argv', process.argv);
        if (state.compilation.errors && state.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          console.error('build error');
          process.exit(1);
        }
      })
    },
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://unpkg.com/react@18/umd/react.production.min.js',
          global: 'React',
        },  {
          module: 'react-dom',
          entry: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
          global: 'ReactDOM',
        },
      ],
    })
  ],
  mode: 'production',
  // mode: 'none',
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      minSize: 0,

      cacheGroups: {
        commons: {
          minChunks: 2,
          // test: /(react|reack-dom)/,
          name: 'commons',
          chunks: 'all'
        }
      }
      // minSize: ,
      // chunks: 'all',
    },
  },
  stats: "errors-only"
}

