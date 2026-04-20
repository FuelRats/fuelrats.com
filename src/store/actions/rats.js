import { defineRelationship } from '@fuelrats/web-util/redux-json-api'

import createRequestBody from '~/util/jsonapi/createRequestBody'


import actionTypes from '../actionTypes'
import { frApiRequest } from './services'
import {
  createsRelationship,
  deletesRelationship,
  deletesResource,
  RESOURCE,
} from '../reducers/frAPIResources'





export const getRats = (params) => {
  return frApiRequest(
    actionTypes.rats.search,
    {
      url: '/rats',
      params,
    },
  )
}


export const getRat = (id) => {
  return frApiRequest(
    actionTypes.rats.read,
    {
      url: `/rats/${id}`,
    },
  )
}


export const createRat = (data) => {
  return frApiRequest(
    actionTypes.rats.create,
    {
      url: '/rats',
      method: 'post',
      data: createRequestBody('rats', data),
    },
    createsRelationship(
      defineRelationship(data.relationships?.user?.data, { rats: [RESOURCE] }),
    ),
  )
}


export const deleteRat = (user, rat) => {
  return frApiRequest(
    actionTypes.rats.delete,
    {
      url: `/rats/${rat.id}`,
      method: 'delete',
    },
    deletesResource(rat),
    deletesRelationship(
      defineRelationship(
        { type: 'users', id: user.id },
        { rats: [{ type: 'rats', id: rat.id }] },
      ),
    ),
  )
}




export const updateRat = (data) => {
  return frApiRequest(
    actionTypes.rats.update,
    {
      url: `/rats/${data.id}`,
      method: 'put',
      data: createRequestBody('rats', data),
    },
  )
}


export const reassignRat = (ratId, newUserId) => {
  return frApiRequest(
    actionTypes.rats.update,
    {
      url: `/rats/${ratId}/relationships/user`,
      method: 'patch',
      data: { data: { type: 'users', id: newUserId } },
    },
  )
}


export const transferRescues = (sourceRatId, targetRatId) => {
  return frApiRequest(
    actionTypes.rats.update,
    {
      url: `/rats/${sourceRatId}/transfer`,
      method: 'post',
      data: createRequestBody('rat-transfers', { targetRatId }),
    },
  )
}
