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
    'arrow-parens': ['off'],
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'comma-dangle': ['error', 'always-multiline'],
    'import/no-named-as-default': ['off'],
    'import/no-named-as-default-member': ['off'],
    'import/prefer-default-export': ['off'],
    'max-len': ['off'],
    'new-parens': ['off'],
    'no-fallthrough': ['error', { 'commentPattern': 'fallsthrough'}],
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
        '$scope', // for Angular 1 scopes
        'target', // for ESNext decorators
      ]
    }],
    'no-restricted-syntax': ['off'],
    'no-return-assign': ['off'],
    'no-underscore-dangle': ['off'],
    'prefer-const': ['error', {
      'destructuring': 'all',
      'ignoreReadBeforeAssign': true,
    }],
    'prefer-rest-params': ['off'],
    'react/forbid-prop-types': ['off'],
    'react/jsx-closing-bracket-location': ['off'],
    'react/jsx-filename-extension': ['off'],
    'react/no-multi-comp': ['off'],
    'react/react-in-jsx-scope': ['off'],
    'react/sort-comp': ['off'],
    'space-before-function-paren': ['error', 'always'],
    'spaced-comment': ['off'],
    'quotes': ['off'],
    'babel/quotes': ['error', 'single', { 'avoidEscape': true }],
    'semi': ['off'],
    'babel/semi': ['error', 'never'],
    'no-unused-expressions': ['off'],
    'babel/no-unused-expressions': ['error', {
      'allowShortCircuit': false,
      'allowTernary': false,
      'allowTaggedTemplates': false,
    }],
    'jsx-a11y/anchor-is-valid': ['off'],
    'jsx-a11y/label-has-for': ['off'],
    'jsx-a11y/no-noninteractive-element-interactions': ['off'],
    'react/destructuring-assignment': ['off'],
    'react/jsx-one-expression-per-line': ['off'],
    'react/no-unescaped-entities': ['off'],
    'react/no-did-mount-set-state': ['off'],
    'react/prop-types': ['off'],
  },
}
