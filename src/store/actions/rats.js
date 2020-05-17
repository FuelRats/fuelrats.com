// Component imports
import actionTypes from '../actionTypes'
import { getResourceDeletePartial } from './partials'
import { frApiRequest } from './services'
import { presentApiRequestBody } from '~/helpers/presenters'



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
    {
      url: `/rats/${id}`,
    },
  )
}


export const createRat = (data) => {
  return frApiRequest(
    actionTypes.rats.create,
    {
      url: '/rats',
      method: 'post',
      data: presentApiRequestBody('rats', data),
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


export const updateRat = (data) => {
  return frApiRequest(
    actionTypes.rats.update,
    {
      url: `/rats/${data.id}`,
      method: 'put',
      data: presentApiRequestBody('rats', data),
    },
  )
}
