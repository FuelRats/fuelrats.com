// Component imports
import { frApiRequest } from './services'
import actionTypes from '../actionTypes'




const getRats = (params) => frApiRequest(
  actionTypes.GET_RATS,
  {
    url: '/rats',
    params,
  }
)


const getRat = (id) => frApiRequest(
  actionTypes.GET_RAT,
  { url: `/rats/${id}` }
)


const createRat = (data) => frApiRequest(
  actionTypes.CREATE_RAT,
  {
    url: '/rats',
    method: 'post',
    data,
  }
)

const deleteRat = (ratId) => frApiRequest(
  actionTypes.DELETE_RAT,
  {
    url: `/rats/${ratId}`,
    method: 'delete',
  },
  {
    ratId,
  }
)

const updateRat = (ratId, data) => frApiRequest(
  actionTypes.UPDATE_RAT,
  {
    url: `/rats/${ratId}`,
    method: 'put',
    data,
  }
)





export {
  getRats,
  getRat,
  createRat,
  deleteRat,
  updateRat,
}
