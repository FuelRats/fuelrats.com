const enumerable = isEnumerable => (target, prop, descriptor) => {
  descriptor.enumerable = Boolean(isEnumerable)
  return descriptor
}



export default enumerable
