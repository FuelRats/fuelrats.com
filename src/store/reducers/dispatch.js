import { produce } from 'immer'

import actionTypes from '../actionTypes'
import initialState from '../initialState'


const DISPATCH_VIEW = '__dispatch_board'


const dispatchReducer = produce((draft, action) => {
  switch (action.type) {
    case actionTypes.rescues.search:
      if (action.meta[DISPATCH_VIEW]) {
        draft.board = action.payload.data.map((rescue) => {
          return rescue.id
        })
      }
      break

    default:
      break
  }
}, initialState.dispatch)

export default dispatchReducer
export {
  DISPATCH_VIEW,
}
