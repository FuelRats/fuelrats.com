import { createFSA } from '@fuelrats/web-util/actions'
import UUID from 'pure-uuid'

import { presentJSONAPIResource } from '~/helpers/presenters'

import actionTypes from '../actionTypes'





// Module constants
const DEFAULT_TIMEOUT_LENGTH = 1200 // 12 seconds
const UUID_VERSION_4 = 4




export function createAlert (data = {}) {
  return createFSA(
    actionTypes.alerts.create,
    presentJSONAPIResource('web-alerts', {
      alertType: 'info', // 'success', 'info', 'warn', 'error'
      timeout: DEFAULT_TIMEOUT_LENGTH,
      createdAt: (new Date()).toISOString(),
      ...data,
      id: data.id ?? (new UUID(UUID_VERSION_4)).format(),
    }),
  )
}


export function deleteAlert (data) {
  return createFSA(
    actionTypes.alerts.delete,
    data,
  )
}
