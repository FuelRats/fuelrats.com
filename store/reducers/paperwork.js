import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.paperwork, action) {
  switch (action.type) {
    case actionTypes.SUBMIT_PAPERWORK:
      switch (action.status) {
        case 'error':
          return Object.assign({}, state, {
            submitting: false,
          })

        case 'success':
          return Object.assign({}, state, {
            rescue: null,
            submitting: false,
          })

        default:
          return Object.assign({}, state, {
            submitting: true,
          })
      }

      return newState

    case actionTypes.RETRIEVE_PAPERWORK:
      switch (action.status) {
        case 'error':
          return Object.assign({}, state, {
            retrieving: false,
          })

          break

        case 'success':
          return Object.assign({}, state, {
            rescue: action.rescue,
            retrieving: false,
          })

          break

        default:
          return Object.assign({}, state, {
            retrieving: true,
          })
      }

      return newState

    default:
      return state
  }
}
