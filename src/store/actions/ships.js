import { defineRelationship } from '@fuelrats/web-util/redux-json-api'

import createRequestBody from '~/util/jsonapi/createRequestBody'



import actionTypes from '../actionTypes'
import { createsRelationship, RESOURCE, deletesResource, deletesRelationship } from '../reducers/frAPIResources'
import { frApiRequest } from './services'





export const getShip = (shipId) => {
  return frApiRequest(
    actionTypes.ships.read,
    {
      url: `/ships/${shipId}`,
    },
  )
}


export const getShips = (params) => {
  return frApiRequest(
    actionTypes.ships.search,
    {
      url: '/ships',
      params,
    },
  )
}


export const createShip = (data) => {
  return frApiRequest(
    actionTypes.ships.create,
    {
      url: '/ships',
      method: 'post',
      data: createRequestBody('ships', data),
    },
    createsRelationship(
      defineRelationship(data.relationships?.rat?.data, { ships: [RESOURCE] }),
    ),
  )
}


export const deleteShip = (ship) => {
  return frApiRequest(
    actionTypes.ships.delete,
    {
      url: `/ships/${ship.id}`,
      method: 'delete',
    },
    deletesResource(ship),
    deletesRelationship(
      defineRelationship(ship.relationships?.rat?.data, { ships: [ship] }),
    ),
  )
}


export const updateShip = (data) => {
  return frApiRequest(
    actionTypes.ships.update,
    {
      url: `/ships/${data.id}`,
      method: 'put',
      data: createRequestBody('ships', data),
    },
  )
}
