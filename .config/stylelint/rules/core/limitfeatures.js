const {
  camelCasePattern,
  kebabCasePattern,
  pascalCasePattern,
} = require('../../patterns')



module.exports = {
  rules: {
    // ====================================================
    // Alpha-value
    // ====================================================

    // Specify percentage or number notation for alpha-values (Autofixable).
    'alpha-value-notation': 'number',





    // ====================================================
    // Hue
    // ====================================================

    // Specify number or angle notation for degree hues (Autofixable).
    'hue-degree-notation': 'angle',





    // ====================================================
    // Color
    // ====================================================

    // Specify modern or legacy notation for applicable color-functions (Autofixable).
    // MAJOR: 'modern'
    'color-function-notation': null,

    // Require (where possible) or disallow named colors.
    'color-named': 'never',

    // Disallow hex colors.
    // MAJOR: true
    'color-no-hex': null,





    // ====================================================
    // Length
    // ====================================================

    // Disallow units for zero lengths (Autofixable).
    'length-zero-no-unit': true,





    // ====================================================
    // Font weight
    // ====================================================

    // Require numeric or named (where possible) font-weight values. Also, when named values are expected, require only valid names.
    'font-weight-notation': 'named-where-possible',





    // ====================================================
    // Function
    // ====================================================

    // Specify a list of allowed functions.
    'function-allowed-list': null,

    // Specify a list of disallowed functions.
    'function-disallowed-list': null,

    // Disallow scheme-relative urls.
    'function-url-no-scheme-relative': true,

    // Specify a list of allowed URL schemes.
    'function-url-scheme-allowed-list': ['data', 'blob', 'https'],

    // Specify a list of disallowed URL schemes.
    'function-url-scheme-disallowed-list': null,





    // ====================================================
    // Keyframes
    // ====================================================

    // Specify a pattern for keyframe names.
    'keyframes-name-pattern': kebabCasePattern,





    // ====================================================
    // Number
    // ====================================================

    // Limit the number of decimal places allowed in numbers.
    'number-max-precision': 4,



    // ====================================================
    // Time
    // ====================================================

    // Specify the minimum number of milliseconds for time values.
    'time-min-milliseconds': null,





    // ====================================================
    // Unit
    // ====================================================

    // Specify a list of allowed units.
    'unit-allowed-list': [
      'px', // Pixels
      'em', // Size relative to element font-size
      'rem', // Size relative to root element font-size
      'vw', // % of View Width
      'vh', // % of View Height
      'vmin', // % of View width or height, whichever is smaller
      'vmax', // % of View width or height, whichever is larger
      '%', // Percent
      's', // Seconds
      'fr', // Fractional
      'deg', // Degrees
    ],

    // Specify a list of disallowed units.
    'unit-disallowed-list': null,





    // ====================================================
    // Shorthand Property
    // ====================================================

    // Disallow redundant values in shorthand properties (Autofixable).
    'shorthand-property-no-redundant-values': true,





    // ====================================================
    // Value
    // ====================================================
    // Disallow vendor prefixes for values.
    'value-no-vendor-prefix': true,





    // ====================================================
    // Custom Property
    // ====================================================

    // Specify a pattern for custom properties.
    'custom-property-pattern': kebabCasePattern,





    // ====================================================
    // Property
    // ====================================================

    // Specify a list of allowed properties.
    'property-allowed-list': null,

    // Specify a list of disallowed properties.
    'property-disallowed-list': null,

    // Disallow vendor prefixes for properties (which are supported by AutoPrefixer).
    'property-no-vendor-prefix': true,





    // ====================================================
    // Declaration
    // ====================================================

    // Disallow longhand properties that can be combined into one shorthand property.
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: [/flex-/u],
      },
    ],

    // Disallow !important within declarations.
    'declaration-no-important': true,

    // Specify a list of allowed property and unit pairs within declarations.
    'declaration-property-unit-allowed-list': null,

    // Specify a list of disallowed property and unit pairs within declarations.
    'declaration-property-unit-disallowed-list': null,

    // Specify a list of allowed property and value pairs within declarations.
    'declaration-property-value-allowed-list': null,

    // Specify a list of disallowed property and value pairs within declarations.
    'declaration-property-value-disallowed-list': null,





    // ====================================================
    // Declaration Block
    // ====================================================

    // Limit the number of declarations within a single-line declaration block.
    'declaration-block-single-line-max-declarations': 1,





    // ====================================================
    // Selector
    // ====================================================

    // Specify a list of disallowed attribute names.
    'selector-attribute-name-disallowed-list': ['class', 'id'],

    // Specify a list of allowed attribute operators.
    'selector-attribute-operator-allowed-list': null,

    // Specify a list of disallowed attribute operators.
    'selector-attribute-operator-disallowed-list': null,

    // Specify a pattern for class selectors.
    'selector-class-pattern': camelCasePattern,

    // Specify a list of allowed combinators.
    'selector-combinator-allowed-list': null,

    // Specify a list of disallowed combinators.
    'selector-combinator-disallowed-list': null,

    // Specify a pattern for ID selectors.
    'selector-id-pattern': pascalCasePattern,

    // Limit the number of attribute selectors in a selector.
    'selector-max-attribute': null,

    // Limit the number of classes in a selector.
    'selector-max-class': null,

    // Limit the number of combinators in a selector.
    'selector-max-combinators': null,

    // Limit the number of compound selectors in a selector.
    'selector-max-compound-selectors': null,

    // Limit the number of adjacent empty lines within selectors (Autofixable).
    '@stylistic/selector-max-empty-lines': 0,

    // Limit the number of ID selectors in a selector.
    'selector-max-id': null,

    // Limit the number of pseudo-classes in a selector.
    'selector-max-pseudo-class': null,

    // Limit the specificity of selectors.
    'selector-max-specificity': null,

    // Limit the number of type in a selector.
    'selector-max-type': null,

    // Limit the number of universal selectors in a selector.
    'selector-max-universal': null,

    // Specify a pattern for the selectors of rules nested within rules.
    'selector-nested-pattern': null,

    // Disallow qualifying a selector by type.
    'selector-no-qualifying-type': null,

    // Disallow vendor prefixes for selectors (which are supported by AutoPrefixer).
    'selector-no-vendor-prefix': true,

    // Specify a list of allowed pseudo-class selectors.
    'selector-pseudo-class-allowed-list': null,

    // Specify a list of disallowed pseudo-class selectors.
    'selector-pseudo-class-disallowed-list': null,

    // Specify a list of allowed pseudo-element selectors.
    'selector-pseudo-element-allowed-list': null,

    // Specify a list of disallowed pseudo-element selectors.
    'selector-pseudo-element-disallowed-list': null,





    // ====================================================
    // Media Feature
    // ====================================================

    // Specify a list of allowed media feature names.
    'media-feature-name-allowed-list': null,

    // Specify a list of disallowed media feature names.
    'media-feature-name-disallowed-list': null,

    // Disallow vendor prefixes for media feature names.
    'media-feature-name-no-vendor-prefix': null,

    // Specify a list of allowed media feature name and value pairs.
    'media-feature-name-value-allowed-list': null,


    // ====================================================
    // Custom Media
    // ====================================================

    // Specify a pattern for custom media query names.
    'custom-media-pattern': kebabCasePattern,



    // ====================================================
    // At-rule
    // ====================================================

    // Specify a list of allowed at-rules.
    'at-rule-allowed-list': null,

    // Specify a list of disallowed at-rules.
    'at-rule-disallowed-list': null,

    // Specify a requirelist of properties for an at-rule.
    // Disabled until bugs are fixed.
    /* 'at-rule-property-required-list': {
      'font-face': [
        'font-display',
        'font-family',
        'font-style',
        'font-weight',
        'src',
      ],
      keyframes: [
        'from',
        'to',
      ],
    }, */

    // Disallow vendor prefixes for at-rules.
    'at-rule-no-vendor-prefix': true,





    // ====================================================
    // Comment
    // ====================================================

    // Specify a pattern for comments.
    'comment-pattern': null,

    // Specify a list of disallowed words within comments.
    'comment-word-disallowed-list': null,





    // ====================================================
    // General / Sheet
    // ====================================================

    // Limit the depth of nesting.
    'max-nesting-depth': null,

    // Disallow unknown animations.
    'no-unknown-animations': null,
  },
}
