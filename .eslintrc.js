module.exports = {
  env: {
    browser: true,
    commonjs: true,
  },
  extends: [
    '@fuelrats/eslint-config',
    '@fuelrats/eslint-config-react',
  ],
  rules: {
    'jsx-a11y/no-noninteractive-element-interactions': ['off'], // We intend to enable this once we refactor certain key components.
    'react/prop-types': ['off'], // We're not quite ready to enforce prop-types for all files yet.
    'jsdoc/require-jsdoc': ['off'], // we'll get to it someday...
    'jsx-a11y/no-onchange': ['off'], // To be fixed with eslint-config-react@2.1.0
    'react/no-did-mount-set-state': ['off'], // To be fixed with eslint-config-react@2.1.0
    'import/no-cycle': ['error'], // To be fixed with eslint-config-react@2.1.0
  },
  settings: {
    'import/ignore': [
      '.worker.js$',
    ],
  },
}
