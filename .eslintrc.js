module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  extends: 'airbnb',
  env: {
    browser: true,
  },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_super'] }],
    'import/no-extraneous-dependencies': ['off'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
  },
};
