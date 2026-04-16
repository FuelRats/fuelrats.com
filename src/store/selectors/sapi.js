export const selectSystemInfo = (state, props = {}) => {
  if (!props.systemId) {
    return null
  }
  return state.sapi?.systems?.[props.systemId] ?? null
}


export const selectLandmarks = (state) => {
  return state.sapi?.landmarks ?? null
}
