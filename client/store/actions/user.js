// Component imports
import { frApiRequest } from './services'
import actionTypes from '../actionTypes'





const addNickname = (nickname, password) => frApiRequest(
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




const getUser = () => frApiRequest(
  actionTypes.GET_USER,
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
  getUser,
  updateUser,
}
