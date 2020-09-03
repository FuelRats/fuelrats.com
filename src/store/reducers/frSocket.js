import { SOCKET_OPEN, SOCKET_CLOSE } from '@fuelrats/web-util/redux-ratsocket'
import { isError } from 'flux-standard-action'
import { produce } from 'immer'

import unshiftSplice from '~/helpers/unshiftSplice'
import frSocket from '~/services/frSocket'

import initialState from '../initialState'





const CLOSED_RESCUE_LIMIT = 5

const updateRescue = produce((draft, action) => {
  if (isError(action) || !action.payload?.data) {
    return
  }

  const rescue = action.payload.data
  const rescueOnBoard = draft.dispatch.board.includes(rescue.id)

  if (rescue.attributes.status === 'closed') {
    if (rescueOnBoard) {
      draft.dispatch.board.splice(draft.dispatch.board.indexOf(rescue.id), 1)
      unshiftSplice(draft.dispatch.closed, CLOSED_RESCUE_LIMIT, rescue.id).forEach((removedRescue) => {
        delete draft.rescues[removedRescue]
      })
    }
  } else if (!rescueOnBoard) {
    draft.dispatch.board.unshift(rescue.id)
  }
})

const deleteRescue = produce((draft, action) => {
  const rescueId = action.payload.data.id

  delete draft.rescues[rescueId]

  if (draft.dispatch.board.includes(rescueId)) {
    draft.dispatch.board.splice(draft.dispatch.board.indexOf(rescueId), 1)
  }
})

export default frSocket.createReducer({
  [SOCKET_OPEN]: produce((draft) => {
    draft.dispatch.connected = true
    draft.dispatch.error = false
  }),

  [SOCKET_CLOSE]: produce((draft, action) => {
    draft.dispatch.connected = false
    draft.dispatch.error = !action.payload.wasClean
  }),

  'fuelrats.rescuedelete': deleteRescue,
  'fuelrats.rescuecreate': updateRescue,
  'fuelrats.rescueupdate': updateRescue,
}, initialState)
