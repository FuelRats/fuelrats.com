// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'





export const getRescuesByRatStatistics = () => createApiAction({
  actionType: actionTypes.GET_RESCUES_BY_RAT,
  url: '/statistics/rats',
})
