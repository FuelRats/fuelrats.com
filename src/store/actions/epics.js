// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'
import { presentApiRequestBody } from '~/helpers/presenters'



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
      data: presentApiRequestBody('epics', data),
    },
  )
}
