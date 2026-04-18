// URL builders for external Elite: Dangerous system reference sites.

const SPANSH_DEFAULT_RANGE = 75
const SPANSH_DEFAULT_EFFICIENCY = 60

export function getEdsmSystemUrl (systemName) {
  if (!systemName) {
    return null
  }
  return `https://www.edsm.net/en/system/name/${encodeURIComponent(systemName)}`
}

export function getSpanshPlotUrl (systemName, { from = 'Sol', range = SPANSH_DEFAULT_RANGE, efficiency = SPANSH_DEFAULT_EFFICIENCY } = {}) {
  if (!systemName) {
    return null
  }
  const params = new URLSearchParams({
    from,
    to: systemName,
    range: String(range),
    efficiency: String(efficiency),
  })
  return `https://www.spansh.co.uk/plotter?${params.toString()}`
}
