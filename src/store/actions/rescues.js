import { presentApiRequestBody } from '~/helpers/presenters'

import actionTypes from '../actionTypes'
import { DISPATCH_VIEW } from '../reducers/dispatch'
import { deletesResource } from '../reducers/frAPIResources'
import { frApiRequest } from './services'




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



export const getRescues = (params, ...meta) => {
  return frApiRequest(
    actionTypes.rescues.search,
    {
      url: '/rescues',
      params,
    },
    ...meta,
  )
}


export const getDispatchBoard = () => {
  return getRescues(
    {
      filter: {
        status: { ne: 'closed' },
      },
    },
    { [DISPATCH_VIEW]: true },
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
