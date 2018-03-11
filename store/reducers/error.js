import initialState from '../initialState'


const isDev = process.env.NODE_ENV !== 'production'


export default function (state = initialState.error, action) {
  if (action.status === 'error' && isDev) {
    console.log(action)

    return {
      ...state,
      errors: [
        ...state.errors,
        action,
      ],
      hasError: true,
    }
  }
  return state
}
