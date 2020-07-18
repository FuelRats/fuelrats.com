import moment from 'moment'





const ELITE_GAME_YEAR_DESPARITY = 1286 // Years between IRL year and Elite universe year

function getEliteTimeFromLocalTime (timestamp) {
  return moment(timestamp).add(ELITE_GAME_YEAR_DESPARITY, 'years')
}

export function formatAsEliteDateTime (timestamp) {
  return getEliteTimeFromLocalTime(timestamp).format('DD MMM YYYY HH:mm').toUpperCase()
}

export function formatAsEliteDate (timestamp) {
  return getEliteTimeFromLocalTime(timestamp).format('DD MMM YYYY').toUpperCase()
}

export function formatAsEliteDateLong (timestamp) {
  return getEliteTimeFromLocalTime(timestamp).format('DD MMMM YYYY')
}
