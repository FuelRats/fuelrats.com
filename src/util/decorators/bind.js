export default function bind (target, name, descriptor) {
  const func = descriptor.value
  return {
    configurable: true,
    get () {
      if (this === target || Reflect.getOwnPropertyDescriptor(target, name)) {
        return func
      }

      const boundFunc = func.bind(this)

      Reflect.defineProperty(this, name, {
        value: boundFunc,
        configurable: true,
        writable: true,
      })

      return boundFunc
    },
  }
}
