// Component imports
import { frApiRequest } from './services'
import { getPageViewPartial } from './partials'
import actionTypes from '../actionTypes'





const deleteRescue = (rescueId) => frApiRequest(
  actionTypes.DELETE_RESCUE,
  {
    url: `/rescues/${rescueId}`,
    method: 'delete',
  }
)

const getRescues = (params, opts) => frApiRequest(
  actionTypes.GET_RESCUES,
  {
    url: '/rescues',
    params,
  },
  getPageViewPartial('rescues', opts.pageView)
)

const getRescue = (rescueId) => frApiRequest(
  actionTypes.GET_RESCUE,
  { url: `/rescues/${rescueId}` }
)

const updateRescue = (rescueId, data) => frApiRequest(
  actionTypes.UPDATE_RESCUE,
  {
    url: `/rescues/${rescueId}`,
    method: 'put',
    data,
  }
)

const updateRescueRats = (rescueId, data) => frApiRequest(
  actionTypes.UPDATE_RESCUE_RATS,
  {
    url: `/rescues/${rescueId}/rats`,
    method: 'patch',
    data,
  }
)



export {
  deleteRescue,
  getRescues,
  getRescue,
  updateRescue,
  updateRescueRats,
}
