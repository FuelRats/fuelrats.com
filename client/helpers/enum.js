/**
 * Decorator to turn a class into a quasi Enum
 * From https://github.com/FuelRats/api.fuelrats.com/blob/v3.0/src/classes/Enum.js
 * @param {Object} target
 */
export default function enumerable (target) {
  const keys = []

  Reflect.ownKeys(target).forEach((key) => {
    if (Reflect.has(target, key)) {
      if (typeof target[key] === 'undefined') {
        target[key] = `${target.prototype.constructor.name}/${key.toString()}`.toLowerCase()
      }

      keys.push(key)
    }
  })

  Reflect.defineProperty(target, 'keys', {
    get: () => keys,
    static: true,
  })

  Object.freeze(target)

  return target
}
