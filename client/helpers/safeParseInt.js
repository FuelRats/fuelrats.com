// Component constants
const DEFAULT_RADIX = 10





/**
 * A NaN-safe version of Number.parseInt. If the parsed value is NaN, defaultValue is returned instead
 *
 * @param {String} numStr string to parse to Number
 * @param {Number} [radix] value between 2 and 36 which represends the base of the string. Defaults to base10 (Decimal)
 * @param {Number} [defaultValue] value which is returned if the parsed int is nan. Defaults to 0.
 */
const safeParseInt = (numStr, radix = DEFAULT_RADIX, defaultValue = 0) => {
  const value = Number.parseInt(numStr, radix)

  return Number.isNaN(value) ? defaultValue : value
}





export default safeParseInt
