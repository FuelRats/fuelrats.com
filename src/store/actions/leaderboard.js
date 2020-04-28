// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





// eslint-disable-next-line import/prefer-default-export
export const getRatLeaderboard = () => {
  return frApiRequest(
    actionTypes.leaderboard.read,
    {
      url: '/leaderboard',
    },
  )
}
