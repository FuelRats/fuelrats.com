/**
 * Provides default reducers to combineReducers(). Removes the need to define reducers for every state member.
 */
const withDefaultReducers = (combineReducers) => (initialState, sliceReducers) => {
  const defaultReducers = Object.entries(initialState).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: (state = value) => state,
  }), {})



  return combineReducers({
    ...defaultReducers,
    ...sliceReducers,
  })
}





export default withDefaultReducers
