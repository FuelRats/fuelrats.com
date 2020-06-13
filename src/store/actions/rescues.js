// Component imports
import actionTypes from '../actionTypes'
import { deletesResource } from '../reducers/frAPIResources'
import { getPageViewPartial } from './partials'
import { frApiRequest } from './services'
import { presentApiRequestBody } from '~/helpers/presenters'




export const deleteRescue = (rescue) => {
  return frApiRequest(
    actionTypes.rescues.delete,
    {
      url: `/rescues/${rescue.id}`,
      method: 'delete',
    },
    deletesResource(rescue),
  )
}


// TODO: redo page views
export const getRescues = (params, opts = {}) => {
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
