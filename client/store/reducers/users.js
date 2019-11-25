import { produce } from 'immer'





import actionTypes from '../actionTypes'
import initialState from '../initialState'





const usersReducer = produce((draftState, action) => {
  const {
    nickname,
    userId,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.ADD_NICKNAME:
      if (status === 'success') {
        draftState[userId].attributes.nicknames.push(nickname)
      }
      break

    default:
      break
  }
}, initialState.users)





export default usersReducer
