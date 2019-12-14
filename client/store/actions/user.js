// Component imports
import { frApiRequest } from './services'
import actionTypes from '../actionTypes'





const addNickname = (userId, nickname, password) => frApiRequest(
  actionTypes.nicknames.create,
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
  },
)





const deleteNickname = (nickname) => frApiRequest(
  actionTypes.nicknames.delete,
  {
    url: `/nicknames/${nickname}`,
    method: 'delete',
  },
  {
    nickname,
  },
)




const getUserProfile = () => frApiRequest(
  actionTypes.session.read,
  { url: '/profile' },
)





const updateUser = (userId, data) => frApiRequest(
  actionTypes.users.update,
  {
    url: `/users/${userId}`,
    method: 'put',
    data,
  },
)





export {
  addNickname,
  deleteNickname,
  getUserProfile,
  updateUser,
}
