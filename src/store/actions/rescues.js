// Component imports
import actionTypes from '../actionTypes'
import { getPageViewPartial } from './partials'
import { frApiRequest } from './services'
import { presentApiRequestBody } from '~/helpers/presenters'




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
    {
      url: `/rescues/${rescueId}`,
    },
  )
}


export const updateRescue = (data) => {
  return frApiRequest(
    actionTypes.rescues.update,
    {
      url: `/rescues/${data.id}`,
      method: 'put',
      data: presentApiRequestBody('rescues', data),
    },
  )
}
