// @ts-check
// ESLint (flat config) com angular-eslint. [PADRÃO DE MERCADO]
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: ['app', 'dsc'], style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: ['element', 'attribute'], prefix: ['app', 'dsc'], style: 'kebab-case' },
      ],
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    // A cópia local do DSC usa seletores de atributo em camelCase (ex.: button[dscButton]), como o DSC.
    files: ['projects/dsc-web-local/**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
