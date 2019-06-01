import moment from 'moment'





const ELITE_GAME_YEAR_DESPARITY = 1286 // Years between IRL year and Elite universe year





const formatAsEliteDateTime = (timestamp) => moment(timestamp).add(ELITE_GAME_YEAR_DESPARITY, 'years').format('DD MMM YYYY HH:mm').toUpperCase()





export {
  // eslint-disable-next-line import/prefer-default-export
  formatAsEliteDateTime,
}
