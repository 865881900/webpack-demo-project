const path = require('path');
const glob = require('glob');

// 用来自动创建html5文件,并引入bundle.js文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const projectRoot = process.cwd();

/**
 * 多模块打包
 * @param filterList
 * @return {{entry: {}, pluginsList: *[]}}
 */
function getModule(filterList = []) {
  const entry = {};
  const pluginsList = [];

  const dirName = process.env.IS_SSR ? 'src' : 'server';

  // 获取需要提取的模块js文件
  const modulePathList = glob.sync(path.join(projectRoot, `./${dirName}/*/index.js`));
  // 获取模块的文件名
  for (let i = 0; i < modulePathList.length; i += 1) {
    // eslint-disable-next-line no-useless-escape
    const matchList = modulePathList[i].match(new RegExp(`\/${dirName}\/(.*)\/index\.js$`));
    if (matchList && matchList[1] && !filterList.includes(matchList[1])) {
      const moduleName = matchList[1];
      entry[moduleName] = path.resolve(modulePathList[i]);
      pluginsList.push(new HtmlWebpackPlugin({
        template: path.join(projectRoot, './index.html'),
        filename: `${moduleName}.html`,
        chunks: [moduleName, 'commons'], // 需要注入的模块(入口)
        inject: true, // 是否注入脚本, 和脚本注入位置
        minify: {
          html5: true, // 使用html规范
          collapseWhitespace: true, // 折叠构成文档树中文本节点的空白
          // 当标签之间的空格包含换行符时，总是折叠为1个换行符(永远不要完全删除它)。必须与collapseWhitespace=true一起使用
          preserveLineBreaks: false,
          minifyCSS: true, // 压缩css
          minifyJS: true, // 压缩js
          removeComments: false, // 删除注释
        },
      }));
    }
  }

  return {
    entry,
    pluginsList,
  };
}

const {
  entry,
  pluginsList,
} = getModule();

module.exports = {
  entry,
  output: {
    path: path.join(projectRoot, 'dist/'),
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader', // es6语法转换
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 使用ContentHash模式对css文件进行打包
          // 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader',
          'less-loader', // 解析less文件
        ],
      }, {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader',
          'scss-loader', // 解析less文件
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader', // 压缩图片为base64格式
            options: {
              limit: 1024 * 100,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'image/[folder]/[name].[hash:8].[ext]',
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8][ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // dist文件目录清理
    new CleanWebpackPlugin(),
    // 优化命令行
    new FriendlyErrorsWebpackPlugin(),
    // 错误提取
    function () {
      this.hooks.done.tap('done', (state) => {
        if (state.compilation.errors && state.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          console.error('build error');
          process.exit(1);
        }
      });
    },
    // css文件单独打包
    new MiniCssExtractPlugin({
      filename: '[name][contenthash:8].css',
    }),
    ...pluginsList,
  ],
  stats: 'errors-only',
};
