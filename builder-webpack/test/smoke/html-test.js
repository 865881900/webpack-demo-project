const glob = require('glob-all');

describe('checking generated html files', () => {

  it('should generated html files', (done) => {
    const files = glob.sync([
      './dist/vue.html',
      './dist/react.html',
    ]);
    if (files.length > 0) {
      done();
    } else {
      throw new Error('no html files generated');
    }
  });
});
