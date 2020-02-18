// Component imports
import actionTypes from '../actionTypes'
import { getResourceDeletePartial } from './partials'
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
    { url: `/rats/${id}` },
  )
}


export const createRat = (data) => {
  return frApiRequest(
    actionTypes.rats.create,
    {
      url: '/rats',
      method: 'post',
      data,
    },
  )
}


export const deleteRat = (ratId) => {
  return frApiRequest(
    actionTypes.rats.delete,
    {
      url: `/rats/${ratId}`,
      method: 'delete',
    },
    getResourceDeletePartial('rats', ratId),
  )
}


export const updateRat = (ratId, data) => {
  return frApiRequest(
    actionTypes.rats.update,
    {
      url: `/rats/${ratId}`,
      method: 'put',
      data,
    },
  )
}
