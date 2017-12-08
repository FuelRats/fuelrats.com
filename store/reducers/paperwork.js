import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.paperwork, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.SUBMIT_PAPERWORK:
      switch (status) {
        case 'error':
          return Object.assign({}, state, {
            submitting: false,
          })

        case 'success':
          return Object.assign({}, state, {
            rescueId: payload.data[0].id,
            submitting: false,
          })

        default:
          return Object.assign({}, state, {
            submitting: true,
          })
      }

    case actionTypes.RETRIEVE_PAPERWORK:
      switch (status) {
        case 'error':
          return Object.assign({}, state, {
            rescueId: null,
            retrieving: false,
          })

        case 'success':
          return Object.assign({}, state, {
            rescueId: payload.data[0].id,
            retrieving: false,
          })

        default:
          return Object.assign({}, state, {
            retrieving: true,
          })
      }

    default:
      return state
  }
}
