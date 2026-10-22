import formatAsEliteDateTime from './formatAsEliteDateTime'

const MS_IN_SECOND = 1000
const MS_IN_MINUTE = 60 * MS_IN_SECOND
const MS_IN_HOUR = 60 * MS_IN_MINUTE
const MS_IN_DAY = 24 * MS_IN_HOUR

const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/**
 * @param {string | number | Date} value Timestamp string, epoch, or date object.
 * @returns {[string, number | null]} A tuple containing the formatted string and the milliseconds until it next changes,
 * or `null` if it won't change.
 */
export default function formatQuoteTime (value) {
  const startTime = (new Date(value)).getTime()
  if (Number.isNaN(startTime)) {
    return ['', null]
  }

  const elapsedMs = Date.now() - startTime

  if (elapsedMs < 0 || elapsedMs >= MS_IN_DAY) {
    const text = formatAsEliteDateTime(value)
    if (elapsedMs < 0) {
      // Refresh once the timestamp is reached, capped so a far-future value can't overflow setTimeout's delay.
      return [text, Math.min(-elapsedMs, MS_IN_DAY)]
    }
    return [text, null]
  }

  if (elapsedMs < MS_IN_MINUTE) {
    return ['just now', MS_IN_MINUTE - (elapsedMs % MS_IN_MINUTE)]
  }

  if (elapsedMs < MS_IN_HOUR) {
    const minutes = Math.floor(elapsedMs / MS_IN_MINUTE)
    return [relativeFormatter.format(-minutes, 'minute'), MS_IN_MINUTE - (elapsedMs % MS_IN_MINUTE)]
  }

  const hours = Math.floor(elapsedMs / MS_IN_HOUR)
  return [relativeFormatter.format(-hours, 'hour'), MS_IN_HOUR - (elapsedMs % MS_IN_HOUR)]
}
