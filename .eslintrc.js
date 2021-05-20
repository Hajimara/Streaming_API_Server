module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  extends: ['airbnb'],
  env: {
    browser: true,
    node: true,
    mocha: true,
  },
  rules: {
    'max-length': 0, // 0으로 설정하면 에러 검출 X
    'consistent-return': 0,
    'no-underscore-dangle': 0,
    'no-trailing-spaces': 0,
    'no-param-reassign': 0,
  },
  plugins: ['import'],
  globals: {
    $: true,
  },
};
