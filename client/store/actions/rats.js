// Component imports
import actionTypes from '../actionTypes'
import { getResourceDeletePartial } from './partials'
import { frApiRequest } from './services'



const getRats = (params) => frApiRequest(
  actionTypes.rats.search,
  {
    url: '/rats',
    params,
  },
)


const getRat = (id) => frApiRequest(
  actionTypes.rats.read,
  { url: `/rats/${id}` },
)


const createRat = (data) => frApiRequest(
  actionTypes.rats.create,
  {
    url: '/rats',
    method: 'post',
    data,
  },
)

const deleteRat = (ratId) => frApiRequest(
  actionTypes.rats.delete,
  {
    url: `/rats/${ratId}`,
    method: 'delete',
  },
  getResourceDeletePartial('rats', ratId),
)

const updateRat = (ratId, data) => frApiRequest(
  actionTypes.rats.update,
  {
    url: `/rats/${ratId}`,
    method: 'put',
    data,
  },
)





export {
  getRats,
  getRat,
  createRat,
  deleteRat,
  updateRat,
}
