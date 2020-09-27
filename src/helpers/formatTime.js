import { addYears } from 'date-fns'
import { format, utcToZonedTime } from 'date-fns-tz'





const ELITE_GAME_YEAR_DISPARITY = 1286 // Years between IRL year and Elite universe year
const MILLISECONDS_IN_SECOND = 1000
const MINUTES_IN_HOUR = 60
const SECONDS_IN_HOUR = 3600
const SECONDS_IN_MINUTE = 60
const SECONDS_IN_DAY = 86400

function padNum (number) {
  return String(number).padStart(2, 0)
}

function getEliteTimeFromLocalTime (timestamp) {
  return utcToZonedTime(
    addYears(new Date(timestamp), ELITE_GAME_YEAR_DISPARITY),
    'Etc/UTC',
  )
}

export function formatAsEliteDateTime (timestamp, withSeconds) {
  return format(
    getEliteTimeFromLocalTime(timestamp),
    `dd MMM yyyy HH:mm${withSeconds ? ':ss' : ''}`,
    { timeZone: 'Etc/UTC' },
  ).toUpperCase()
}

export function formatAsEliteDate (timestamp) {
  return format(
    getEliteTimeFromLocalTime(timestamp),
    'dd MMM yyyy',
    { timeZone: 'Etc/UTC' },
  ).toUpperCase()
}

export function formatAsEliteDateLong (timestamp) {
  return format(
    getEliteTimeFromLocalTime(timestamp),
    'dd MMMM yyyy',
    { timeZone: 'Etc/UTC' },
  ).toUpperCase()
}




/**
 *
 * @param {string} timestamp ISO format string representing start time of the elapsed counter.
 * @returns {[string, number]} A tuple containing the formatted string and the remainder amount of milliseconds.
 */
export function formatTimeElapsed (timestamp) {
  const startTime = (new Date(timestamp)).getTime()
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
