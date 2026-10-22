module.exports = {
  'react/button-has-type': [
    'error',
    {
      button: true,
      submit: true,
      reset: false,
    },
  ],
  'react/default-props-match-prop-types': [
    'error',
    {
      allowRequiredDefaults: false,
    },
  ],
  'react/forbid-foreign-prop-types': [
    'warn',
    {
      allowInPropTypes: true,
    },
  ],
  'react/function-component-definition': [
    'error',
    {
      namedComponents: 'function-declaration',
      unnamedComponents: 'arrow-function',
    },
  ],
  'react/jsx-boolean-value': ['error', 'never'],
  'react/jsx-closing-bracket-location': ['error', 'after-props'],
  'react/jsx-closing-tag-location': 'error',
  'react/jsx-curly-brace-presence': [
    'error',
    {
      props: 'never',
      children: 'ignore',
    },
  ],
  'react/jsx-curly-newline': [
    'error',
    {
      multiline: 'require',
      singleline: 'forbid',
    },
  ],
  'react/jsx-curly-spacing': [
    'error',
    {
      when: 'never',
      children: true,
      allowMultiline: true,
    },
  ],
  'react/jsx-equals-spacing': ['error', 'never'],
  'react/jsx-filename-extension': [
    'error',
    {
      extensions: ['.js', '.cjs', '.mjs', '.ts', '.jsx', '.tsx'],
    },
  ],
  'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
  'react/jsx-fragments': ['error', 'syntax'],
  'react/jsx-handler-names': [
    'error',
    {
      eventHandlerPrefix: '(_|#)?(handle|on)',
      eventHandlerPropPrefix: 'on',
      checkLocalVariables: true,
    },
  ],
  'react/jsx-indent': [
    'error',
    2,
    {
      checkAttributes: false,
      indentLogicalExpressions: true,
    },
  ],
  'react/jsx-indent-props': ['error', 2],
  'react/jsx-key': [
    'error',
    {
      checkFragmentShorthand: true,
      checkKeyMustBeforeSpread: true,
      warnOnDuplicates: false,
    },
  ],
  'react/jsx-max-props-per-line': [
    'error',
    {
      maximum: {
        single: 5,
        multi: 1,
      },
    },
  ],
  'react/jsx-no-bind': [
    'error',
    {
      ignoreDOMComponents: false,
      ignoreRefs: false,
      allowArrowFunctions: true,
      allowFunctions: false,
      allowBind: false,
    },
  ],
  'react/jsx-no-comment-textnodes': 'error',
  'react/jsx-no-constructed-context-values': 'error',
  'react/jsx-no-duplicate-props': [
    'error',
    {
      ignoreCase: true,
    },
  ],
  'react/jsx-no-literals': 'error',
  'react/jsx-no-script-url': 'error',
  'react/jsx-no-target-blank': [
    'error',
    {
      allowReferrer: false,
      enforceDynamicLinks: 'always',
      warnOnSpreadAttributes: false,
      links: true,
      forms: true,
    },
  ],
  'react/jsx-no-undef': 'error',
  'react/jsx-no-useless-fragment': 'error',
  'react/jsx-pascal-case': [
    'error',
    {
      allowAllCaps: false,
      allowLeadingUnderscore: false,
      allowNamespace: true,
      ignore: [],
    },
  ],
  'react/jsx-props-no-multi-spaces': 'error',
  'react/jsx-sort-props': [
    'error',
    {
      callbacksLast: true,
      shorthandFirst: true,
      shorthandLast: false,
      ignoreCase: true,
      noSortAlphabetically: false,
      reservedFirst: true,
      multiline: 'ignore',
      locale: 'auto',
    },
  ],
  'react/jsx-tag-spacing': [
    'error',
    {
      closingSlash: 'never',
      beforeSelfClosing: 'always',
      afterOpening: 'never',
      beforeClosing: 'never',
    },
  ],
  'react/jsx-uses-vars': 'error',
  'react/jsx-wrap-multilines': [
    'error',
    {
      declaration: 'parens-new-line',
      assignment: 'parens-new-line',
      return: 'parens-new-line',
      arrow: 'parens-new-line',
      condition: 'parens-new-line',
      logical: 'parens-new-line',
      prop: 'parens-new-line',
    },
  ],
  'react/no-access-state-in-setstate': 'error',
  'react/no-array-index-key': 'error',
  'react/no-children-prop': [
    'error',
    {
      allowFunctions: false,
    },
  ],
  'react/no-danger': 'error',
  'react/no-danger-with-children': 'error',
  'react/no-deprecated': 'warn',
  'react/no-did-update-set-state': 'error',
  'react/no-direct-mutation-state': 'error',
  'react/no-find-dom-node': 'error',
  'react/no-is-mounted': 'error',
  'react/no-namespace': 'error',
  'react/no-redundant-should-component-update': 'error',
  'react/no-render-return-value': 'error',
  'react/no-string-refs': [
    'error',
    {
      noTemplateLiterals: true,
    },
  ],
  'react/no-this-in-sfc': 'error',
  'react/no-typos': 'error',
  'react/no-unknown-property': 'error',
  'react/no-unsafe': 'error',
  'react/no-unstable-nested-components': 'error',
  'react/no-unused-prop-types': [
    'error',
    {
      customValidators: [],
      skipShapeProps: true,
    },
  ],
  'react/no-unused-state': 'error',
  'react/no-will-update-set-state': 'error',
  'react/prefer-es6-class': ['error', 'always'],
  'react/prefer-read-only-props': 'error',
  'react/prefer-stateless-function': [
    'error',
    {
      ignorePureComponents: true,
    },
  ],
  'react/prop-types': [
    'error',
    {
      ignore: [],
      customValidators: [],
      skipUndeclared: true,
    },
  ],
  'react/require-render-return': 'error',
  'react/self-closing-comp': 'error',
  'react/sort-prop-types': [
    'error',
    {
      ignoreCase: true,
      callbacksLast: false,
      requiredFirst: false,
      sortShapeProp: true,
    },
  ],
  'react/state-in-constructor': ['error', 'never'],
  'react/static-property-placement': ['error', 'static public field'],
  'react/style-prop-object': 'error',
  'react/void-dom-elements-no-children': 'error',
}
