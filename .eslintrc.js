module.exports = {
  env: {
    'browser': true
  },
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: [
    'babel'
  ],
  rules: {
    // eslint-core
    'arrow-parens': ['error', 'as-needed'],
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'comma-dangle': ['error', 'always-multiline'],
    'max-classes-per-file': ['error', 2],
    'max-len': ['off'],
    'new-parens': ['off'],
    'no-async-promise-executor': ['error'],
    'no-fallthrough': ['error', { 'commentPattern': 'fallsthrough'}],
    'no-misleading-character-class': ['error'],
    'no-multi-assign': ['off'],
    'no-multiple-empty-lines': ['error', { 'max': 5 }],
    'no-plusplus': ['off'],
    'no-param-reassign': ['error', {
      'props': true,
      'ignorePropertyModificationsFor': [
        'acc', // for reduce accumulators
        'accumulator', // for reduce accumulators
        'Component', // for React HOCs
        'e', // for e.returnvalue
        'ctx', // for Koa routing
        'req', // for Express requests
        'request', // for Express requests
        'res', // for Express responses
        'response', // for Express responses
        'target', // for ESNext decorators
      ]
    }],
    'no-restricted-syntax': ['off'],
    'no-return-assign': ['off'],
    'no-underscore-dangle': ['off'],
    'no-unused-expressions': ['off'],
    'prefer-const': ['error', {
      'destructuring': 'all',
      'ignoreReadBeforeAssign': true,
    }],
    'prefer-object-spread': ['error'],
    'prefer-rest-params': ['off'],
    'quotes': ['off'],
    'require-atomic-updates': ['error'],
    'semi': ['off'],
    'space-before-function-paren': ['error', 'always'],
    'spaced-comment': ['off'],

    // eslint-plugin-babel
    'babel/no-unused-expressions': ['error', {
      'allowShortCircuit': false,
      'allowTernary': false,
      'allowTaggedTemplates': false,
    }],
    'babel/quotes': ['error', 'single', { 'avoidEscape': true }],
    'babel/semi': ['error', 'never'],

    // eslint-plugin-import
    'import/no-named-as-default': ['off'],
    'import/no-named-as-default-member': ['off'],
    'import/prefer-default-export': ['off'],

    // exlint-plugin-jsx-a11y
    'jsx-a11y/anchor-is-valid': ['off'],
    'jsx-a11y/label-has-associated-control': ['off'], // Rule is currently broken LOL
    'jsx-a11y/label-has-for': ['off'],
    'jsx-a11y/no-noninteractive-element-interactions': ['off'],

    // eslint-plugin-react
    'react/destructuring-assignment': ['off'],
    'react/forbid-prop-types': ['off'],
    'react/jsx-closing-bracket-location': ['off'],
    'react/jsx-filename-extension': ['off'],
    'react/jsx-one-expression-per-line': ['off'],
    'react/no-did-mount-set-state': ['off'],
    'react/no-multi-comp': ['off'],
    'react/no-unescaped-entities': ['off'],
    'react/prop-types': ['off'],
    'react/react-in-jsx-scope': ['off'],
    'react/sort-comp': ['off'],
  },
}
