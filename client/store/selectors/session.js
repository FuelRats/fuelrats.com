const selectSession = (state) => state.session

const withCurrentUserId = (selector) => (state) => selector(state, { userId: state.session.userId })

export {
  selectSession,
  withCurrentUserId,
}
