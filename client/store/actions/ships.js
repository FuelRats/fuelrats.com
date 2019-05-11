// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'




const getShip = (shipId) => createApiAction({
  actionType: actionTypes.GET_SHIP,
  url: `/ships/${shipId}`,
})

const getShips = (params) => createApiAction({
  actionType: actionTypes.GET_SHIPS,
  url: '/ships',
  params,
})

const createShip = (data) => createApiAction({
  actionType: actionTypes.CREATE_SHIP,
  url: '/ships',
  method: 'post',
  data,
})

const deleteShip = (shipId) => createApiAction({
  actionType: actionTypes.DELETE_SHIP,
  url: `/ships/${shipId}`,
  method: 'delete',
})

const updateShip = (shipId, data) => createApiAction({
  actionType: actionTypes.UPDATE_SHIP,
  url: `/ships/${shipId}`,
  method: 'put',
  data,
})





export {
  getShip,
  getShips,
  createShip,
  deleteShip,
  updateShip,
}
