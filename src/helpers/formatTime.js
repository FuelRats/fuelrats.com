import moment from 'moment'





const ELITE_GAME_YEAR_DESPARITY = 1286 // Years between IRL year and Elite universe year

const getEliteTimeFromLocalTime = (timestamp) => {
  return moment(timestamp).add(ELITE_GAME_YEAR_DESPARITY, 'years')
}

export const formatAsEliteDateTime = (timestamp) => {
  return getEliteTimeFromLocalTime(timestamp).format('DD MMM YYYY HH:mm').toUpperCase()
}

export const formatAsEliteDate = (timestamp) => {
  return getEliteTimeFromLocalTime(timestamp).format('DD MMM YYYY').toUpperCase()
}

export const formatAsEliteDateLong = (timestamp) => {
  return getEliteTimeFromLocalTime(timestamp).format('DD MMMM YYYY')
}
