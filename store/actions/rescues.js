// Component imports
import { createApiAction, actionSeries } from '../actionCreators'
import actionTypes from '../actionTypes'





export const getRescues = () => createApiAction({
  actionType: actionTypes.GET_RESCUES,
  url: '/rescues',
})

export const getRescue = rescueId => createApiAction({
  actionType: actionTypes.GET_RESCUE,
  url: `/rescues/${rescueId}`,
})

export const updateRescueDetails = (rescueId, rescue) => createApiAction({
  actionType: actionTypes.UPDATE_RESCUE,
  url: `/rescues/${rescueId}`,
  method: 'put',
  data: rescue,
})

export const updateRescueRatsAssigned = (rescueId, data) => createApiAction({
  actionType: actionTypes.UPDATE_RESCUE_RATS_ASSIGNED,
  url: `/rescues/assign/${rescueId}`,
  method: 'put',
  data,
})

export const updateRescueRatsRemoved = (rescueId, data) => createApiAction({
  actionType: actionTypes.UPDATE_RESCUE_RATS_REMOVED,
  url: `/rescues/unassign/${rescueId}`,
  method: 'put',
  data,
})

export const updateRescue = (rescueId, rescue, rats) => {
  const actions = []

  if (rats) {
    if (rats.added.length) {
      actions.push(updateRescueRatsAssigned(rescueId, rats.added))
    }

    if (rats.removed.length) {
      actions.push(updateRescueRatsRemoved(rescueId, rats.removed))
    }
  }
  if (rescue) {
    actions.push(updateRescueDetails(rescueId, rescue))
  }

  return actionSeries(actions, false, true)
}
