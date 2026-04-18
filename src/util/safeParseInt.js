// Component constants
const DEFAULT_RADIX = 10

/**
 * A NaN-safe version of Number.parseInt. If the parsed value is NaN, defaultValue is returned instead
 * @param {string | null | undefined} numStr string to parse to Number
 * @param {number} [radix] value between 2 and 36 which represents the base of the string. Defaults to base10 (Decimal)
 * @returns {number}
 */
const safeParseInt = (numStr, radix = DEFAULT_RADIX) => {
  if (typeof numStr === 'undefined' || numStr === null) {
    return undefined
  }

  const value = Number.parseInt(numStr, radix)

  return Number.isNaN(value) ? undefined : value
}





export default safeParseInt
