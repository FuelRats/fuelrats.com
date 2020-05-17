// Component imports
import actionTypes from '../actionTypes'
import { withCurrentUserId, selectUserById } from '../selectors'
import { frApiRequest } from './services'
import { presentApiRequestBody } from '~/helpers/presenters'





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


export const updateUser = (data, password) => {
  return (dispatch, getState) => {
    const request = {
      url: `/users/${data.id}`,
      method: 'put',
      data: presentApiRequestBody('users', data),
    }

    if (password) {
      const user = withCurrentUserId(selectUserById)(getState())

      request.auth = {
        username: user?.attributes?.email,
        password,
      }
    }

    return dispatch(frApiRequest(actionTypes.users.update, request))
  }
}
