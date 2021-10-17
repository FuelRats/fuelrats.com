import qs from 'qs'

/**
 * @param {string} href
 * @param {object} query
 * @returns {string}
 */
export default function makeRoute (href = '', query = {}) {
  let [route = '/', qStr = ''] = href.split('?')

  const nextQStr = qs.stringify({
    ...qs.parse(qStr),
    ...query,
  })

  if (nextQStr.length) {
    route += `?${nextQStr}`
  }

  return route
}
