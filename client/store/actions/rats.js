// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'




const getRats = (params) => createApiAction({
  actionType: actionTypes.GET_RATS,
  url: '/rats',
  params,
})


const getRat = (id) => createApiAction({
  actionType: actionTypes.GET_RAT,
  url: `/rats/${id}`,
})


const createRat = (data) => createApiAction({
  actionType: actionTypes.CREATE_RAT,
  url: '/rats',
  method: 'post',
  data,
})

const deleteRat = (ratId) => createApiAction({
  actionType: actionTypes.DELETE_RAT,
  url: `/rats/${ratId}`,
  method: 'delete',
})

const updateRat = (ratId, data) => createApiAction({
  actionType: actionTypes.UPDATE_RAT,
  url: `/rats/${ratId}`,
  method: 'put',
  data,
})





export {
  getRats,
  getRat,
  createRat,
  deleteRat,
  updateRat,
}
