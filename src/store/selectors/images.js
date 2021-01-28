export const selectImages = (state) => {
  return state.images
}


export const selectImageById = (state, { imageId }) => {
  return state.images[imageId] ?? undefined
}
