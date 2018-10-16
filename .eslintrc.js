module.exports = {
  env: {
    browser: true,
  },
  extends: '@fuelrats/eslint-config-react',
  rules: {
    'react/prop-types': ['off'], // We're not quite ready to enforce prop-types for all files yet
    'jsx-a11y/no-noninteractive-element-interactions': ['off'], // We intend to enable this once we refactor certain key components

    // Pending conf changes
    'react/jsx-handler-names': ['error', {
      eventHandlerPrefix: '_?handle',
      eventHandlerPropPrefix: 'on',
    }],
    'no-undefined': ['off'],
    'no-confusing-arrow': ['error', {
      allowParens: true,
    }],
    'import/group-exports': ['off'],
    'max-lines-per-function': ['off'],
    'max-statements': ['error', 100],
    'arrow-parens': ['error', 'as-needed', {
      requireForBlockBody: true,
    }],
    'react/no-unescaped-entities': ['off'],
    'react/jsx-one-expression-per-line': ['off'],
  },
}
