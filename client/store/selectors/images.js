const selectImages = (state) => state.images

const selectImageById = (state, { imageId }) => state.images[imageId] || null





export {
  selectImageById,
  selectImages,
}
