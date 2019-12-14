// Component imports
import { frApiRequest } from './services'
import actionTypes from '../actionTypes'




export const getEpic = (epicId) => frApiRequest(
  actionTypes.epics.read,
  { url: `/epics/${epicId}` },
)





export const createEpic = (data) => frApiRequest(
  actionTypes.epics.create,
  {
    url: '/epics',
    method: 'post',
    data,
  },
)
