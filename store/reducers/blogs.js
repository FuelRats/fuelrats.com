import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.blogs, action) {
  let {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.RETRIEVE_BLOG:
      switch (status) {
        case 'success':
          return Object.assign({}, state, {
            blogs: [payload],
          })

        default:
          return state
      }

    case actionTypes.RETRIEVE_BLOGS:
      switch (status) {
        case 'error':
          return Object.assign({}, state, {
            blogs: [],
            total: null,
          })

        case 'success':
          return Object.assign({}, state, payload)

        default:
          return state
      }

    default:
      return state
  }
}
