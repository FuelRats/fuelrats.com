/**
 * Accepts an object and tests some basic patterns of promises
 * @param {any} obj
 * @returns {boolean}
 */
export default function isPromise (obj) {
  return (typeof obj === 'object' || typeof obj === 'function')
    && typeof obj.then === 'function'
}
