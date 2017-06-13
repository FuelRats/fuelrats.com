import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.dialog, action) {
  switch (action.type) {
    case actionTypes.HIDE_DIALOG:
      return Object.assign({}, state, {
        body: null,
        isVisible: false,
        title: null,
      })

    case actionTypes.SHOW_DIALOG:
      return Object.assign({}, state, action.options, {
        isVisible: true,
      })

    default:
      return state
  }
}
