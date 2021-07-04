const ELITE_GAME_YEAR_DISPARITY = 1286 // Years between IRL year and Elite universe year

/**
 * @param {string | number | Date} value Timestamp string, epoch, or date object.
 * @returns {Date}
 */
export default function toEliteDate (value) {
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
