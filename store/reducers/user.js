import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function (state = initialState.user, action) {
  switch (action.type) {
    case actionTypes.GET_RAT:
      if (action.status === 'success') {
        return Object.assign({}, state, {
          rats: (state.rats || []).concat(action.rat)
        })
      }

    case actionTypes.GET_USER:
      let { payload } = action

      if (payload) {
        let user = Object.assign({}, state, payload.data)

        user.attributes.image = payload.data.attributes.image || `//api.adorable.io/avatars/${payload.data.id}`

        return user
      }

    case actionTypes.LOGOUT:
      switch (action.status) {
        case 'success':
          return Object.assign({}, state, {
            loggedIn: false,
            loggingIn: false,
          })
      }

    case actionTypes.UPDATE_USER:
      if (action.user) {
        let user = action.user

        return Object.assign({}, state, user)
      }

    default:
      return state
  }
}
