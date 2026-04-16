import formatAsEliteDateTime from './formatAsEliteDateTime'

const MS_IN_SECOND = 1000
const MS_IN_MINUTE = 60 * MS_IN_SECOND
const MS_IN_HOUR = 60 * MS_IN_MINUTE
const MS_IN_DAY = 24 * MS_IN_HOUR

const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export default function formatQuoteTime (value) {
  const startTime = (new Date(value)).getTime()
  const elapsedMs = Date.now() - startTime

  if (elapsedMs < 0 || elapsedMs >= MS_IN_DAY) {
    return formatAsEliteDateTime(value)
  }

  if (elapsedMs < MS_IN_MINUTE) {
    return 'just now'
  }

  if (elapsedMs < MS_IN_HOUR) {
    const minutes = Math.floor(elapsedMs / MS_IN_MINUTE)
    return relativeFormatter.format(-minutes, 'minute')
  }

  const hours = Math.floor(elapsedMs / MS_IN_HOUR)
  return relativeFormatter.format(-hours, 'hour')
}
