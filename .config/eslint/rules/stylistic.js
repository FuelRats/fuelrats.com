// Limits
const MAX_LINE_LENGTH = 180


module.exports = {
  '@stylistic/array-bracket-spacing': ['error', 'never'],
  '@stylistic/arrow-parens': ['error', 'always'],
  '@stylistic/arrow-spacing': [
    'error',
    {
      before: true,
      after: true,
    },
  ],
  '@stylistic/block-spacing': ['error', 'always'],
  '@stylistic/brace-style': [
    'error',
    '1tbs',
    {
      allowSingleLine: false,
    },
  ],
  '@stylistic/comma-dangle': ['error', 'always-multiline'],
  '@stylistic/comma-spacing': [
    'error',
    {
      before: false,
      after: true,
    },
  ],
  '@stylistic/comma-style': [
    'error',
    'last',
    {
      exceptions: {
        ArrayExpression: false,
        ArrayPattern: false,
        ArrowFunctionExpression: false,
        CallExpression: false,
        FunctionDeclaration: false,
        FunctionExpression: false,
        ImportDeclaration: false,
        ObjectExpression: false,
        ObjectPattern: false,
        VariableDeclaration: false,
        NewExpression: false,
      },
    },
  ],
  '@stylistic/computed-property-spacing': [
    'error',
    'never',
    {
      enforceForClassMembers: true,
    },
  ],
  '@stylistic/dot-location': ['error', 'property'],
  '@stylistic/eol-last': ['error', 'always'],
  '@stylistic/function-call-argument-newline': ['error', 'consistent'],
  '@stylistic/function-call-spacing': ['error', 'never'],
  '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
  '@stylistic/generator-star-spacing': ['error', 'both'],
  '@stylistic/implicit-arrow-linebreak': ['error', 'beside'],
  '@stylistic/indent': [
    'error',
    2,
    {
      SwitchCase: 1,
      VariableDeclarator: {
        var: 2,
        let: 2,
        const: 3,
      },
      outerIIFEBody: 1,
      MemberExpression: 1,
      FunctionDeclaration: {
        parameters: 1,
        body: 1,
      },
      FunctionExpression: {
        parameters: 1,
        body: 1,
      },
      CallExpression: {
        arguments: 1,
      },
      ArrayExpression: 1,
      ObjectExpression: 1,
      ImportDeclaration: 1,
      flatTernaryExpressions: true,
      ignoredNodes: [
        'JSXElement',
        'JSXElement > *',
        'JSXAttribute',
        'JSXIdentifier',
        'JSXNamespacedName',
        'JSXMemberExpression',
        'JSXSpreadAttribute',
        'JSXExpressionContainer',
        'JSXOpeningElement',
        'JSXClosingElement',
        'JSXText',
        'JSXEmptyExpression',
        'JSXSpreadChild',
      ],
      ignoreComments: false,
      offsetTernaryExpressions: false,
    },
  ],
  '@stylistic/jsx-quotes': ['error', 'prefer-double'],
  '@stylistic/key-spacing': [
    'error',
    {
      beforeColon: false,
      afterColon: true,
    },
  ],
  '@stylistic/keyword-spacing': [
    'error',
    {
      before: true,
      after: true,
    },
  ],
  '@stylistic/linebreak-style': ['error', 'unix'],
  '@stylistic/lines-between-class-members': [
    'error',
    'always',
    {
      exceptAfterSingleLine: true,
    },
  ],
  '@stylistic/max-len': ['error', MAX_LINE_LENGTH],
  '@stylistic/max-statements-per-line': [
    'error',
    {
      max: 1,
    },
  ],
  '@stylistic/multiline-ternary': ['error', 'always-multiline'],
  '@stylistic/new-parens': 'error',
  '@stylistic/newline-per-chained-call': [
    'error',
    {
      ignoreChainWithDepth: 4,
    },
  ],
  '@stylistic/no-confusing-arrow': [
    'error',
    {
      allowParens: true,
      onlyOneSimpleParam: false,
    },
  ],
  '@stylistic/no-extra-semi': 'error',
  '@stylistic/no-floating-decimal': 'error',
  '@stylistic/no-mixed-operators': [
    'error',
    {
      groups: [
        ['%', '**'],
        ['%', '+'],
        ['%', '-'],
        ['%', '*'],
        ['%', '/'],
        ['**', '+'],
        ['**', '-'],
        ['**', '*'],
        ['**', '/'],
        ['/', '*'],
        ['&', '|', '^', '~', '<<', '>>', '>>>', '??'],
        ['==', '!=', '===', '!==', '>', '>=', '<', '<=', '??'],
        ['&&', '||', '??', '?:'],
        ['in', 'instanceof', '??'],
      ],
      allowSamePrecedence: false,
    },
  ],
  '@stylistic/no-mixed-spaces-and-tabs': 'error',
  '@stylistic/no-multi-spaces': [
    'error',
    {
      ignoreEOLComments: false,
    },
  ],
  '@stylistic/no-multiple-empty-lines': [
    'error',
    {
      max: 5,
      maxBOF: 0,
      maxEOF: 1,
    },
  ],
  '@stylistic/no-trailing-spaces': [
    'error',
    {
      skipBlankLines: false,
      ignoreComments: false,
    },
  ],
  '@stylistic/no-whitespace-before-property': 'error',
  '@stylistic/nonblock-statement-body-position': [
    'error',
    'beside',
    {
      overrides: {},
    },
  ],
  '@stylistic/object-curly-newline': [
    'error',
    {
      ExportDeclaration: {
        minProperties: 5,
        multiline: true,
        consistent: true,
      },
      ImportDeclaration: {
        minProperties: 5,
        multiline: true,
        consistent: true,
      },
      ObjectExpression: {
        minProperties: 5,
        multiline: true,
        consistent: true,
      },
      ObjectPattern: {
        minProperties: 5,
        multiline: true,
        consistent: true,
      },
    },
  ],
  '@stylistic/object-curly-spacing': ['error', 'always'],
  '@stylistic/object-property-newline': [
    'error',
    {
      allowAllPropertiesOnSameLine: true,
    },
  ],
  '@stylistic/one-var-declaration-per-line': ['error', 'always'],
  '@stylistic/operator-linebreak': [
    'error',
    'before',
    {
      overrides: {
        '=': 'none',
      },
    },
  ],
  '@stylistic/padded-blocks': ['error', 'never'],
  '@stylistic/quote-props': ['error', 'as-needed'],
  '@stylistic/quotes': [
    'error',
    'single',
    {
      avoidEscape: true,
      allowTemplateLiterals: 'never',
    },
  ],
  '@stylistic/rest-spread-spacing': ['error', 'never'],
  '@stylistic/semi': [
    'error',
    'never',
    {
      beforeStatementContinuationChars: 'always',
    },
  ],
  '@stylistic/semi-spacing': [
    'error',
    {
      before: false,
      after: true,
    },
  ],
  '@stylistic/semi-style': ['error', 'first'],
  '@stylistic/space-before-blocks': 'error',
  '@stylistic/space-before-function-paren': ['error', 'always'],
  '@stylistic/space-in-parens': ['error', 'never'],
  '@stylistic/space-infix-ops': 'error',
  '@stylistic/space-unary-ops': [
    'error',
    {
      words: true,
      nonwords: false,
    },
  ],
  '@stylistic/spaced-comment': [
    'error',
    'always',
    {
      line: {
        exceptions: [],
        markers: ['/'],
      },
      block: {
        exceptions: [],
        markers: ['*', '**'],
        balanced: true,
      },
    },
  ],
  '@stylistic/switch-colon-spacing': [
    'error',
    {
      before: false,
      after: true,
    },
  ],
  '@stylistic/template-curly-spacing': ['error', 'never'],
  '@stylistic/template-tag-spacing': ['error', 'never'],
  '@stylistic/wrap-iife': [
    'error',
    'outside',
    {
      functionPrototypeMethods: false,
    },
  ],
  '@stylistic/yield-star-spacing': ['error', 'both'],
}
