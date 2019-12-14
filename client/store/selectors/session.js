const selectSession = (state) => state.session

const selectCurrentUserId = (state) => state.session.userId

const withCurrentUserId = (selector) => (state, props) => selector(state, {
  ...props,
  userId: selectCurrentUserId(state),
})

export {
  selectCurrentUserId,
  selectSession,
  withCurrentUserId,
}
