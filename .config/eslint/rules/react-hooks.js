module.exports = {
  'react-hooks/exhaustive-deps': [
    'warn',
    {
      additionalHooks: '^use.+(Callback|Effect)$',
    },
  ],
  'react-hooks/rules-of-hooks': 'error',
}
