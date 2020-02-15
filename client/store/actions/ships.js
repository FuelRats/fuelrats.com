// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





export const getShip = (shipId) => {
  return frApiRequest(
    actionTypes.ships.read,
    { url: `/ships/${shipId}` },
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
      data,
    },
  )
}


export const deleteShip = (shipId) => {
  return frApiRequest(
    actionTypes.ships.delete,
    {
      url: `/ships/${shipId}`,
      method: 'delete',
    },
  )
}


export const updateShip = (shipId, data) => {
  return frApiRequest(
    actionTypes.ships.update,
    {
      url: `/ships/${shipId}`,
      method: 'put',
      data,
    },
  )
}
