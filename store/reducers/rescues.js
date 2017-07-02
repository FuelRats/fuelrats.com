import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.rescues, action) {
  switch (action.type) {
    case actionTypes.GET_RESCUES:
      let {
        rescues,
        retrieving,
        total,
      } = state
      let newState = Object.assign({}, state)

      switch (action.status) {
        case 'error':
          rescues = []
          retrieving = true
          total = 0

          break

        case 'success':
          rescues = action.rescues
          retrieving = false
          total = action.total

          break

        default:
          retrieving = false
      }

      return Object.assign({}, state, {
        rescues,
        retrieving,
        total,
      })

    default:
      return state
  }
}
