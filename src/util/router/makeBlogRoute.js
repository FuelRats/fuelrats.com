import makeRoute from './makeRoute'

/**
 * @param {object} params
 * @param {string|number|null} params.author
 * @param {string|number|null} params.category
 * @param {string|number|null} params.page
 * @returns {string}
 */
export default function makeBlogRoute (params) {
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

  if (typeof page === 'number' && page > 1) {
    route += `/page/${page}`
  }

  return makeRoute(route, query)
}
