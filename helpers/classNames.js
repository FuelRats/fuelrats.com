export default function classNames(...classes) {
  const computedClasses = {}

  for (const className of classes) {
    if (typeof className === 'string') {
      computedClasses[className] = true
    } else if (Array.isArray(className)) {
      const [key, value] = className
      computedClasses[key] = typeof value === 'function' ? Boolean(value()) : Boolean(value)
    }
  }
  return Object.keys(computedClasses).filter(key => computedClasses[key] === true).join(' ')
}
