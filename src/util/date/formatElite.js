import { formatInTimeZone } from 'date-fns-tz'

import toEliteDate from './toEliteDate'

/**
 * @param {string | number | Date} value Timestamp string, epoch, or date object.
 * @param {string} format date-fns format string
 * @returns {string}
 */
export default function formatElite (value, format) {
  if (value === null || value === undefined) {
    return ''
  }

  const date = toEliteDate(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return formatInTimeZone(
    date,
    'UTC',
    format,
  )
}
