import { createSelector } from 'reselect'





import { selectUserByIdHasScope } from './groups'
import { selectRats } from './rats'
import { selectCurrentUserId, withCurrentUserId } from './session'





// Constants
const PAPERWORK_MAX_EDIT_TIME = 3600000





export const selectRescues = (state) => {
  return state.rescues.rescues
}


export const selectRescueById = (state, { rescueId }) => {
  return state.rescues[rescueId]
}


export const selectRatsByRescueId = createSelector(
  [selectRats, selectRescueById],
  (rats, rescue) => {
    if (rats) {
      return rescue?.relationships?.rats?.data?.map((ratRef) => {
        return rats[ratRef.id]
      }) ?? null
    }
    return null
  },
)


export const selectUserCanEditAllRescues = (state) => {
  return withCurrentUserId(selectUserByIdHasScope)(state, { scope: 'rescue.write' })
}


export const selectUserCanEditRescue = createSelector(
  [selectRescueById, selectRatsByRescueId, selectCurrentUserId, selectUserCanEditAllRescues],
  (rescue, rescueRats, userId, userCanEditAllRescues) => {
    if (!rescue || !userId) {
      return false
    }

    // Check if user has permission to edit all paperwork.
    if (userCanEditAllRescues) {
      return true
    }

    // Check if current user is assigned to case.
    const usersAssignedRats = rescueRats?.reduce(
      (acc, rat) => {
        if (rat.attributes.userId === userId) {
          return [...acc, rat]
        }
        return acc
      },
      []
    )

    if (usersAssignedRats.length) {
      return true
    }

    // Check if the paperwork is not yet time locked
    if ((new Date()).getTime() - (new Date(rescue.attributes.createdAt)).getTime() <= PAPERWORK_MAX_EDIT_TIME) {
      return true
    }

    // None of the conditions are met, user cannot edit paperwork
    return false
  },
)
