/* globals $IS_DEVELOPMENT:false, $IS_STAGING:false */
// Module imports
import { isError } from 'flux-standard-action'
import { produce } from 'immer'



// Component imports
import actionTypes from '../actionTypes'
import initialState from '../initialState'





// Component constants
const IS_DEV_OR_STAGING = $IS_DEVELOPMENT || $IS_STAGING
const ignoredTypes = [
  // This pops up on every 404 page due to how our fallback system works.
  // It's not generally helpful to log
  actionTypes.wordpress.pages.read,
]




// TODO turn into middleware
const errorReducer = produce((draftState, action) => {
  if (isError(action)) {
    if (!ignoredTypes.includes(action.type)) {
      console.error('GIVE THIS TO YOUR TECHRAT:', action)
    }

    if (IS_DEV_OR_STAGING) {
      draftState.errors.push(action)
      draftState.hasError = true
    }
  }
}, initialState.error)





export default errorReducer
