import { defineRelationship } from '@fuelrats/web-util/redux-json-api'

import createRequestBody from '~/util/jsonapi/createRequestBody'


import actionTypes from '../actionTypes'
import {
  createsRelationship,
  deletesRelationship,
  deletesResource,
  RESOURCE,
} from '../reducers/frAPIResources'
import { frApiRequest } from './services'





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


export const deleteRat = (rat) => {
  return frApiRequest(
    actionTypes.rats.delete,
    {
      url: `/rats/${rat.id}`,
      method: 'delete',
    },
    deletesResource(rat),
    deletesRelationship(
      defineRelationship(rat.relationships?.user?.data?.id, { rats: [rat] }),
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
