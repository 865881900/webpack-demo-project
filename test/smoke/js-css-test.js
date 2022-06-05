const glob = require('glob-all');

describe('checking generated js css files', () => {
  it('should generated js css files', (done) => {
    const files = glob.sync([
      './dist/vue*.js',
      './dist/react*.js',
      './dist/vue*.css',
      './dist/react*.css',
    ]);
    if (files.length > 0) {
      done();
    } else {
      throw new Error('no js css files generated');
    }
  });
});
