// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'





// eslint-disable-next-line import/prefer-default-export
export const getRatLeaderboard = () => createApiAction({
  actionType: actionTypes.GET_RAT_LEADERBOARD,
  url: '/statistics/rats',
})
