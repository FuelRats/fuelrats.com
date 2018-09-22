import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.blogs, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.RETRIEVE_BLOG:
      switch (status) {
        case 'success':
          return {
            ...state,
            blogs: state.blogs.concat(payload),
          }

        default:
          return state
      }

    case actionTypes.RETRIEVE_BLOGS:
      switch (status) {
        case 'error':
          return {
            ...state,
            blogs: [],
            total: null,
          }

        case 'success':
          return { ...state, ...payload }

        default:
          return state
      }

    default:
      return state
  }
}
