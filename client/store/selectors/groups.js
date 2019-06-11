const selectGroups = (state) => state.groups


const selectGroupById = (state, { groupId }) => state.groups[groupId]





export {
  selectGroups,
  selectGroupById,
}
