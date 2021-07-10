import formatElite from './formatElite'

/**
 * @param {string | number | Date} value Timestamp string, epoch, or date object.
 * @param {boolean} withSeconds
 * @returns {string}
 */
export default function formatAsEliteDateTime (value, withSeconds) {
  return formatElite(
    value,
    `dd MMM yyyy HH:mm${withSeconds ? ':ss' : ''}`,
  ).toUpperCase()
}
