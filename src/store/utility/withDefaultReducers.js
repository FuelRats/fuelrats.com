/**
 * HoC for redux's combineReducers() function. Provides default state reducers for initial state entries, removing the need to define reducers for every state member.
 *
 * @example withDefaultReducers(combineReducers)(initialState, [reducer1, reducer2, reducer3])
 *
 * @param {Function} combineReducers combineReducers function to wrap
 * @returns {wrappedCombineReducers} wrapped combineReducers.
 */
export default function withDefaultReducers (combineReducers) {
  /**
   * @function wrappedCombineReducers
   * @param {object} initialState
   * @param {Array<Function>} sliceReducers
   * @returns {Function}
   */
  function wrappedCombineReducers (initialState, sliceReducers) {
    return combineReducers(Object.entries(initialState).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: sliceReducers[key] ?? ((state = value) => {
          return state
        }),
      }
    }, {}))
  }

  return wrappedCombineReducers
}
