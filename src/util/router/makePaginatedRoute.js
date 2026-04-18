import makeRoute from './makeRoute'

/**
 * @param {string} route
 * @param {object} params
 * @param {number|null} [params.page]
 * @returns {string}
 */
export default function makePaginatedRoute (route, params) {
  const { page, ...query } = params

  let finalRoute = route

  if (typeof page === 'number' && page > 1) {
    finalRoute += `/page/${page}`
  }

  return makeRoute(finalRoute, query)
}
