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


export const updateClient = (clientId, attributes) => {
  return frApiRequest(
    actionTypes.clients.update,
    {
      url: `/clients/${clientId}`,
      method: 'put',
      data: createRequestBody('clients', { id: clientId, attributes }),
    },
  )
}


export const regenerateSecret = (clientId) => {
  return frApiRequest(
    actionTypes.clients.regenerateSecret,
    {
      url: `/clients/${clientId}/secret`,
      method: 'post',
    },
  )
}


export const revokeClientTokens = (clientId) => {
  return frApiRequest(
    actionTypes.clients.revokeTokens,
    {
      url: `/clients/${clientId}/tokens`,
      method: 'delete',
    },
  )
}


export const deleteClient = (clientId) => {
  return frApiRequest(
    actionTypes.clients.delete,
    {
      url: `/clients/${clientId}`,
      method: 'delete',
    },
  )
}
