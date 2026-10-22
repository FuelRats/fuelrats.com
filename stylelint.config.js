module.exports = {
  extends: [
    './.config/stylelint/rules/core/errors',
    './.config/stylelint/rules/core/limitfeatures',
    './.config/stylelint/rules/core/style',
    './.config/stylelint/rules/plugin/scss',
    './.config/stylelint/rules/plugin/order',
  ],
  plugins: [
    '@stylistic/stylelint-plugin',
  ],
  customSyntax: 'postcss-scss',
  rules: {
    '@stylistic/media-query-list-comma-space-after': 'always-single-line',
  },
  overrides: [
    {
      // Global stylesheets follow third-party and BEM-style class names
      files: ['src/scss/**/*.scss'],
      rules: {
        'selector-class-pattern': null,
      },
    },
  ],
}
