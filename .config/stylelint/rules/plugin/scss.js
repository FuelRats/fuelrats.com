const { kebabCasePattern } = require('../../patterns')





module.exports = {
  plugins: [
    'stylelint-scss',
  ],
  rules: {
    // ====================================================
    // @-each
    // ====================================================

    // This is a rule that checks for situations where users have done a loop using map-keys and grabbed the value for that key inside of the loop.
    'scss/at-each-key-value-single-line': null,





    // ====================================================
    // @-else
    // ====================================================

    // Require or disallow a newline after the closing brace of @else statements (Autofixable).
    'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',

    // Require a single space or disallow whitespace after the closing brace of @else statements (Autofixable).
    'scss/at-else-closing-brace-space-after': 'always-intermediate',

    // Require an empty line or disallow empty lines before @-else (Autofixable).
    'scss/at-else-empty-line-before': null,

    // Require or disallow a space before @else if parentheses (Autofixable).
    'scss/at-else-if-parentheses-space-before': 'always',





    // ====================================================
    // @-extend
    // ====================================================

    // Disallow at-extends (@extend) with missing placeholders.
    'scss/at-extend-no-missing-placeholder': true,





    // ====================================================
    // @-function
    // ====================================================

    // Require named parameters in SCSS function call rule.
    'scss/at-function-named-arguments': null,

    // Require or disallow a space before @function parentheses (Autofixable).
    'scss/at-function-parentheses-space-before': 'always',

    // Specify a pattern for Sass/SCSS-like function names.
    'scss/at-function-pattern': kebabCasePattern,





    // ====================================================
    // @-if
    // ====================================================

    // Require or disallow a newline after the closing brace of @if statements (Autofixable).
    'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',

    // Require a single space or disallow whitespace after the closing brace of @if statements (Autofixable).
    'scss/at-if-closing-brace-space-after': 'always-intermediate',

    // Disallow null in @if statements.
    'scss/at-if-no-null': true,





    // ====================================================
    // @-import
    // ====================================================

    // Disallow leading underscore in partial names in @import.
    'scss/load-no-partial-leading-underscore': true,

    // Require or disallow extension in @import commands.
    'scss/load-partial-extension': null,

    // Specify blacklist of disallowed file extensions for partial names in @import commands.
    'scss/at-import-partial-extension-disallowed-list': null,

    // Specify whitelist of allowed file extensions for partial names in @import commands.
    'scss/at-import-partial-extension-allowed-list': null,





    // ====================================================
    // @-mixin
    // ====================================================

    // Require or disallow parentheses in argumentless @mixin calls (Autofixable).
    'scss/at-mixin-argumentless-call-parentheses': 'always',

    // Require named parameters in at-mixin call rule.
    'scss/at-mixin-named-arguments': null,

    // Require or disallow a space before @mixin parentheses (Autofixable).
    'scss/at-mixin-parentheses-space-before': 'always',

    // Specify a pattern for Sass/SCSS-like mixin names.
    'scss/at-mixin-pattern': kebabCasePattern,





    // ====================================================
    // @-rule
    // ====================================================

    // Disallow parentheses in conditional @ rules (if, elsif, while)
    'scss/at-rule-conditional-no-parentheses': true,

    // Disallow unknown at-rules. Should be used instead of stylelint's at-rule-no-unknown.
    'scss/at-rule-no-unknown': [true, {
      ignoreAtRules: ['value'],
    }],





    // ====================================================
    // $-Variable
    // ====================================================

    // Require a newline after the colon in $-variable declarations (Autofixable).
    'scss/dollar-variable-colon-newline-after': 'always-multi-line',

    // Require or disallow whitespace after the colon in $-variable declarations (Autofixable).
    'scss/dollar-variable-colon-space-after': 'always-single-line',

    // Require a single space or disallow whitespace before the colon in $-variable declarations (Autofixable).
    'scss/dollar-variable-colon-space-before': 'never',

    // Require !default flag for $-variable declarations.
    'scss/dollar-variable-default': null,

    // Require a single empty line or disallow empty lines after $-variable declarations (Autofixable).
    'scss/dollar-variable-empty-line-after': ['always', {
      except: [
        'last-nested',
        'before-dollar-variable',
      ],
    }],

    // Require a single empty line or disallow empty lines before $-variable declarations (Autofixable).
    'scss/dollar-variable-empty-line-before': ['always', {
      except: [
        'first-nested',
        'after-comment',
        'after-dollar-variable',
      ],
    }],

    // Require for variables to be put first in a block (a rule or in root).
    'scss/dollar-variable-first-in-block': [true, {
      ignore: [
        'comments',
        'imports',
      ],
      except: [
        'root',
        'loops',
      ],
    }],

    // Disallow Sass variables that are used without interpolation with CSS features that use custom identifiers.
    'scss/dollar-variable-no-missing-interpolation': true,

    // Specify a pattern for Sass-like variables.
    'scss/dollar-variable-pattern': kebabCasePattern,





    // ====================================================
    // %-placeholder
    // ====================================================

    // Specify a pattern for %-placeholders.
    'scss/percent-placeholder-pattern': kebabCasePattern,





    // ====================================================
    // //-comment
    // ====================================================

    // Require or disallow an empty line before //-comments (Autofixable).
    'scss/double-slash-comment-empty-line-before': null,

    // Require or disallow //-comments to be inline comments.
    'scss/double-slash-comment-inline': 'never',

    // Require or disallow whitespace after the // in //-comments
    'scss/double-slash-comment-whitespace-inside': 'always',





    // ====================================================
    // Comment
    // ====================================================

    // Disallow empty comments.
    'scss/comment-no-empty': true,

    // Disallow /*-comments.
    'scss/comment-no-loud': null,





    // ====================================================
    // Declaration
    // ====================================================

    // Require or disallow properties with - in their names to be in a form of a nested group.
    'scss/declaration-nested-properties': 'never',

    // Disallow nested properties of the same "namespace" be divided into multiple groups.
    'scss/declaration-nested-properties-no-divided-groups': null,





    // ====================================================
    // Dimension
    // ====================================================

    // Disallow non-numeric values when interpolating a value with a unit.
    'scss/dimension-no-non-numeric-values': true,





    // ====================================================
    // Function
    // ====================================================

    // Encourage the use of the scale-color function over regular color functions.
    'scss/function-color-relative': null,

    // Disallow quoted strings inside the quote function (Autofixable).
    'scss/function-quote-no-quoted-strings-inside': true,

    // Disallow unquoted strings inside the unquote function (Autofixable).
    'scss/function-unquote-no-unquoted-strings-inside': true,





    // ====================================================
    // Map
    // ====================================================

    // Require quoted keys in Sass maps.
    'scss/map-keys-quotes': 'always',





    // ====================================================
    // Media feature
    // ====================================================

    // Require a media feature value be a $-variable or disallow $-variables in media feature values.
    'scss/media-feature-value-dollar-variable': null,





    // ====================================================
    // Operator
    // ====================================================

    // Disallow linebreaks after Sass operators.
    'scss/operator-no-newline-after': true,

    // Disallow linebreaks before Sass operators.
    'scss/operator-no-newline-before': true,

    // Disallow unspaced operators in Sass operations.
    'scss/operator-no-unspaced': true,




    // ====================================================
    // Partial
    // ====================================================

    // Disallow non-CSS @imports in partial files.
    'scss/partial-no-import': null,





    // ====================================================
    // Selector
    // ====================================================

    // Require or disallow nesting of combinators in selectors.
    'scss/selector-nest-combinators': null,

    // Disallow redundant nesting selectors (&).
    'scss/selector-no-redundant-nesting-selector': true,

    // Disallow union class names with the parent selector (&)
    'scss/selector-no-union-class-name': true,





    // ====================================================
    // General / Sheet
    // ====================================================

    // Disallow dollar variables within a stylesheet.
    'scss/no-dollar-variables': null,

    // Disallow duplicate dollar variables within a stylesheet.
    // MAJOR: true
    'scss/no-duplicate-dollar-variables': null,

    // Disallow duplicate mixins within a stylesheet.
    'scss/no-duplicate-mixins': true,

    // Disallows the use of global function names, as these global functions are now located inside built-in Sass modules.
    // MAJOR: true
    'scss/no-global-function-names': null,
  },
}
