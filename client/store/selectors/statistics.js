import { createSelector } from 'reselect'





const selectRescuesByRatLoading = (state) => state.rescuesByRat.loading


const selectRescuesByRatStatistics = createSelector(
  (state) => state.rescuesByRat.statistics,
  (stats) => stats.filter((rat) => rat.attributes.rescueCount > 0),
)


const selectRescuesBySystemLoading = (state) => state.rescuesBySystem.loading


const selectRescuesBySystemStatistics = (state) => state.rescuesBySystem.statistics


const selectRescuesOverTimeLoading = (state) => state.rescuesOverTime.loading


const selectRescuesOverTimeStatistics = (state) => state.rescuesOverTime.statistics





export {
  selectRescuesByRatLoading,
  selectRescuesByRatStatistics,
  selectRescuesBySystemLoading,
  selectRescuesBySystemStatistics,
  selectRescuesOverTimeLoading,
  selectRescuesOverTimeStatistics,
}
