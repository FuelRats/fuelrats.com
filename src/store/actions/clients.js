import createRequestBody from '~/util/jsonapi/createRequestBody'

import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





export const getClients = (params) => {
  return frApiRequest(
    actionTypes.clients.search,
    {
      url: '/clients',
      params,
    },
  )
}


export const createClient = (data) => {
  return frApiRequest(
    actionTypes.clients.create,
    {
      url: '/clients',
      method: 'post',
      data: createRequestBody('clients', data),
    },
  )
}
