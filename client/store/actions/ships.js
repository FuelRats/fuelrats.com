// Component imports
import { frApiRequest } from './services'
import actionTypes from '../actionTypes'




const getShip = (shipId) => frApiRequest(
  actionTypes.ships.read,
  { url: `/ships/${shipId}` },
)

const getShips = (params) => frApiRequest(
  actionTypes.ships.search,
  {
    url: '/ships',
    params,
  },
)

const createShip = (data) => frApiRequest(
  actionTypes.ships.create,
  {
    url: '/ships',
    method: 'post',
    data,
  },
)

const deleteShip = (shipId) => frApiRequest(
  actionTypes.ships.delete,
  {
    url: `/ships/${shipId}`,
    method: 'delete',
  },
)

const updateShip = (shipId, data) => frApiRequest(
  actionTypes.ships.update,
  {
    url: `/ships/${shipId}`,
    method: 'put',
    data,
  },
)





export {
  getShip,
  getShips,
  createShip,
  deleteShip,
  updateShip,
}
