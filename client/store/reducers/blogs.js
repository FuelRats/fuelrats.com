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
      if (status === 'success') {
        return {
          ...state,
          blogs: [payload],
          totalPages: null,
        }
      }
      break

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
            blogs: [...payload],
            totalPages: parseInt(action.response.headers['x-wp-totalpages'], 10),
          }

        default:
          break
      }
      break

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
      break

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
      break

    default:
      break
  }

  return state
}
