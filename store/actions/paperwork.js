// Component imports
import { createApiAction, actionSeries } from '../actionCreators'
import actionTypes from '../actionTypes'





export const retrievePaperwork = rescueId => createApiAction({
  actionType: actionTypes.RETRIEVE_PAPERWORK,
  url: `/rescues/${rescueId}`,
})

export const submitPaperworkDetails = (rescueId, rescue) => createApiAction({
  actionType: actionTypes.SUBMIT_PAPERWORK,
  url: `/rescues/${rescueId}`,
  method: 'put',
  data: rescue,
})

export const submitPaperworkRatsAssigned = (rescueId, rats) => createApiAction({
  actionType: actionTypes.SUBMIT_PAPERWORK_RATS_ASSIGNED,
  url: `/rescues/assign/${rescueId}`,
  method: 'put',
  data: rats.map(rat => rat.id),
})

export const submitPaperworkRatsRemoved = (rescueId, rats) => createApiAction({
  actionType: actionTypes.SUBMIT_PAPERWORK_RATS_REMOVED,
  url: `/rescues/unassign/${rescueId}`,
  method: 'put',
  data: rats.map(rat => rat.id),
})

export const submitPaperwork = (rescueId, rescue, rats) => {
  const actions = []

  if (rats) {
    if (rats.added.length) {
      actions.push(submitPaperworkRatsAssigned(rescueId, rats.added))
    }

    if (rats.removed.length) {
      actions.push(submitPaperworkRatsAssigned(rescueId, rats.removed))
    }
  }

  if (rescue) {
    actions.push(submitPaperworkDetails(rescueId, rescue))
  }

  return actionSeries(actions)
}
