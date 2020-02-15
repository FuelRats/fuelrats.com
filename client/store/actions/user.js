// Component imports
import actionTypes from '../actionTypes'
import { frApiRequest } from './services'





export const addNickname = (userId, nickname, password) => {
  return frApiRequest(
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
}


export const deleteNickname = (nickname) => {
  return frApiRequest(
    actionTypes.nicknames.delete,
    {
      url: `/nicknames/${nickname}`,
      method: 'delete',
    },
    {
      nickname,
    },
  )
}


export const getUserProfile = () => {
  return frApiRequest(
    actionTypes.session.read,
    { url: '/profile' },
  )
}


export const updateUser = (userId, data) => {
  return frApiRequest(
    actionTypes.users.update,
    {
      url: `/users/${userId}`,
      method: 'put',
      data,
    },
  )
}
