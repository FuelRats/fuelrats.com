import { createSelector } from 'reselect'





const selectLeaderboardLoading = (state) => state.leaderboard.loading


const selectLeaderboard = createSelector(
  (state) => state.leaderboard.statistics,
  (stats) => stats.filter((rat) => rat.attributes.rescueCount > 0),
)





export {
  selectLeaderboard,
  selectLeaderboardLoading,
}
