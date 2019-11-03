import actionTypes from '../actionTypes'
import initialState from '../initialState'





export default function usersReducer (state = initialState.users, action) {
  const {
    nickname,
    userId,
    status,
    type,
  } = action



  switch (type) {
    case actionTypes.ADD_NICKNAME:
      if (status === 'success') {
        return {
          ...state,
          [userId]: {
            ...state[userId],
            attributes: {
              ...state[userId].attributes,
              nicknames: [
                ...state[userId].attributes.nicknames,
                nickname,
              ],
            },
          },
        }
      }
      break

    default:
      break
  }

  return state
}
