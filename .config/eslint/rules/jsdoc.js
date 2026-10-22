module.exports = {
  'jsdoc/check-alignment': 'warn',
  'jsdoc/check-indentation': 'warn',
  'jsdoc/check-line-alignment': ['warn', 'never'],
  'jsdoc/check-param-names': [
    'warn',
    {
      disableExtraPropertyReporting: true,
    },
  ],
  'jsdoc/check-tag-names': [
    'warn',
    {
      definedTags: ['endpoint'],
    },
  ],
  'jsdoc/check-types': 'warn',
  'jsdoc/multiline-blocks': [
    'warn',
    {
      noSingleLineBlocks: true,
    },
  ],
  'jsdoc/no-bad-blocks': 'error',
  'jsdoc/no-multi-asterisks': 'warn',
  'jsdoc/no-undefined-types': 'warn',
  'jsdoc/require-asterisk-prefix': ['warn', 'always'],
  'jsdoc/require-param': [
    'warn',
    {
      exemptedBy: ['endpoint', 'inheritdoc'],
      autoIncrementBase: 0,
      checkConstructors: true,
      checkDestructured: true,
      checkDestructuredRoots: true,
      checkGetters: false,
      checkRestProperty: false,
      checkSetters: false,
    },
  ],
  'jsdoc/require-param-name': 'warn',
  'jsdoc/require-param-type': 'warn',
  'jsdoc/require-property-name': 'warn',
  'jsdoc/require-property-type': 'warn',
  'jsdoc/require-returns': [
    'warn',
    {
      exemptedBy: ['endpoint', 'inheritdoc', 'yields'],
      checkConstructors: false,
      checkGetters: true,
      forceRequireReturn: false,
      forceReturnsWithAsync: false,
    },
  ],
  'jsdoc/require-returns-check': 'warn',
  'jsdoc/require-returns-type': 'warn',
  'jsdoc/require-yields': 'warn',
  'jsdoc/require-yields-check': 'warn',
  'jsdoc/tag-lines': ['warn', 'never'],
}
