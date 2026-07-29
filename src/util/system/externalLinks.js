// URL builders for external Elite: Dangerous system reference sites.

const SPANSH_DEFAULT_RANGE = 75
const SPANSH_DEFAULT_EFFICIENCY = 60

export function getEdsmSystemUrl (systemName) {
  if (!systemName) {
    return null
  }
  return `https://www.edsm.net/en/system?systemName=${encodeURIComponent(systemName)}`
}

export async function submitSpanshRoute (systemName, { from = 'Sol', range = SPANSH_DEFAULT_RANGE, efficiency = SPANSH_DEFAULT_EFFICIENCY } = {}) {
  if (!systemName) {
    return null
  }
  const res = await fetch('/api/spansh/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: systemName, range, efficiency }),
  })
  const { job } = await res.json()
  const resultParams = new URLSearchParams({ from, to: systemName, range: String(range), efficiency: String(efficiency) })
  return `https://www.spansh.co.uk/plotter/results/${encodeURIComponent(job)}?${resultParams.toString()}`
}
