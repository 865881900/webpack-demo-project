const assert = require('assert');

describe('测试base打包', () => {
  it('entry', () => {
    const baseConfig = require('../../lib/webpack.base.js');
    // console.log(baseConfig);
    assert.equal(baseConfig.entry.react, '/Users/myFile/学习/webpack/webpack-demo-project/builder-webpack/test/smoke/template/src/react/index.js');
    assert.equal(baseConfig.entry.vue, '/Users/myFile/学习 /webpack/webpack-demo-project/builder-webpack/test/smoke/template/src/vue/index.js');
  });
});
