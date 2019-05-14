const selectRescues = (state) => state.rescues.rescues

const selectRescueById = (state, { rescueId }) => state.rescues[rescueId]

export {
  selectRescues,
  selectRescueById,
}
