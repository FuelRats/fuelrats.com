/**
 * Chains multiple root reducers together.
 *
 * WARNING: Improper use of this function can be dangerous to performance and your state tree.
 *          It is not recommend to use this with combineReducers() UNLESS combineReducers() contains all slice reducers required to construct state.
 *          ALL reducer functions MUST return the state object passed to the function, or a new updated instance of state.
 *          The state object is overwritten, not merged. NEVER return a partal state tree.
 *          If your reducer does not need to update state, ALWAYS return the state object as-is.
 *          Always treat the state object as immutable.
 *
 * @param {Object} initialState Initial state object. Used in case provided state is undefined.
 * @param  {...function} reducers redux reducer functions
 */
const chainReducers = (initialState, reducers) => (state = initialState, action) => {
  let nextState = state

  reducers.forEach((reducer) => {
    nextState = reducer(nextState, action)

    if (typeof nextState === 'undefined') {
      throw Error('Reducer returned invalid return value. Reducers must always return original or updated state.')
    }
  })

  return nextState
}





export default chainReducers
