import makeRoute from './makeRoute'

/**
 * @param {object} params
 * @param {string} params.rescueId
 * @returns {string}
 */
export default function makePaperworkRoute (params) {
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
