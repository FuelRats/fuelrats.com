import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.rescuesBySystem, action) {
  let {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_RESCUES_BY_SYSTEM:
      switch (status) {
        case 'success':
          return Object.assign({}, state, {
            loading: false,
            statistics: payload,
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
