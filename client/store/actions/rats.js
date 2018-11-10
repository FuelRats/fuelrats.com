// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'




/* eslint-disable import/prefer-default-export */
// prefer export member for consistency
export const createRat = (name, platform, userId) => createApiAction({
  actionType: actionTypes.CREATE_RAT,
  url: '/rats',
  method: 'post',
  data: {
    name,
    platform,
    userId,
  },
})
