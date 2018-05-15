// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'





export const retrievePaperwork = rescueId => createApiAction({
  actionType: actionTypes.RETRIEVE_PAPERWORK,
  url: `/api/rescues/${rescueId}`,
})

export const submitPaperworkDetails = (rescueId, rescue) => createApiAction({
  actionType: actionTypes.SUBMIT_PAPERWORK,
  url: `/api/rescues/${rescueId}`,
  method: 'put',
  data: JSON.stringify(rescue),
})

export const submitPaperworkRatsAssigned = (rescueId, rats) => createApiAction({
  actionType: actionTypes.SUBMIT_PAPERWORK_RATS_ASSIGNED,
  url: `/api/rescues/assign/${rescueId}`,
  method: 'put',
  data: JSON.stringify(rats.map(rat => rat.id)),
})

export const submitPaperworkRatsRemoved = (rescueId, rats) => createApiAction({
  actionType: actionTypes.SUBMIT_PAPERWORK_RATS_REMOVED,
  url: `/api/rescues/unassign/${rescueId}`,
  method: 'put',
  data: JSON.stringify(rats.map(rat => rat.id)),
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
}
