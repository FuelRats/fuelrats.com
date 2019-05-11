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
        const nickIndex = newState.attributes.nicknames.findIndex((nick) => nick === action.nickname)

        newState.attributes.nicknames.splice(nickIndex, 1)

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

    case actionTypes.DELETE_RAT:
      if (status === 'success') {
        const newState = { ...state }

        if (!newState.relationships.rats.data) {
          return state
        }

        const ratIndex = newState.relationships.rats.data.findIndex((rat) => rat.id === action.ratId)

        if (ratIndex > -1) {
          newState.relationships.rats.data.splice(ratIndex, 1)
        }

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
      if (status === 'success' && payload.data[0].id === state.id) {
        return {
          ...state,
          ...payload.data[0],
        }
      }
      break

    default:
      break
  }

  return { ...state }
}
