const path = require('path');

process.chdir(path.join(__dirname, 'smoke/template'));
describe('测试打包文件', () => {
  require('./unit/webpack-base-test.js');
});
