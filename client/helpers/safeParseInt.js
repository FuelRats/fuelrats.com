// Component constants
const DEFAULT_RADIX = 10





/**
 * A NaN-safe version of Number.parseInt. If the parsed value is NaN, defaultValue is returned instead
 *
 * @param {string} numStr string to parse to Number
 * @param {number} [radix] value between 2 and 36 which represends the base of the string. Defaults to base10 (Decimal)
 * @param {number} [defaultValue] value which is returned if the parsed int is nan. Defaults to 0.
 * @returns {number}
 */
const safeParseInt = (numStr, radix = DEFAULT_RADIX, defaultValue = 0) => {
  const value = Number.parseInt(numStr, radix)

  return Number.isNaN(value) ? defaultValue : value
}





export default safeParseInt
