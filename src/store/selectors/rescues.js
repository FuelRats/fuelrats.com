import { createCachedSelector } from 're-reselect'





import { selectRats } from './rats'
import { selectCurrentUserId } from './session'
import { selectCurrentUserHasScope } from './users'





// Constants
const RESCUE_ACCESS_HOURS = 3
const PAPERWORK_MAX_EDIT_TIME = RESCUE_ACCESS_HOURS * 60 * 60 * 1000

// Stable empty values keep selector outputs referentially equal across
// store updates so downstream memoization doesn't bust on every dispatch.
const EMPTY_ARRAY = Object.freeze([])


const getRescueId = (_, props) => {
  return props.rescueId
}



export const selectRescues = (state) => {
  return state.rescues.rescues
}


export const selectRescueById = (state, props = {}) => {
  return state.rescues[props.rescueId]
}

export const selectRescueRatRelationship = (state, props) => {
  const rescue = selectRescueById(state, props)

  if (!rescue || !rescue.relationships?.rats) {
    return undefined
  }

  return rescue.relationships.rats.data ?? EMPTY_ARRAY
}

export const selectRatsByRescueId = createCachedSelector(
  [selectRats, selectRescueRatRelationship],
  (rats, rescueRats) => {
    if (rats) {
      return rescueRats?.reduce((acc, ratRef) => {
        const rat = rats[ratRef.id]
        if (rat) {
          acc.push(rat)
        }
        return acc
      }, []) ?? undefined
    }
    return undefined
  },
)(getRescueId)


export const selectCurrentUserCanEditAllRescues = (state) => {
  return selectCurrentUserHasScope(state, { scope: 'rescues.write' })
}


const selectCurrentUserHasWriteMeScope = (state) => {
  return selectCurrentUserHasScope(state, { scope: 'rescues.write.me' })
}

const selectCurrentUserHasDispatchWriteScope = (state) => {
  return selectCurrentUserHasScope(state, { scope: 'dispatch.write' })
}

export const selectCurrentUserCanEditRescue = createCachedSelector(
  [
    selectRescueById, selectRatsByRescueId, selectCurrentUserId,
    selectCurrentUserCanEditAllRescues, selectCurrentUserHasWriteMeScope, selectCurrentUserHasDispatchWriteScope,
  ],
  (rescue, rescueRats, userId, userCanEditAllRescues, userHasWriteMe, userHasDispatchWrite) => {
    if (!rescue || !userId) {
      return false
    }

    // Check if user has permission to edit all rescues (rescues.write scope)
    if (userCanEditAllRescues) {
      return true
    }

    // Check if current user is assigned to this rescue
    const isAssigned = rescueRats?.some((rat) => {
      return rat.relationships.user?.data?.id === userId
    })

    // Check if current user is first limpet
    const isFirstLimpet = rescue.relationships.firstLimpet?.data
      && rescueRats?.some((rat) => {
        return rat.id === rescue.relationships.firstLimpet.data.id
          && rat.relationships.user?.data?.id === userId
      })

    // Assigned users or first limpet can always edit their own rescues
    if ((isAssigned || isFirstLimpet) && userHasWriteMe) {
      return true
    }

    // Open rescues can be edited by anyone with rescues.write.me
    if (rescue.attributes.status !== 'closed' && userHasWriteMe) {
      return true
    }

    // Closed rescues within time limit can be edited by dispatchers (based on updatedAt)
    if (rescue.attributes.status === 'closed'
      && userHasDispatchWrite
      && (Date.now() - new Date(rescue.attributes.updatedAt).getTime()) <= PAPERWORK_MAX_EDIT_TIME) {
      return true
    }

    return false
  },
)(getRescueId)

export const selectRescueUnidentifiedRats = (state, props) => {
  return selectRescueById(state, props)?.attributes.unidentifiedRats ?? undefined
}

export const createSelectRenderedRatList = (renderer) => {
  return createCachedSelector(
    [selectRatsByRescueId, selectRescueUnidentifiedRats],
    (rats = [], unidentifiedRats = []) => {
      return rats.concat(unidentifiedRats).map((rat, ...args) => {
        // Unidentified rats are a string, so lets make that a resource-like object
        if (typeof rat === 'string') {
          return renderer({
            id: rat,
            type: 'unidentified-rats',
            attributes: {
              name: rat,
            },
          }, ...args)
        }

        return renderer(rat, ...args)
      })
    },
  )(getRescueId)
}
