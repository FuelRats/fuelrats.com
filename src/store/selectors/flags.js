export const selectFlags = (state) => {
  return state.flags
}


export const selectFlagByName = (state, { name }) => {
  return state.flags[name]
}
