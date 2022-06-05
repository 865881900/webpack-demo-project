module.exports = {
  'parser': 'babel-eslint',
  'extends': 'airbnb-base',
  'env': {
    'browser': true,
    'node': true,
    "jasmine": true
  },
  'rules': {
    'global-require': 0,
    'no-trailing-spaces': 0,
    'no-multiple-empty-lines': 0,
    'import/extensions': ['error', 'always', {
      ignorePackages: false
    }],
  }
};
