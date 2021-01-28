export default function reduceToggle (state, nextState) {
  if (typeof nextState === undefined || (typeof nextState === 'object' && nextState.nativeEvent instanceof Event)) {
    // toggle state if nextState is an event or undefined
    return !state
  }

  return Boolean(nextState)
}
