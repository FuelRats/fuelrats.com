import { createSelector } from 'reselect'
import userHasPermission from '../../helpers/userHasPermission'
import { selectGroupsByUserId } from './groups'
import { selectCurrentUserId, withCurrentUserId } from './session'



// Constants
const PAPERWORK_MAX_EDIT_TIME = 3600000





const selectRescues = (state) => state.rescues.rescues

const selectRescueById = (state, { rescueId }) => state.rescues[rescueId]

const selectRescueCanEdit = createSelector(
  [selectRescueById, selectCurrentUserId, withCurrentUserId(selectGroupsByUserId)],
  (rescue, userId, userGroups) => {
    if (!rescue || !userId) {
      return false
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

    // Check if user has the permission to edit the paperwork anyway
    if (userGroups.length && userHasPermission(userGroups, 'rescue.write')) {
      return true
    }

    return false
  },
)





export {
  selectRescues,
  selectRescueById,
  selectRescueCanEdit,
}
