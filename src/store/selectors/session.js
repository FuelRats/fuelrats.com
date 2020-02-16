export const selectSession = (state) => {
  return state.session
}


export const selectCurrentUserId = (state) => {
  return state.session.userId
}


export const withCurrentUserId = (selector) => {
  return (state, props) => {
    return selector(state, {
      ...props,
      userId: selectCurrentUserId(state),
    })
  }
}
