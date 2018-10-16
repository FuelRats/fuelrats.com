/* globals IS_DEVELOPMENT:false, IS_STAGING:false */
import initialState from '../initialState'


const isDev = IS_DEVELOPMENT || IS_STAGING


export default function errorReducer (state = initialState.error, action) {
  if (action.status && action.status === 'error') {
    /* eslint-disable no-console */
    console.error('ACTION ERR:', action)
    /* eslint-enable no-console */

    if (isDev) {
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
