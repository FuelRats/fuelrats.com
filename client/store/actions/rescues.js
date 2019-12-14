// Component imports
import { frApiRequest } from './services'
import { getPageViewPartial } from './partials'
import actionTypes from '../actionTypes'





const deleteRescue = (rescueId) => frApiRequest(
  actionTypes.rescues.delete,
  {
    url: `/rescues/${rescueId}`,
    method: 'delete',
  },
)

const getRescues = (params, opts) => frApiRequest(
  actionTypes.rescues.search,
  {
    url: '/rescues',
    params,
  },
  getPageViewPartial('rescues', opts.pageView),
)

const getRescue = (rescueId) => frApiRequest(
  actionTypes.rescues.read,
  { url: `/rescues/${rescueId}` },
)

const updateRescue = (rescueId, data) => frApiRequest(
  actionTypes.rescues.update,
  {
    url: `/rescues/${rescueId}`,
    method: 'put',
    data,
  },
)

const updateRescueRats = (rescueId, data) => frApiRequest(
  actionTypes.rescues.patchRats,
  {
    url: `/rescues/${rescueId}/rats`,
    method: 'patch',
    data,
  },
)



export {
  deleteRescue,
  getRescues,
  getRescue,
  updateRescue,
  updateRescueRats,
}
