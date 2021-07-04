/**
 * Strictly resolves a string boolean to a proper bool.
 * If the value is neither `'true'` or `'false'`, `undefined` is returned.
 *
 * @param {string} value String value representing boolean state.
 * @returns {boolean}
 */
export default function stringToStrictBoolean (value) {
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }

  return undefined
}
