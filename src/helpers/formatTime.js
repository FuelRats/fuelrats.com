import { format as formatTz } from 'date-fns-tz'





const ELITE_GAME_YEAR_DISPARITY = 1286 // Years between IRL year and Elite universe year
const MILLISECONDS_IN_SECOND = 1000
const MINUTES_IN_HOUR = 60
const SECONDS_IN_HOUR = 3600
const SECONDS_IN_MINUTE = 60
const SECONDS_IN_DAY = 86400

function padNum (number) {
  return String(number).padStart(2, 0)
}





/**
 * @param {string | number | Date} value Timestamp string, epoch, or date object.
 * @returns {Date}
 */
export function toEliteDate (value) {
  const date = new Date(value)

  return new Date(
    date.getUTCFullYear() + ELITE_GAME_YEAR_DISPARITY,
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  )
}





/**
 * @param {string | number | Date} value Timestamp string, epoch, or date object.
 * @param {string} format date-fns format string
 * @returns {string}
 */
export function formatElite (value, format) {
  return formatTz(
    toEliteDate(value),
    format,
    { timeZone: 'UTC' },
  )
}





/**
 * @param {string | number | Date} value Timestamp string, epoch, or date object.
 * @returns {string}
 */
export function formatAsEliteDate (value) {
  return formatElite(
    value,
    'dd MMM yyyy',
  ).toUpperCase()
}





/**
 * @param {string | number | Date} value Timestamp string, epoch, or date object.
 * @param {boolean} withSeconds
 * @returns {string}
 */
export function formatAsEliteDateTime (value, withSeconds) {
  return formatElite(
    value,
    `dd MMM yyyy HH:mm${withSeconds ? ':ss' : ''}`,
  ).toUpperCase()
}





/**
 * @param {string | number | Date} value Timestamp string, epoch, or date object.
 * @returns {[string, number]} A tuple containing the formatted string and the remainder amount of milliseconds.
 */
export function formatTimeElapsed (value) {
  const startTime = (new Date(value)).getTime()
  const nowTime = Date.now()

  const totalMilliseconds = nowTime - startTime
  const totalSeconds = Math.floor(totalMilliseconds / MILLISECONDS_IN_SECOND)

  const days = Math.floor(totalSeconds / SECONDS_IN_DAY)
  const hours = Math.floor((totalSeconds % SECONDS_IN_DAY) / SECONDS_IN_HOUR)
  const minutes = Math.floor((totalSeconds % SECONDS_IN_HOUR) / MINUTES_IN_HOUR)
  const seconds = totalSeconds % SECONDS_IN_MINUTE
  const milliseconds = totalMilliseconds % MILLISECONDS_IN_SECOND

  return [`${days > 0 ? `${days}d ` : ''}${padNum(hours)}:${padNum(minutes)}:${padNum(seconds)}`, milliseconds]
}
