/**
 * A convenience function which modifies the contents of an array by inserting new elements at the front, and splicing the array at the given start point.
 * The primary purpose of this function is to create a FIFO array of fixed length.
 * @param {Array<any>} target
 * @param {number} start
 * @param {...any} element
 * @returns {Array<any>} array of elements removed from the array. If no elements are removed, an empty array is returned.
 */
export default function unshiftSplice (target, start, ...element) {
  target.unshift(...element)
  return target.splice(start)
}
