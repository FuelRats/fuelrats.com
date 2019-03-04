const classNames = (...classes) => classes.reduce((acc, className) => {
  if (typeof className === 'string' && className.length) {
    return `${acc} ${className}`
  }

  if (Array.isArray(className)) {
    const [key, value] = className
    if (typeof value === 'function' ? value() : value) {
      return `${acc} ${key}`
    }
  }

  return acc
}, '').trim()





export default classNames
