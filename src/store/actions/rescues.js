// Component imports
import actionTypes from '../actionTypes'
import { getPageViewPartial } from './partials'
import { frApiRequest } from './services'





export const deleteRescue = (rescueId) => {
  return frApiRequest(
    actionTypes.rescues.delete,
    {
      url: `/rescues/${rescueId}`,
      method: 'delete',
    },
  )
}


export const getRescues = (params, opts) => {
  return frApiRequest(
    actionTypes.rescues.search,
    {
      url: '/rescues',
      params,
    },
    getPageViewPartial('rescues', opts.pageView),
  )
}


export const getRescue = (rescueId) => {
  return frApiRequest(
    actionTypes.rescues.read,
    { url: `/rescues/${rescueId}` },
  )
}


export const updateRescue = (rescueId, data) => {
  return frApiRequest(
    actionTypes.rescues.update,
    {
      url: `/rescues/${rescueId}`,
      method: 'put',
      data,
    },
  )
}


export const updateRescueRats = (rescueId, data) => {
  return frApiRequest(
    actionTypes.rescues.patchRats,
    {
      url: `/rescues/${rescueId}/rats`,
      method: 'patch',
      data,
    },
  )
}
