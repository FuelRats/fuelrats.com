// Component imports
import { frApiRequest } from './services'
import actionTypes from '../actionTypes'





// eslint-disable-next-line import/prefer-default-export
export const getRatLeaderboard = () => frApiRequest(
  actionTypes.GET_RAT_LEADERBOARD,
  { url: '/statistics/rats' },
)
