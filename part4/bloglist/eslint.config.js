const js = require('@eslint/js')
const globals = require('globals')
module.exports = [
  { ignores: ['dist/**', 'frontend/**', 'node_modules/**'] },
  js.configs.recommended,
  { languageOptions: { sourceType: 'commonjs', globals: globals.node }, rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'eqeqeq': 'error', 'no-var': 'error',
  } },
]
