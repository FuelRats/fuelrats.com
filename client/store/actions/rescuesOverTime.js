// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'




/* eslint-disable import/prefer-default-export */
// prefer export member for consistency
export const getRescuesOverTimeStatistics = () => createApiAction({
  actionType: actionTypes.GET_RESCUES_OVER_TIME,
  url: '/statistics/rescues',
})
