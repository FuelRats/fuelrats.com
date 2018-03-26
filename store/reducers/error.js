import initialState from '../initialState'


const isDev = preval`module.exports = process.env.NODE_ENV !== 'production' || ['develop', 'beta'].includes(process.env.TRAVIS_BRANCH)`


export default function (state = initialState.error, action) {
  if (action.status && action.status !== 'success') {
    console.error('ACTION ERR:', action)

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
