module.exports = {
  plugins: ['simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:cypress/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: ['./tsconfig.json'],
  },
  ignorePatterns: ['dist/', '*.cjs', '*.mjs', '*.js'],
  rules: {
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'vue/one-component-per-file': 'off',
    'vue/require-prop-types': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};
