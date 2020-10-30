import { createSelector } from 'reselect'

const ACTIVE_ALERT_LIMIT = 5


export const selectAlerts = (state) => {
  return state.alerts
}

export const selectActiveAlerts = createSelector(
  [selectAlerts],
  (alerts) => {
    return [alerts.slice(0, ACTIVE_ALERT_LIMIT), Math.max(alerts.length - ACTIVE_ALERT_LIMIT, 0)]
  },
)
