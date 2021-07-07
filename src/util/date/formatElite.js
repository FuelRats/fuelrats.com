import { format as formatTz } from 'date-fns-tz'

import toEliteDate from './toEliteDate'

/**
 * @param {string | number | Date} value Timestamp string, epoch, or date object.
 * @param {string} format date-fns format string
 * @returns {string}
 */
export default function formatElite (value, format) {
  return formatTz(
    toEliteDate(value),
    format,
    { timeZone: 'UTC' },
  )
}
