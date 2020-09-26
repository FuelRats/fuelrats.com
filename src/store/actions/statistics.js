// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





export const getLeaderboard = (params) => {
  return frApiRequest(
    actionTypes.leaderboard.read,
    {
      url: '/leaderboard',
      params,
    },
  )
}


export const getUserStatistics = (userId) => {
  return frApiRequest(
    actionTypes.users.statistics.read,
    {
      url: `/users/${userId}/statistics`,
    },

  )
}
