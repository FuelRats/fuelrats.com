import createRequestBody from '~/util/jsonapi/createRequestBody'

import actionTypes from '../actionTypes'
import { frApiRequest } from './services'



export const getEpic = (epicId) => {
  return frApiRequest(
    actionTypes.epics.read,
    { url: `/epics/${epicId}` },
  )
}





export const createEpic = (data) => {
  return frApiRequest(
    actionTypes.epics.create,
    {
      url: '/epics',
      method: 'post',
      data: createRequestBody('epics', data),
    },
  )
}
