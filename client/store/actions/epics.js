// Component imports
import { frApiRequest } from './services'
import actionTypes from '../actionTypes'




export const getEpic = (epicId) => frApiRequest(
  actionTypes.GET_EPIC,
  { url: `/epics/${epicId}` },
)





export const createEpic = (data) => frApiRequest(
  actionTypes.CREATE_EPIC,
  {
    url: '/epics',
    method: 'post',
    data,
  },
)
