// Component imports
import { frApiRequest } from './services'
import actionTypes from '../actionTypes'




const getShip = (shipId) => frApiRequest(
  actionTypes.GET_SHIP,
  { url: `/ships/${shipId}` }
)

const getShips = (params) => frApiRequest(
  actionTypes.GET_SHIPS,
  {
    url: '/ships',
    params,
  }
)

const createShip = (data) => frApiRequest(
  actionTypes.CREATE_SHIP,
  {
    url: '/ships',
    method: 'post',
    data,
  }
)

const deleteShip = (shipId) => frApiRequest(
  actionTypes.DELETE_SHIP,
  {
    url: `/ships/${shipId}`,
    method: 'delete',
  }
)

const updateShip = (shipId, data) => frApiRequest(
  actionTypes.UPDATE_SHIP,
  {
    url: `/ships/${shipId}`,
    method: 'put',
    data,
  }
)





export {
  getShip,
  getShips,
  createShip,
  deleteShip,
  updateShip,
}
