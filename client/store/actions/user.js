// Component imports
import { frApiRequest } from './services'
import actionTypes from '../actionTypes'





const addNickname = (userId, nickname, password) => frApiRequest(
  actionTypes.ADD_NICKNAME,
  {
    url: '/nicknames',
    method: 'post',
    data: {
      nickname,
      password,
    },
  },
  {
    nickname,
    userId,
  }
)





const deleteNickname = (nickname) => frApiRequest(
  actionTypes.DELETE_NICKNAME,
  {
    url: `/nicknames/${nickname}`,
    method: 'delete',
  },
  {
    nickname,
  }
)




const getCurrentUserProfile = () => frApiRequest(
  actionTypes.GET_PROFILE,
  { url: '/profile' }
)





const updateUser = (userId, data) => frApiRequest(
  actionTypes.UPDATE_USER,
  {
    url: `/users/${userId}`,
    method: 'put',
    data,
  }
)





export {
  addNickname,
  deleteNickname,
  getCurrentUserProfile,
  updateUser,
}
