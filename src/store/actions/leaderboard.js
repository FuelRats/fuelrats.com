// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





export const getRatLeaderboard = () => {
  return frApiRequest(
    actionTypes.leaderboard.read,
    {
      url: '/leaderboard',
    },
  )
}
