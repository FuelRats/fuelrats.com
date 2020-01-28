import { createSelector } from 'reselect'
import { selectUserByIdHasScope } from './groups'
import { selectCurrentUserId, withCurrentUserId } from './session'



// Constants
const PAPERWORK_MAX_EDIT_TIME = 3600000





const selectRescues = (state) => state.rescues.rescues

const selectRescueById = (state, { rescueId }) => state.rescues[rescueId]

const selectRescueCanEdit = createSelector(
  [
    selectRescueById,
    selectCurrentUserId,
    (state) => withCurrentUserId(selectUserByIdHasScope)(state, { scope: 'rescue.write' }),
  ],
  (rescue, userId, userCanEditAllRescues) => {
    if (!rescue || !userId) {
      return false
    }

    // Check if user has permission to edit all paperwork.
    if (userCanEditAllRescues) {
      return true
    }

    // Check if current user is assigned to case.
    const usersAssignedRats = rescue.relationships.rats.data?.reduce(
      (acc, rat) => {
        if (rat.attributes.userId === userId) {
          return [...acc, rat]
        }
        return acc
      }
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
  selectRescues,
  selectRescueById,
  selectRescueCanEdit,
}
