const selectRats = (state) => state.rats.rats

const selectRatById = (state, { ratId }) => state.rats.rats[ratId]





export {
  selectRats,
  selectRatById,
}
