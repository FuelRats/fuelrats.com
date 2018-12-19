import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function userReducer (state = initialState.user, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.ADD_NICKNAME:
      if (status === 'success') {
        const newState = { ...state }

        newState.attributes.nicknames.push(action.nickname)

        return newState
      }
      break

    case actionTypes.DELETE_NICKNAME:
      if (status === 'success') {
        const newState = { ...state }

        newState.attributes.nicknames = newState.attributes.nicknames.filter((nick) => nick !== action.nickname)

        return newState
      }
      break

    case actionTypes.CREATE_RAT:
      if (status === 'success') {
        const newState = { ...state }

        if (!newState.relationships.rats.data) {
          newState.relationships.rats.data = []
        }

        newState.relationships.rats.data.push({
          id: payload.data.id,
          type: 'rats',
        })

        return newState
      }
      break

    case actionTypes.GET_USER:
      if (status === 'success') {
        if (payload) {
          return {
            ...state,
            ...payload.data,
            attributes: {
              ...payload.data.attributes,
              image: payload.data.attributes.image || `//api.adorable.io/avatars/${payload.data.id}`,
            },
            retrieving: false,
          }
        }
      }
      break

    case actionTypes.LOGOUT:
      return { ...initialState.user }

    case actionTypes.UPDATE_USER:
      if (action.user) {
        return {
          ...state,
          ...action.user,
        }
      }
      break

    default:
      break
  }

  return { ...state }
}
