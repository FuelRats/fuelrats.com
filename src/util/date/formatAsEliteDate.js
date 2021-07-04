import formatElite from './formatElite'

/**
 * @param {string | number | Date} value Timestamp string, epoch, or date object.
 * @returns {string}
 */
export default function formatAsEliteDate (value) {
  return formatElite(
    value,
    'dd MMM yyyy',
  ).toUpperCase()
}
