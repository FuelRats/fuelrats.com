// Component imports
import actionTypes from '../actionTypes'
import { withCurrentUserId, selectUserById } from '../selectors'
import { frApiRequest } from './services'
import { presentApiRequestBody } from '~/helpers/presenters'




export const getNickname = (nickId) => {
  return frApiRequest(
    actionTypes.nicknames.read,
    { url: `/groups/${nickId}` },
  )
}


export const addNickname = (data) => {
  return frApiRequest(
    actionTypes.nicknames.create,
    {
      url: '/nicknames',
      method: 'post',
      data: presentApiRequestBody('nicknames', data),
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
