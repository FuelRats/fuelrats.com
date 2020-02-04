import { createSelector } from 'reselect'
import { selectUserByIdHasScope } from './groups'
import { selectRats } from './rats'
import { selectCurrentUserId, withCurrentUserId } from './session'


// Constants
const PAPERWORK_MAX_EDIT_TIME = 3600000





const selectRescues = (state) => state.rescues.rescues

const selectRescueById = (state, { rescueId }) => state.rescues[rescueId]


const selectRatsByRescueId = createSelector(
  [selectRats, selectRescueById],
  (rats, rescue) => {
    if (rats) {
      return rescue?.relationships?.rats?.data?.map((ratRef) => rats[ratRef.id]) ?? null
    }
    return null
  },
)


const selectRescueCanEdit = createSelector(
  [
    selectRescueById,
    selectRatsByRescueId,
    selectCurrentUserId,
    (state) => withCurrentUserId(selectUserByIdHasScope)(state, { scope: 'rescue.write' }),
  ],
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





export {
  selectRatsByRescueId,
  selectRescues,
  selectRescueById,
  selectRescueCanEdit,
}
