import makePaginatedRoute from './makePaginatedRoute'

/**
 * @param {object} params
 * @param {string|number|null} [params.author]
 * @param {string|number|null} [params.category]
 * @param {number|null} [params.page]
 * @returns {string}
 */
export default function makeBlogRoute (params) {
  const { author, category, ...query } = params

  let route = '/blog'

  if (author) {
    route += `/author/${author}`
  } else if (category) {
    route += `/category/${category}`
  }

  return makePaginatedRoute(route, query)
}
