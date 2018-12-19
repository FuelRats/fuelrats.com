// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'




export const retrieveEpic = (epicId) => createApiAction({
  actionType: actionTypes.RETRIEVE_EPIC,
  url: `/epics/${epicId}`,
})





export const createEpic = (data) => createApiAction({
  actionType: actionTypes.CREATE_EPIC,
  url: '/epics',
  method: 'post',
  data,
})
