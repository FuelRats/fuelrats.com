/**
 * Performs an advanced equality check on objects and arrays fed into it, Will do a type invarient check otherwise.
 * @param {*} value First value to compare.
 * @param {*} compare Second value to compare.
 * @returns {boolean}
 */
export default function isEqual (value, compare) {
  if (typeof value !== typeof compare) {
    return false
  }

  if (typeof value === 'object') {
    return JSON.stringify(value) === JSON.stringify(compare)
  }

  return value === compare
}
