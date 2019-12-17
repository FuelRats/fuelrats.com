// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'




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
