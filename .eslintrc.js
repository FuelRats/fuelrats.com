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
    'jsx-a11y/no-onchange': ['off'], // We will enable this when we are finished with refactoring certain components.
    'react/no-did-mount-set-state': ['off'], // To be fixed with eslint-config-react@2.0.1
    'react/prop-types': ['off'], // We're not quite ready to enforce prop-types for all files yet.
    'jsdoc/require-jsdoc': ['off'], // we'll get to it someday...
  },
  settings: {
    'import/ignore': [
      '.worker.js$',
    ],
  },
}
