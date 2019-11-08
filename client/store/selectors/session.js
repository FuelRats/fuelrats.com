const selectSession = (state) => state.session

const withCurrentUserId = (selector) => (state, props) => selector(state, {
  ...props,
  userId: state.session.userId,
})

export {
  selectSession,
  withCurrentUserId,
}
