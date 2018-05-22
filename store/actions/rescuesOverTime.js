// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'





export const getRescuesOverTimeStatistics = () => createApiAction({
  actionType: actionTypes.GET_RESCUES_OVER_TIME,
  url: '/statistics/rescues',
})
