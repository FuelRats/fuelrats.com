import { createSelector } from 'reselect'

import { selectRescues } from './rescues'


export const selectDispatch = (state) => {
  return state.dispatch
}
export const selectDispatchBoard = (state) => {
  return state.dispatch.board
}


export const selectDispatchRescues = createSelector(
  [selectDispatchBoard, selectRescues],
  (board, rescues) => {
    return board.map((rId) => {
      return rescues[rId]
    })
  },
)
