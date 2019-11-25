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
    case actionTypes.GET_WORDPRESS_POST:
      if (status === 'success') {
        draftState.blogs.push(payload)
        draftState.totalPages = null
      }
      break

    case actionTypes.GET_WORDPRESS_POSTS:
      switch (status) {
        case 'error':
          draftState.blogs = []
          draftState.totalPages = 0
          break

        case 'success':
          draftState.blogs = [...payload]
          draftState.totalPages = parseInt(action.response.headers['x-wp-totalpages'], 10)
          break

        default:
          break
      }
      break

    case actionTypes.GET_WORDPRESS_AUTHOR:
      if (status === 'success') {
        draftState.authors[payload.id] = { ...payload }
      }
      break

    case actionTypes.GET_WORDPRESS_CATEGORY:
      if (status === 'success') {
        draftState.categories[payload.id] = { ...payload }
      }
      break

    default:
      break
  }
}, initialState.blogs)



export default blogsReducer
