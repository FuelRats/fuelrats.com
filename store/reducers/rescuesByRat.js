import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.rescuesByRat, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_RESCUES_BY_RAT:
      switch (status) {
        case 'success':
          return Object.assign({}, state, {
            loading: false,
            statistics: payload.data,
          })

        case 'error':
          return Object.assign({}, state, {
            loading: false,
            statistics: [],
          })

        default:
          return Object.assign({}, state, {
            loading: true,
          })
      }

    default:
      return state
  }
}
