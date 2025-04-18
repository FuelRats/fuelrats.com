import actionTypes from '../actionTypes'
import { frApiRequest } from './services'



export const getLeaderboard = (params) => {
  return async (dispatch) => {
    const action = await dispatch(frApiRequest(
      actionTypes.leaderboard.read,
      {
        url: '/leaderboard',
        params,
      },
    ))

    return action
  }
}


export const getUserStatistics = (userId) => {
  return frApiRequest(
    actionTypes.users.statistics.read,
    {
      url: `/users/${userId}/statistics`,
    },

  )
}
