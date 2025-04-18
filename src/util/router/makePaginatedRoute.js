import makeRoute from './makeRoute'

/**
 * @param {object} params
 * @param {string} params.route
 * @param {string|number|null} params.author
 * @param {string|number|null} params.category
 * @param {string|number|null} params.page
 * @returns {string}
 */
export default function makePaginatedRoute (params) {
  const {
    route,
    author,
    category,
    page,
    ...query
  } = params

  let parsedRoute = `/${route}`

  if (author) {
    parsedRoute += `/author/${author}`
  } else if (category) {
    parsedRoute += `/category/${category}`
  }

  if (typeof page === 'number' && page > 1) {
    parsedRoute += `/page/${page}`
  }

  return makeRoute(parsedRoute, query)
}
