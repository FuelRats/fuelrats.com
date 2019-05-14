const selectFlags = (state) => state.flags


const selectFlagByName = (state, { name }) => state.flags[name]





export {
  selectFlags,
  selectFlagByName,
}
