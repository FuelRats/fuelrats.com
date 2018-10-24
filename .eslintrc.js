module.exports = {
  env: {
    browser: true,
  },
  extends: '@fuelrats/eslint-config-react',
  rules: {
    'react/prop-types': ['off'], // We're not quite ready to enforce prop-types for all files yet
    'jsx-a11y/no-noninteractive-element-interactions': ['off'], // We intend to enable this once we refactor certain key components
  },
}
