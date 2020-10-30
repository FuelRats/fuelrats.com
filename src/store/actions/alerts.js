import { createFSA } from '@fuelrats/web-util/actions'

import { presentJSONAPIResource } from '~/helpers/presenters'

import actionTypes from '../actionTypes'





// Module constants
const DEFAULT_TIMEOUT_LENGTH = 1200 // 12 seconds





export function createAlert (data = {}) {
  return createFSA(
    actionTypes.alerts.create,
    presentJSONAPIResource('web-alerts', {
      alertType: 'info', // 'error', 'warn', 'info'
      timeout: DEFAULT_TIMEOUT_LENGTH,
      createdAt: (new Date()).toISOString(),
      ...data,
    }),
  )
}


export function deleteAlert (data) {
  return createFSA(
    actionTypes.alerts.delete,
    data,
  )
}
