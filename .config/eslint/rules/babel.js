module.exports = {
  '@babel/new-cap': [
    'error',
    {
      newIsCap: true,
      capIsNew: true,
      newIsCapExceptions: [],
      capIsNewExceptions: ['DELETE', 'GET', 'PATCH', 'POST', 'PUT', 'Stripe'],
      capIsNewExceptionPattern: '^(type|Sequelize)..',
      properties: true,
    },
  ],
  '@babel/no-unused-expressions': [
    'error',
    {
      allowShortCircuit: false,
      allowTaggedTemplates: false,
      allowTernary: false,
      enforceForJSX: true,
    },
  ],
}
