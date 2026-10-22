module.exports = {
  rules: {
    // ====================================================
    // Color
    // ====================================================

    // Specify lowercase or uppercase for hex colors (Autofixable).
    // MAJOR: null
    '@stylistic/color-hex-case': 'upper',

    // Specify short or long notation for hex colors (Autofixable).
    // MAJOR: null
    'color-hex-length': 'long',





    // ====================================================
    // Font family
    // ====================================================

    // Specify whether or not quotation marks should be used around font family names.
    'font-family-name-quotes': 'always-where-recommended',





    // ====================================================
    // Function
    // ====================================================

    // Require a newline or disallow whitespace after the commas of functions (Autofixable).
    '@stylistic/function-comma-newline-after': 'always-multi-line',

    // Require a newline or disallow whitespace before the commas of functions (Autofixable).
    '@stylistic/function-comma-newline-before': null,

    // Require a single space or disallow whitespace after the commas of functions (Autofixable).
    '@stylistic/function-comma-space-after': 'always-single-line',

    // Require a single space or disallow whitespace before the commas of functions (Autofixable).
    '@stylistic/function-comma-space-before': 'never',

    // Limit the number of adjacent empty lines within functions (Autofixable).
    '@stylistic/function-max-empty-lines': 0,

    // Specify lowercase or uppercase for function names (Autofixable).
    'function-name-case': 'lower',

    // Require a newline or disallow whitespace on the inside of the parentheses of functions (Autofixable).
    '@stylistic/function-parentheses-newline-inside': 'always-multi-line',

    // Require a single space or disallow whitespace on the inside of the parentheses of functions (Autofixable).
    '@stylistic/function-parentheses-space-inside': 'never-single-line',

    // Require or disallow quotes for urls.
    'function-url-quotes': 'always',

    // Require or disallow whitespace after functions (Autofixable).
    '@stylistic/function-whitespace-after': 'always',





    // ====================================================
    // Number
    // ====================================================

    // Require or disallow a leading zero for fractional numbers less than 1 (Autofixable).
    '@stylistic/number-leading-zero': 'always',

    // Disallow trailing zeros in numbers (Autofixable).
    '@stylistic/number-no-trailing-zeros': true,





    // ====================================================
    // String
    // ====================================================

    // Specify single or double quotes around strings (Autofixable).
    '@stylistic/string-quotes': 'single',





    // ====================================================
    // Unit
    // ====================================================

    // Specify lowercase or uppercase for units (Autofixable).
    '@stylistic/unit-case': 'lower',





    // ====================================================
    // Value
    // ====================================================

    // Specify lowercase or uppercase for keywords values (Autofixable).
    // MAJOR: (move ignoreProperties)
    'value-keyword-case': ['lower', {
      ignoreProperties: [
        'composes',
      ],
    }],





    // ====================================================
    // Value list
    // ====================================================

    // Require a newline or disallow whitespace after the commas of value lists (Autofixable).
    '@stylistic/value-list-comma-newline-after': 'always-multi-line',

    // Require a newline or disallow whitespace before the commas of value lists.
    '@stylistic/value-list-comma-newline-before': 'never-multi-line',

    // Require a single space or disallow whitespace after the commas of value lists (Autofixable).
    '@stylistic/value-list-comma-space-after': 'always-single-line',

    // Require a single space or disallow whitespace before the commas of value lists (Autofixable).
    '@stylistic/value-list-comma-space-before': 'never',

    // Limit the number of adjacent empty lines within value lists (Autofixable).
    '@stylistic/value-list-max-empty-lines': 0,


    // ====================================================
    // Custom property
    // ====================================================

    // Require or disallow an empty line before custom properties (Autofixable).
    'custom-property-empty-line-before': 'never',





    // ====================================================
    // Property
    // ====================================================

    // Specify lowercase or uppercase for properties (Autofixable).
    '@stylistic/property-case': 'lower',





    // ====================================================
    // Declaration
    // ====================================================

    // Require a single space or disallow whitespace after the bang of declarations (Autofixable).
    '@stylistic/declaration-bang-space-after': 'never',

    // Require a single space or disallow whitespace before the bang of declarations (Autofixable).
    '@stylistic/declaration-bang-space-before': 'always',

    // Require a newline or disallow whitespace after the colon of declarations (Autofixable).
    '@stylistic/declaration-colon-newline-after': 'always-multi-line',

    // Require a single space or disallow whitespace after the colon of declarations (Autofixable).
    '@stylistic/declaration-colon-space-after': 'always-single-line',

    // Require a single space or disallow whitespace before the colon of declarations (Autofixable).
    '@stylistic/declaration-colon-space-before': 'never',

    // Require or disallow an empty line before declarations (Autofixable).
    'declaration-empty-line-before': null,





    // ====================================================
    // Declaration block
    // ====================================================

    // Require a newline or disallow whitespace after the semicolons of declaration blocks (Autofixable).
    '@stylistic/declaration-block-semicolon-newline-after': 'always',

    // Require a newline or disallow whitespace before the semicolons of declaration blocks.
    '@stylistic/declaration-block-semicolon-newline-before': 'never-multi-line',

    // Require a single space or disallow whitespace after the semicolons of declaration blocks (Autofixable).
    '@stylistic/declaration-block-semicolon-space-after': 'always-single-line',

    // Require a single space or disallow whitespace before the semicolons of declaration blocks (Autofixable).
    '@stylistic/declaration-block-semicolon-space-before': 'never',

    // Require or disallow a trailing semicolon within declaration blocks (Autofixable).
    '@stylistic/declaration-block-trailing-semicolon': 'always',





    // ====================================================
    // Block
    // ====================================================

    // Require or disallow an empty line before the closing brace of blocks (Autofixable).
    '@stylistic/block-closing-brace-empty-line-before': 'never',

    // Require a newline or disallow whitespace after the closing brace of blocks (Autofixable).
    '@stylistic/block-closing-brace-newline-after': ['always', {
      ignoreAtRules: ['if', 'else'],
    }],

    // Require a newline or disallow whitespace before the closing brace of blocks (Autofixable).
    '@stylistic/block-closing-brace-newline-before': 'always',

    // Require a single space or disallow whitespace after the closing brace of blocks.
    '@stylistic/block-closing-brace-space-after': 'always-single-line',

    // Require a single space or disallow whitespace before the closing brace of blocks (Autofixable).
    '@stylistic/block-closing-brace-space-before': 'always-single-line',

    // Require a newline after the opening brace of blocks (Autofixable).
    '@stylistic/block-opening-brace-newline-after': 'always',

    // Require a newline or disallow whitespace before the opening brace of blocks (Autofixable).
    '@stylistic/block-opening-brace-newline-before': 'never-single-line',

    // Require a single space or disallow whitespace after the opening brace of blocks (Autofixable).
    '@stylistic/block-opening-brace-space-after': 'always-single-line',

    // Require a single space or disallow whitespace before the opening brace of blocks (Autofixable).
    '@stylistic/block-opening-brace-space-before': 'always',




    // ====================================================
    // Selector
    // ====================================================

    // Require a single space or disallow whitespace on the inside of the brackets within attribute selectors (Autofixable).
    '@stylistic/selector-attribute-brackets-space-inside': 'never',

    // Require a single space or disallow whitespace after operators within attribute selectors (Autofixable).
    '@stylistic/selector-attribute-operator-space-after': 'never',

    // Require a single space or disallow whitespace before operators within attribute selectors (Autofixable).
    '@stylistic/selector-attribute-operator-space-before': 'never',

    // Require or disallow quotes for attribute values.
    'selector-attribute-quotes': 'always',

    // Require a single space or disallow whitespace after the combinators of selectors (Autofixable).
    '@stylistic/selector-combinator-space-after': 'always',

    // Require a single space or disallow whitespace before the combinators of selectors (Autofixable).
    '@stylistic/selector-combinator-space-before': 'always',

    // Disallow non-space characters for descendant combinators of selectors (Autofixable).
    '@stylistic/selector-descendant-combinator-no-non-space': true,

    // Specify lowercase or uppercase for pseudo-class selectors (Autofixable).
    '@stylistic/selector-pseudo-class-case': 'lower',

    // Require a single space or disallow whitespace on the inside of the parentheses within pseudo-class selectors (Autofixable).
    '@stylistic/selector-pseudo-class-parentheses-space-inside': 'never',

    // Specify lowercase or uppercase for pseudo-element selectors.
    '@stylistic/selector-pseudo-element-case': 'lower',

    // Specify single or double colon notation for applicable pseudo-elements (Autofixable).
    'selector-pseudo-element-colon-notation': 'double',

    // Specify lowercase or uppercase for type selectors (Autofixable).
    'selector-type-case': 'lower',





    // ====================================================
    // Selector list
    // ====================================================

    // Require a newline or disallow whitespace after the commas of selector lists (Autofixable).
    '@stylistic/selector-list-comma-newline-after': 'always',

    // Require a newline or disallow whitespace before the commas of selector lists (Autofixable).
    '@stylistic/selector-list-comma-newline-before': 'never-multi-line',

    // Require a single space or disallow whitespace after the commas of selector lists (Autofixable).
    '@stylistic/selector-list-comma-space-after': 'always-single-line',

    // Require a single space or disallow whitespace before the commas of selector lists (Autofixable).
    '@stylistic/selector-list-comma-space-before': 'never',





    // ====================================================
    // Rule
    // ====================================================

    // Require or disallow an empty line before rules (Autofixable).
    'rule-empty-line-before': ['always-multi-line', {
      except: [
        'after-single-line-comment',
        'first-nested',
      ],
    }],





    // ====================================================
    // Media feature
    // ====================================================

    // Require a single space or disallow whitespace after the colon in media features (Autofixable).
    '@stylistic/media-feature-colon-space-after': 'always',

    // Require a single space or disallow whitespace before the colon in media features (Autofixable).
    '@stylistic/media-feature-colon-space-before': 'never',

    // Specify lowercase or uppercase for media feature names (Autofixable).
    '@stylistic/media-feature-name-case': 'lower',

    // Require a single space or disallow whitespace on the inside of the parentheses within media features (Autofixable).
    '@stylistic/media-feature-parentheses-space-inside': 'never',

    // Require a single space or disallow whitespace after the range operator in media features (Autofixable).
    '@stylistic/media-feature-range-operator-space-after': 'always',

    // Require a single space or disallow whitespace before the range operator in media features (Autofixable).
    '@stylistic/media-feature-range-operator-space-before': 'always',





    // ====================================================
    // Media query list
    // ====================================================

    // Require a newline or disallow whitespace after the commas of media query lists (Autofixable).
    '@stylistic/media-query-list-comma-newline-after': 'always',

    // Require a newline or disallow whitespace before the commas of media query lists.
    '@stylistic/media-query-list-comma-newline-before': 'never-multi-line',

    // Require a single space or disallow whitespace after the commas of media query lists (Autofixable).
    '@stylistic/media-query-list-comma-space-after': 'always-single-line',

    // Require a single space or disallow whitespace before the commas of media query lists (Autofixable).
    '@stylistic/media-query-list-comma-space-before': 'never',





    // ====================================================
    // At-rule
    // ====================================================

    // Require or disallow an empty line before at-rules (Autofixable).
    'at-rule-empty-line-before': ['always', {
      except: ['first-nested', 'after-same-name'],
      ignore: ['after-comment'],
      ignoreAtRules: ['else'],
    }],

    // Specify lowercase or uppercase for at-rules names (Autofixable).
    '@stylistic/at-rule-name-case': 'lower',

    // Require a newline after at-rule names.
    '@stylistic/at-rule-name-newline-after': 'always-multi-line',

    // Require a single space after at-rule names (Autofixable).
    '@stylistic/at-rule-name-space-after': 'always-single-line',

    // Require a newline after the semicolon of at-rules (Autofixable).
    '@stylistic/at-rule-semicolon-newline-after': 'always',

    // Require a single space or disallow whitespace before the semicolons of at-rules.
    '@stylistic/at-rule-semicolon-space-before': 'never',





    // ====================================================
    // Comment
    // ====================================================

    // Require or disallow an empty line before comments (Autofixable).
    'comment-empty-line-before': ['always', {
      except: ['first-nested'],
      ignore: ['after-comment', 'stylelint-commands'],
    }],

    // Require or disallow whitespace on the inside of comment markers (Autofixable).
    'comment-whitespace-inside': 'always',





    // ====================================================
    // General / Sheet
    // ====================================================

    // Specify indentation (Autofixable).
    '@stylistic/indentation': [2, {
      baseIndentLevel: 1,
    }],

    // Specify unix or windows linebreaks (Autofixable).
    '@stylistic/linebreaks': 'unix',

    // Limit the number of adjacent empty lines.
    '@stylistic/max-empty-lines': 5,

    // Limit the length of a line.
    '@stylistic/max-line-length': 180,

    // Disallow end-of-line whitespace (Autofixable).
    '@stylistic/no-eol-whitespace': true,

    // Disallow missing end-of-source newlines (Autofixable).
    '@stylistic/no-missing-end-of-source-newline': true,

    // Disallow empty first lines (Autofixable).
    '@stylistic/no-empty-first-line': true,

    // Require or disallow Unicode BOM.
    '@stylistic/unicode-bom': 'never',
  },
}
