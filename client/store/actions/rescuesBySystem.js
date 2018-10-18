// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'




/* eslint-disable import/prefer-default-export */
// prefer export member for consistency
export const getRescuesBySystemStatistics = () => createApiAction({
  actionType: actionTypes.GET_RESCUES_BY_SYSTEM,
  url: '/statistics/systems?count.gt=50',
})
