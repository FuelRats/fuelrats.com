import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function blogsReducer (state = initialState.blogs, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_WORDPRESS_POST:
      switch (status) {
        case 'success':
          return {
            ...state,
            blogs: [payload],
            totalPages: null,
          }

        default:
          return state
      }

    case actionTypes.GET_WORDPRESS_POSTS:
      switch (status) {
        case 'error':
          return {
            ...state,
            blogs: [],
            totalPages: 0,
          }

        case 'success':
          return {
            ...state,
            blogs: [...payload.blogs],
            totalPages: payload.totalPages,
          }

        default:
          return state
      }


    case actionTypes.GET_WORDPRESS_AUTHOR:
      if (status === 'success') {
        return {
          ...state,
          authors: {
            ...state.authors,
            [payload.id]: { ...payload },
          },
        }
      }
      return state

    case actionTypes.GET_WORDPRESS_CATEGORY:
      if (status === 'success') {
        return {
          ...state,
          categories: {
            ...state.categories,
            [payload.id]: { ...payload },
          },
        }
      }
      return state

    default:
      return state
  }
}
