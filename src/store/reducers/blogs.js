import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'




const blogsReducer = produce((draftState, action) => {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.wordpress.authors.read:
      if (status === 'success') {
        draftState.authors[payload.id] = payload
      }
      break

    case actionTypes.wordpress.categories.read:
      if (status === 'success') {
        draftState.categories[payload.id] = payload
      }
      break

    case actionTypes.wordpress.posts.read:
      if (status === 'success') {
        draftState.blogs.push(payload)
        draftState.totalPages = null
      }
      break

    case actionTypes.wordpress.posts.search:
      switch (status) {
        case 'error':
          draftState.blogs = []
          draftState.totalPages = 0
          break

        case 'success':
          draftState.blogs = payload
          draftState.totalPages = parseInt(action.response.headers['x-wp-totalpages'], 10)
          break

        default:
          break
      }
      break

    default:
      break
  }
}, initialState.blogs)





export default blogsReducer
