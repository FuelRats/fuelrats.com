import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.authentication, action) {
  switch (action.type) {
    case actionTypes.LOGIN:
      let newState = Object.assign({}, state)

      switch (action.status) {
        case 'error':
          newState.loggedIn = false
          newState.loggingIn = false

          break

        case 'success':
          let user = action.user
          let group = user.group || user.groups
          let isArray = Array.isArray(group)

          let isAdmin = false
          let isModerator = false
          let isOverseer = false

          if (isArray) {
            isAdmin = group.indexOf('admin') !== -1
            isModerator = group.indexOf('moderator') !== -1
            isOverseer = group.indexOf('overseer') !== -1
          } else {
            isAdmin = group === 'admin'
            isModerator = isAdmin || group === 'moderator'
            isOverseer = isModerator || group === 'overseer'
          }

          newState.loggedIn = true
          newState.loggingIn = false
          newState.user = Object.assign(user, {
            isAdmin,
            isModerator,
            isOverseer
          })

          break

        default:
          newState.loggedIn = false
          newState.loggingIn = true
      }

      return newState

    default:
      return state
  }
}
