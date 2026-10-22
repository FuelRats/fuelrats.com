// Limits
const MAX_DEPTH = 6
const MAX_LINES = 999
const MAX_NESTED_CALLBACKS = 5
const MAX_PARAMS = 5
const MAX_STATEMENTS = 50


module.exports = {
  'accessor-pairs': [
    'error',
    {
      enforceForClassMembers: true,
      getWithoutSet: false,
      setWithoutGet: true,
    },
  ],
  'array-callback-return': [
    'error',
    {
      allowImplicit: false,
      checkForEach: false,
      allowVoid: false,
    },
  ],
  'arrow-body-style': ['error', 'always'],
  'block-scoped-var': 'error',
  camelcase: [
    'error',
    {
      properties: 'never',
      ignoreGlobals: true,
      ignoreDestructuring: false,
      allow: ['^UNSAFE_', '^unstable_'],
      ignoreImports: false,
    },
  ],
  'consistent-return': 'error',
  'consistent-this': ['error', 'self'],
  'constructor-super': 'error',
  curly: ['error', 'all'],
  'default-case': [
    'error',
    {
      commentPattern: '^I have no idea what I\'m doing$',
    },
  ],
  'default-case-last': 'error',
  'dot-notation': 'error',
  eqeqeq: [
    'error',
    'always',
    {
      null: 'always',
    },
  ],
  'for-direction': 'error',
  'func-name-matching': [
    'error',
    'always',
    {
      considerPropertyDescriptor: true,
      includeCommonJSModuleExports: true,
    },
  ],
  'func-names': [
    'error',
    'always',
    {
      generators: 'always',
    },
  ],
  'func-style': [
    'error',
    'declaration',
    {
      allowArrowFunctions: true,
    },
  ],
  'getter-return': 'error',
  'guard-for-in': 'error',
  'id-length': [
    'error',
    {
      min: 2,
      max: 35,
      exceptions: ['_'],
    },
  ],
  'init-declarations': ['error', 'always'],
  'max-depth': ['error', MAX_DEPTH],
  'max-lines': ['error', MAX_LINES],
  'max-nested-callbacks': ['error', MAX_NESTED_CALLBACKS],
  'max-params': ['error', MAX_PARAMS],
  'max-statements': ['error', MAX_STATEMENTS],
  'no-alert': 'error',
  'no-array-constructor': 'error',
  'no-async-promise-executor': 'error',
  'no-await-in-loop': 'error',
  'no-bitwise': 'error',
  'no-caller': 'error',
  'no-case-declarations': 'error',
  'no-class-assign': 'error',
  'no-compare-neg-zero': 'error',
  'no-cond-assign': ['error', 'always'],
  'no-console': [
    'warn',
    {
      allow: ['error', 'warn'],
    },
  ],
  'no-const-assign': 'error',
  'no-constant-condition': [
    'error',
    {
      checkLoops: 'all',
    },
  ],
  'no-constructor-return': 'error',
  'no-continue': 'error',
  'no-control-regex': 'error',
  'no-debugger': 'error',
  'no-delete-var': 'error',
  'no-dupe-args': 'error',
  'no-dupe-class-members': 'error',
  'no-dupe-else-if': 'error',
  'no-dupe-keys': 'error',
  'no-duplicate-case': 'error',
  'no-duplicate-imports': 'error',
  'no-else-return': [
    'error',
    {
      allowElseIf: false,
    },
  ],
  'no-empty': 'error',
  'no-empty-character-class': 'error',
  'no-empty-function': [
    'error',
    {
      allow: ['arrowFunctions'],
    },
  ],
  'no-empty-pattern': 'error',
  'no-eq-null': 'error',
  'no-eval': 'error',
  'no-ex-assign': 'error',
  'no-extend-native': 'error',
  'no-extra-bind': 'error',
  'no-extra-boolean-cast': 'error',
  'no-extra-label': 'error',
  'no-fallthrough': 'error',
  'no-func-assign': 'error',
  'no-global-assign': 'error',
  'no-implicit-coercion': [
    'error',
    {
      disallowTemplateShorthand: true,
      boolean: true,
      number: true,
      string: true,
    },
  ],
  'no-implicit-globals': 'error',
  'no-implied-eval': 'error',
  'no-import-assign': 'error',
  'no-inner-declarations': [
    'error',
    'functions',
    {
      blockScopedFunctions: 'disallow',
    },
  ],
  'no-invalid-regexp': 'error',
  'no-invalid-this': 'error',
  'no-irregular-whitespace': 'error',
  'no-iterator': 'error',
  'no-label-var': 'error',
  'no-labels': 'error',
  'no-lone-blocks': 'error',
  'no-lonely-if': 'error',
  'no-loop-func': 'error',
  'no-loss-of-precision': 'error',
  'no-magic-numbers': [
    'error',
    {
      ignore: [-1, 0, 1, 2, 24, 60, 100, 1000],
      enforceConst: true,
      ignoreDefaultValues: true,
      detectObjects: false,
      ignoreArrayIndexes: false,
      ignoreClassFieldInitialValues: false,
    },
  ],
  'no-misleading-character-class': 'error',
  'no-multi-assign': 'error',
  'no-multi-str': 'error',
  'no-negated-condition': 'error',
  'no-nested-ternary': 'error',
  'no-new': 'error',
  'no-new-func': 'error',
  'no-new-native-nonconstructor': 'error',
  'no-new-wrappers': 'error',
  'no-nonoctal-decimal-escape': 'error',
  'no-obj-calls': 'error',
  'no-object-constructor': 'error',
  'no-octal': 'error',
  'no-octal-escape': 'error',
  'no-param-reassign': [
    'error',
    {
      props: true,
      ignorePropertyModificationsForRegex: [
        '^acc(umulator)?',
        '^desc(riptor)?',
        '^req(uest)?',
        '^res(ponse)?',
        '^draft(State)?',
      ],
      ignorePropertyModificationsFor: ['Component', 'connection', 'ctx', 'target', 'client', 'event'],
    },
  ],
  'no-plusplus': 'error',
  'no-promise-executor-return': 'error',
  'no-proto': 'error',
  'no-prototype-builtins': 'error',
  'no-redeclare': 'error',
  'no-regex-spaces': 'error',
  'no-restricted-globals': [
    'error',
    {
      name: 'isFinite',
      message: 'Global `isFinite` is a flawed implementation. Use `Number.isFinite()` instead.',
    },
    {
      name: 'isNaN',
      message: 'Global `isNaN` is a flawed implementation. Use `Number.isNaN()` instead.',
    },
    {
      name: 'addEventListener',
      message: 'Use of `addEventListener` is confusing. Use `window.addEventListener` instead.',
    },
    {
      name: 'blur',
      message: 'Use of `blur` is confusing. Use `window.blur` instead.',
    },
    {
      name: 'close',
      message: 'Use of `close` is confusing. Use `window.close` instead.',
    },
    {
      name: 'closed',
      message: 'Use of `closed` is confusing. Use `window.closed` instead.',
    },
    {
      name: 'confirm',
      message: 'Use of `confirm` is confusing. Use `window.confirm` instead.',
    },
    {
      name: 'defaultStatus',
      message: 'Use of `defaultStatus` is confusing. Use `window.defaultStatus` instead.',
    },
    {
      name: 'defaultstatus',
      message: 'Use of `defaultstatus` is confusing. Use `window.defaultstatus` instead.',
    },
    {
      name: 'event',
      message: 'Use of `event` is confusing. Use `window.event` instead.',
    },
    {
      name: 'external',
      message: 'Use of `external` is confusing. Use `window.external` instead.',
    },
    {
      name: 'find',
      message: 'Use of `find` is confusing. Use `window.find` instead.',
    },
    {
      name: 'focus',
      message: 'Use of `focus` is confusing. Use `window.focus` instead.',
    },
    {
      name: 'frameElement',
      message: 'Use of `frameElement` is confusing. Use `window.frameElement` instead.',
    },
    {
      name: 'frames',
      message: 'Use of `frames` is confusing. Use `window.frames` instead.',
    },
    {
      name: 'history',
      message: 'Use of `history` is confusing. Use `window.history` instead.',
    },
    {
      name: 'innerHeight',
      message: 'Use of `innerHeight` is confusing. Use `window.innerHeight` instead.',
    },
    {
      name: 'innerWidth',
      message: 'Use of `innerWidth` is confusing. Use `window.innerWidth` instead.',
    },
    {
      name: 'length',
      message: 'Use of `length` is confusing. Use `window.length` instead.',
    },
    {
      name: 'locationbar',
      message: 'Use of `locationbar` is confusing. Use `window.locationbar` instead.',
    },
    {
      name: 'menubar',
      message: 'Use of `menubar` is confusing. Use `window.menubar` instead.',
    },
    {
      name: 'moveBy',
      message: 'Use of `moveBy` is confusing. Use `window.moveBy` instead.',
    },
    {
      name: 'moveTo',
      message: 'Use of `moveTo` is confusing. Use `window.moveTo` instead.',
    },
    {
      name: 'name',
      message: 'Use of `name` is confusing. Use `window.name` instead.',
    },
    {
      name: 'onblur',
      message: 'Use of `onblur` is confusing. Use `window.onblur` instead.',
    },
    {
      name: 'onerror',
      message: 'Use of `onerror` is confusing. Use `window.onerror` instead.',
    },
    {
      name: 'onfocus',
      message: 'Use of `onfocus` is confusing. Use `window.onfocus` instead.',
    },
    {
      name: 'onload',
      message: 'Use of `onload` is confusing. Use `window.onload` instead.',
    },
    {
      name: 'onresize',
      message: 'Use of `onresize` is confusing. Use `window.onresize` instead.',
    },
    {
      name: 'onunload',
      message: 'Use of `onunload` is confusing. Use `window.onunload` instead.',
    },
    {
      name: 'open',
      message: 'Use of `open` is confusing. Use `window.open` instead.',
    },
    {
      name: 'opener',
      message: 'Use of `opener` is confusing. Use `window.opener` instead.',
    },
    {
      name: 'opera',
      message: 'opera is a nonstandard browser global, and should not be used.',
    },
    {
      name: 'outerHeight',
      message: 'Use of `outerHeight` is confusing. Use `window.outerHeight` instead.',
    },
    {
      name: 'outerWidth',
      message: 'Use of `outerWidth` is confusing. Use `window.outerWidth` instead.',
    },
    {
      name: 'pageXOffset',
      message: 'Use of `pageXOffset` is confusing. Use `window.pageXOffset` instead.',
    },
    {
      name: 'pageYOffset',
      message: 'Use of `pageYOffset` is confusing. Use `window.pageYOffset` instead.',
    },
    {
      name: 'parent',
      message: 'Use of `parent` is confusing. Use `window.parent` instead.',
    },
    {
      name: 'print',
      message: 'Use of `print` is confusing. Use `window.print` instead.',
    },
    {
      name: 'removeEventListener',
      message: 'Use of `removeEventListener` is confusing. Use `window.removeEventListener` instead.',
    },
    {
      name: 'resizeBy',
      message: 'Use of `resizeBy` is confusing. Use `window.resizeBy` instead.',
    },
    {
      name: 'resizeTo',
      message: 'Use of `resizeTo` is confusing. Use `window.resizeTo` instead.',
    },
    {
      name: 'screen',
      message: 'Use of `screen` is confusing. Use `window.screen` instead.',
    },
    {
      name: 'screenLeft',
      message: 'Use of `screenLeft` is confusing. Use `window.screenLeft` instead.',
    },
    {
      name: 'screenTop',
      message: 'Use of `screenTop` is confusing. Use `window.screenTop` instead.',
    },
    {
      name: 'screenX',
      message: 'Use of `screenX` is confusing. Use `window.screenX` instead.',
    },
    {
      name: 'screenY',
      message: 'Use of `screenY` is confusing. Use `window.screenY` instead.',
    },
    {
      name: 'scroll',
      message: 'Use of `scroll` is confusing. Use `window.scroll` instead.',
    },
    {
      name: 'scrollbars',
      message: 'Use of `scrollbars` is confusing. Use `window.scrollbars` instead.',
    },
    {
      name: 'scrollBy',
      message: 'Use of `scrollBy` is confusing. Use `window.scrollBy` instead.',
    },
    {
      name: 'scrollTo',
      message: 'Use of `scrollTo` is confusing. Use `window.scrollTo` instead.',
    },
    {
      name: 'scrollX',
      message: 'Use of `scrollX` is confusing. Use `window.scrollX` instead.',
    },
    {
      name: 'scrollY',
      message: 'Use of `scrollY` is confusing. Use `window.scrollY` instead.',
    },
    {
      name: 'status',
      message: 'Use of `status` is confusing. Use `window.status` instead.',
    },
    {
      name: 'statusbar',
      message: 'Use of `statusbar` is confusing. Use `window.statusbar` instead.',
    },
    {
      name: 'stop',
      message: 'Use of `stop` is confusing. Use `window.stop` instead.',
    },
    {
      name: 'toolbar',
      message: 'Use of `toolbar` is confusing. Use `window.toolbar` instead.',
    },
    {
      name: 'top',
      message: 'Use of `top` is confusing. Use `window.top` instead.',
    },
  ],
  'no-restricted-syntax': [
    'error',
    {
      selector: 'ForStatement',
      message: 'C-Style for loops are discouraged. Use array iteration (`arr.{forEach,map,reduce}`), a for-of loop, or a while loop instead.',
    },
    {
      selector: 'ForInStatement',
      message: '`for...in` loops iterate over the entire prototype chain, which may lead to unexpected behavior. '
        + 'Use array iteration (`arr.{forEach,map,reduce}`), a for...of loop, or a while loop instead.',
    },
    {
      selector: 'WithStatement',
      message: 'The `with` statement is forbidden in strict mode.',
    },
    {
      selector: 'LabeledStatement',
      message: 'Labeled statements are discouraged. They break the control flow of the program which makes code difficult to understand.',
    },
    {
      selector: 'BinaryExpression[operator=\'in\']',
      message: 'The `in` operator is discouraged because it is often the cause of unexpected behavior. Use `obj.isOwnProperty(value)` or `Reflect.has(obj, value)` instead.',
    },
  ],
  'no-return-assign': ['error', 'always'],
  'no-return-await': 'error',
  'no-script-url': 'error',
  'no-self-assign': [
    'error',
    {
      props: true,
    },
  ],
  'no-self-compare': 'error',
  'no-sequences': [
    'error',
    {
      allowInParentheses: false,
    },
  ],
  'no-setter-return': 'error',
  'no-shadow': 'error',
  'no-shadow-restricted-names': 'error',
  'no-sparse-arrays': 'error',
  'no-template-curly-in-string': 'error',
  'no-this-before-super': 'error',
  'no-throw-literal': 'error',
  'no-undef': [
    'error',
    {
      typeof: true,
    },
  ],
  'no-unexpected-multiline': 'error',
  'no-unmodified-loop-condition': 'error',
  'no-unneeded-ternary': [
    'error',
    {
      defaultAssignment: false,
    },
  ],
  'no-unreachable': 'error',
  'no-unreachable-loop': 'error',
  'no-unsafe-finally': 'error',
  'no-unsafe-negation': [
    'error',
    {
      enforceForOrderingRelations: true,
    },
  ],
  'no-unsafe-optional-chaining': [
    'error',
    {
      disallowArithmeticOperators: true,
    },
  ],
  'no-unused-labels': 'error',
  'no-unused-vars': [
    'error',
    {
      vars: 'all',
      args: 'after-used',
      caughtErrors: 'none',
      ignoreRestSiblings: true,
    },
  ],
  'no-use-before-define': [
    'error',
    {
      functions: false,
      classes: false,
      variables: true,
    },
  ],
  'no-useless-backreference': 'error',
  'no-useless-call': 'error',
  'no-useless-catch': 'error',
  'no-useless-computed-key': 'error',
  'no-useless-concat': 'error',
  'no-useless-constructor': 'error',
  'no-useless-rename': [
    'error',
    {
      ignoreDestructuring: false,
      ignoreImport: false,
      ignoreExport: false,
    },
  ],
  'no-useless-return': 'error',
  'no-var': 'error',
  'no-void': [
    'error',
    {
      allowAsStatement: true,
    },
  ],
  'no-warning-comments': [
    'warn',
    {
      terms: ['todo', 'fixme'],
      location: 'start',
    },
  ],
  'no-with': 'error',
  'object-shorthand': [
    'error',
    'always',
    {
      avoidQuotes: true,
      ignoreConstructors: false,
      avoidExplicitReturnArrows: false,
    },
  ],
  'one-var': ['error', 'never'],
  'operator-assignment': ['error', 'always'],
  'prefer-arrow-callback': [
    'error',
    {
      allowNamedFunctions: false,
      allowUnboundThis: false,
    },
  ],
  'prefer-const': [
    'error',
    {
      destructuring: 'all',
      ignoreReadBeforeAssign: true,
    },
  ],
  'prefer-destructuring': [
    'error',
    {
      VariableDeclarator: {
        array: true,
        object: true,
      },
      AssignmentExpression: {
        array: false,
        object: false,
      },
    },
    {
      enforceForRenamedProperties: false,
    },
  ],
  'prefer-exponentiation-operator': 'error',
  'prefer-numeric-literals': 'error',
  'prefer-object-spread': 'error',
  'prefer-promise-reject-errors': [
    'error',
    {
      allowEmptyReject: false,
    },
  ],
  'prefer-regex-literals': 'error',
  'prefer-rest-params': 'error',
  'prefer-spread': 'error',
  'prefer-template': 'error',
  radix: 'error',
  'require-await': 'error',
  'require-unicode-regexp': 'error',
  'require-yield': 'error',
  'symbol-description': 'error',
  'unicode-bom': ['error', 'never'],
  'use-isnan': [
    'error',
    {
      enforceForSwitchCase: true,
      enforceForIndexOf: true,
    },
  ],
  'valid-typeof': 'error',
  'vars-on-top': 'error',
  yoda: 'error',
}
