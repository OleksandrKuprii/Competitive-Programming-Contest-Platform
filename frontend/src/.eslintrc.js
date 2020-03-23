module.exports = {
  extends: ['airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    "no-unused-vars":  ["error", { "argsIgnorePattern": "^_" }]
  }
};