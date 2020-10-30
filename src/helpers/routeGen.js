import qs from 'qs'





/**
 * @param {string} href
 * @param {object} query
 * @returns {string}
 */
export function makeRoute (href = '', query = {}) {
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

/**
 * @param {object} params
 * @param {string} params.rescueId
 * @returns {string}
 */
export function makePaperworkRoute (params) {
  const {
    edit = false,
    rescueId,
    ...query
  } = params

  let route = `/paperwork/${rescueId}`

  if (edit) {
    route += '/edit'
  }

  return makeRoute(route, query)
}

/**
 * @param {object} params
 * @param {string|number|null} params.author
 * @param {string|number|null} params.category
 * @param {string|number|null} params.page
 * @returns {string}
 */
export function makeBlogRoute (params) {
  const {
    author,
    category,
    page,
    ...query
  } = params

  let route = '/blog'

  if (author) {
    route += `/author/${author}`
  } else if (category) {
    route += `/category/${category}`
  }

  if (typeof page === 'number') {
    route += `/page/${page}`
  }

  return makeRoute(route, query)
}
