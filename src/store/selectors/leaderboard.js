import { createSelector } from 'reselect'





const selectLeaderboardStatistics = (state) => {
  return state.leaderboard.statistics
}


export const selectLeaderboardLoading = (state) => {
  return state.leaderboard.loading
}


export const selectLeaderboard = createSelector(
  [selectLeaderboardStatistics],
  (statistics) => {
    return statistics.filter((rat) => {
      return rat.attributes.rescueCount > 0
    })
  },
)
