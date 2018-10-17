import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function wordpressReducer (state = initialState.rescues, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_WORDPRESS_PAGE:
    case actionTypes.GET_WORDPRESS_PAGES:
      switch (status) {
        case 'success':
          return {
            ...state,
            page: {
              ...state.page,
              ...payload.reduce((accumulator, page) => ({
                ...accumulator,
                [page.slug]: page,
              }), {}),
            },
          }

        default:
          return state
      }

    default:
      return state
  }
}
