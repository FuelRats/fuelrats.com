// Component imports
import { frApiRequest } from './services'
import actionTypes from '../actionTypes'





// eslint-disable-next-line import/prefer-default-export
export const getRatLeaderboard = () => frApiRequest(
  actionTypes.leaderboard.read,
  { url: '/statistics/rats' },
)
