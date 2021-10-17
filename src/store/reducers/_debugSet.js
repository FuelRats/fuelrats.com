import { produce } from 'immer'
import _set from 'lodash/set'

/**
 * This is a debug module for injecting arbitrary data in any location.
 * @param {object} state Current redux state
 * @param {object} action Redux action
 * @param {string} action.type `'unsafe/set'`
 * @param {[string, any]} action.payload lodash set path/value
 * @returns {object} next redux state
 */
export default function _debugSet (state, action) {
  if (action.type === 'unsafe/set') {
    return produce(state, (draftState) => {
      _set(draftState, ...action.payload)
    })
  }
  return state
}
