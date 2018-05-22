// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'





export const getRescuesBySystemStatistics = () => createApiAction({
  actionType: actionTypes.GET_RESCUES_BY_SYSTEM,
  url: '/statistics/systems?count.gt=10',
})
