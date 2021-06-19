import { isError } from 'flux-standard-action'
import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'




export default produce((draftState, action) => {
  const {
    payload,
    type,
    meta,
  } = action

  switch (type) {
    case actionTypes.wordpress.authors.read:
      if (!isError(action)) {
        draftState.authors[payload.id] = payload
      }
      break

    case actionTypes.wordpress.categories.read:
      if (!isError(action)) {
        draftState.categories[payload.id] = payload
      }
      break

    case actionTypes.wordpress.posts.read:
      if (!isError(action)) {
        draftState.blogs.push(payload)
        draftState.totalPages = null
      }
      break

    case actionTypes.wordpress.posts.search:
      if (isError(action)) {
        draftState.blogs = []
        draftState.totalPages = 0
      } else {
        draftState.blogs = payload
        draftState.totalPages = parseInt(meta.response.headers['x-wp-totalpages'], 10)
      }
      break

    default:
      break
  }
}, initialState.blogs)
