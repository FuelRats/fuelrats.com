import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.dialog, action) {
  switch (action.type) {
    case actionTypes.DIALOG:
      if (action.visible) {
        return Object.assign({}, state, action.options, {
          isVisible: true,
        })
      }

      return Object.assign({}, state, {
        body: null,
        isVisible: false,
        title: null,
      })

    default:
      return state
  }
}
