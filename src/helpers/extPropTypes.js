export default function extPropType (propType) {
  function checkType (extTypeCheck, ...args) {
    const [, propName, componentName] = args
    if (typeof propType !== 'function') {
      return new Error(`extPropType wrapper for prop \`${propName}\` of component \`${componentName}\` was called without a valid propType value.`)
    }
    return extTypeCheck ? extTypeCheck(...args) : propType(...args)
  }

  const chain = checkType.bind(null, null)
  chain.isRequiredIf = (otherPropName, otherPropType) => {
    return checkType.bind(null, (...args) => {
      const [props, propName, componentName, ...rest] = args

      if (!propType.isRequired) {
        return new Error(
          `propType for prop \`${propName}\` of component \`${componentName}\` is already required by it's type definition. remove \`isRequired\` to use this extended type`,
        )
      }

      if (typeof otherPropType === 'string') {
        if (typeof props[otherPropName] === otherPropType) {
          return propType.isRequired(...args)
        }
      }

      let validator = null
      if (typeof otherPropType.isRequired === 'function') {
        validator = otherPropType.isRequired
      } else if (typeof otherPropType === 'function') {
        validator = otherPropType
      }

      if (validator && !validator(props, otherPropName, componentName, ...rest)) {
        return propType.isRequired(...args)
      }
      return propType(...args)
    })
  }

  return chain
}
