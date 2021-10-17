import { isError } from 'flux-standard-action'
import { produce } from 'immer'

import safeParseInt from '~/util/safeParseInt'

import actionTypes from '../actionTypes'
import initialState from '../initialState'

const metaKey = '__decals/decrement'

export default produce((draftState, action) => {
  if (isError(action)) {
    return
  }

  switch (action.type) {
    case actionTypes.decals.redeem:
      if (action.meta[metaKey]) {
        const user = draftState[action.meta[metaKey]]
        if (user?.meta) {
          user.meta.redeemable = Math.max(safeParseInt(user.meta.redeemable) - 1, 0)
        }
      }
      break

    default:
      break
  }
}, initialState.users)



export function decrementsEligibleDecals (id) {
  return {
    [metaKey]: id,
  }
}
