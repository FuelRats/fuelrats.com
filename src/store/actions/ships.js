// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'
import { presentApiRequestBody } from '~/helpers/presenters'





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
      data: presentApiRequestBody('ships', data),
    },
  )
}


export const deleteShip = (ship) => {
  return frApiRequest(
    actionTypes.ships.delete,
    {
      url: `/ships/${ship.id}`,
      method: 'delete',
    },
  )
}


export const updateShip = (data) => {
  return frApiRequest(
    actionTypes.ships.update,
    {
      url: `/ships/${data.id}`,
      method: 'put',
      data: presentApiRequestBody('ships', data),
    },
  )
}
