// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





export const getRatLeaderboard = (params) => {
  return frApiRequest(
    actionTypes.leaderboard.read,
    {
      url: '/leaderboard',
      params,
    },
  )
}
