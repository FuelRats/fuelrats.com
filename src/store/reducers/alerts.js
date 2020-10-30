import { produce } from 'immer'
import { isError } from 'lodash'

import actionTypes from '../actionTypes'
import initialState from '../initialState'




const reduceAlerts = produce((draftState, action) => {
  if (isError(action)) {
    return undefined
  }

  switch (action.type) {
    case actionTypes.alerts.create:
      draftState.push(action.payload)
      break

    case actionTypes.alerts.delete: {
      const index = draftState.findIndex((alert) => {
        return alert.id === action.payload.id
      })
      if (index >= 0) {
        draftState.splice(index, 1)
      }
    }
      break

    default:
      break
  }

  return undefined
}, initialState.alerts)



export default reduceAlerts
