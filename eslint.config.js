// @ts-check
// ESLint (flat config) com angular-eslint. [PADRÃO DE MERCADO]
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

/*
 * Fronteiras entre camadas (ADR-13). Cada camada lista o que NÃO pode importar.
 * Dentro de uma mesma feature ou camada, use imports relativos.
 */
const SO_VIA_ALIAS_DSC = {
  group: ['**/dsc-web-local/**', '**/projects/**'],
  message: 'Importe a biblioteca de componentes só por @dsc/web (troca pela oficial depende disso — ADR-02).',
};
const proibir = (camadas, motivo) => ({
  group: camadas.map((c) => `@${c}/*`),
  message: motivo,
});
const fronteiras = (...regras) => ({
  'no-restricted-imports': ['error', { patterns: [SO_VIA_ALIAS_DSC, ...regras] }],
});

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
  { files: ['src/**/*.ts'], rules: fronteiras() },
  {
    files: ['src/app/core/**/*.ts'],
    rules: fronteiras(proibir(['features', 'layout', 'shared'], 'core/ é infraestrutura: não depende de telas.')),
  },
  {
    files: ['src/app/domain/**/*.ts'],
    rules: fronteiras(
      proibir(['core', 'features', 'layout', 'shared', 'mocks'], 'domain/ só depende de si mesmo e de bibliotecas.'),
    ),
  },
  {
    files: ['src/app/mocks/**/*.ts'],
    rules: fronteiras(proibir(['features', 'layout', 'shared'], 'mocks/ implementam contratos de core/ e domain/.')),
  },
  {
    files: ['src/app/shared/**/*.ts'],
    rules: fronteiras(
      proibir(['core', 'domain', 'features', 'layout', 'mocks'], 'shared/ é genérico: não conhece o negócio.'),
    ),
  },
  {
    files: ['src/app/layout/**/*.ts'],
    rules: fronteiras(proibir(['features', 'mocks'], 'layout/ não depende de features nem de mocks.')),
  },
  {
    files: ['src/app/features/**/*.ts'],
    rules: fronteiras(
      proibir(
        ['features', 'mocks', 'layout'],
        'Uma feature não importa outra feature, nem mocks (use os contratos), nem o layout. ' +
          'Dentro da própria feature, use imports relativos.',
      ),
      { group: ['@core/providers/*'], message: 'Os providers são da composição da aplicação (app.config.ts).' },
    ),
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
