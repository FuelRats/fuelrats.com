// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





// eslint-disable-next-line import/prefer-default-export
export const getRatLeaderboard = () => frApiRequest(
  actionTypes.leaderboard.read,
  { url: '/statistics/rats' },
)
