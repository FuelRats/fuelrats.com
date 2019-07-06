/* globals $IS_DEVELOPMENT:false, $IS_STAGING:false */

// Component imports
import initialState from '../initialState'
import actionTypes from '../actionTypes'




// Component constants
const IS_DEV_OR_STAGING = $IS_DEVELOPMENT || $IS_STAGING
const ignoredTypes = [

  // This pops up on every 404 page due to how our fallback system works.
  // It's not generally helpful to log
  actionTypes.GET_WORDPRESS_PAGE,
]




export default function errorReducer (state = initialState.error, action) {
  if (action.status && action.status === 'error') {
    if (!ignoredTypes.includes(action.type)) {
      console.error('ACTION ERR:', action)
    }

    if (IS_DEV_OR_STAGING) {
      return {
        ...state,
        errors: [
          ...state.errors,
          action,
        ],
        hasError: true,
      }
    }
  }
  return state
}
