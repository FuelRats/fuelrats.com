import Cookies from 'js-cookie'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





const dev = preval`module.exports = process.env.NODE_ENV !== 'production'`





export default function (state = initialState.user, action) {
  switch (action.type) {
    case actionTypes.ADD_NICKNAME:
      if (action.status === 'success') {
        const newState = Object.assign({}, state)

        newState.attributes.nicknames.push(action.payload)

        return newState
      }

    case actionTypes.CREATE_RAT:
    case actionTypes.GET_RAT:
      if (action.status === 'success') {
        return Object.assign({}, state, {
          relationships: {
            rats: {
              data: (state.relationships.rats.data || []).concat({
                id: action.rat.id,
                type: 'rats',
              }),
            },
          },
        })
      }

    case actionTypes.GET_USER:
      if (action.status === 'success') {
        const { payload } = action

        if (payload) {
          const user = Object.assign({}, state, payload.data)

          // Generate an Adorable avatar if the user doesn't already have one set
          user.attributes.image = payload.data.attributes.image || `//api.adorable.io/avatars/${payload.data.id}`

          if (Array.isArray(user.permissions)) {
            user.permissions = new Set(user.permissions)
          }

          // Collect user's permissions
          user.relationships.groups.data.forEach(({ id, type }) => {
            const group = payload.included.find(entity => (entity.id === id) && (entity.type === type))

            group.attributes.permissions.forEach(permission => user.permissions.add(permission))
          })

          // Create the user's data store if it doesn't already exist
          if (!user.data) {
            user.data = {}
          }

          // Parse the user's data store if it came in as a string
          if (typeof user.data === 'string') {
            user.data = JSON.parse(user.data)
          }

          // Create the website's walled garden in the data store
          if (!user.data.website) {
            user.data.website = {}
          }

          // Abstract the user's website preferences if they exist, otherwise the
          // defaults should already be set in the initialState
          if (user.data.website.preferences) {
            user.preferences = user.data.website.preferences
          }

          // Set anything we need in cookies for external access
          Cookies.set('userId', user.id, dev ? { domain: '.fuelrats.com' } : {})
          Cookies.set('allowUniversalTracking', user.preferences.allowUniversalTracking, dev ? { domain: '.fuelrats.com' } : {})

          return user
        }
      }

    case actionTypes.LOGOUT:
      switch (action.status) {
        default:
          return Object.assign({}, initialState.user)
      }

    case actionTypes.UPDATE_USER:
      if (action.user) {
        const { user } = action

        return Object.assign({}, state, user)
      }

    default:
      return state
  }
}
