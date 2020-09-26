import { defineRelationship } from '@fuelrats/web-util/redux-json-api'

import { presentApiRequestBody } from '~/helpers/presenters'

import actionTypes from '../actionTypes'
import { deletesResource, deletesRelationship, createsRelationship, RESOURCE } from '../reducers/frAPIResources'
import { withCurrentUserId, selectUserById } from '../selectors'
import { frApiRequest } from './services'




export const getNickname = (nickId) => {
  return frApiRequest(
    actionTypes.nicknames.read,
    { url: `/groups/${nickId}` },
  )
}

export const addNickname = (user, data) => {
  return frApiRequest(
    actionTypes.nicknames.create,
    {
      url: '/nicknames',
      method: 'post',
      data: presentApiRequestBody('nicknames', data),
    },
    createsRelationship(
      defineRelationship(user, { nicknames: [RESOURCE] }),
    ),
  )
}


export const deleteNickname = (user, nickname) => {
  return frApiRequest(
    actionTypes.nicknames.delete,
    {
      url: `/nicknames/${nickname.id}`,
      method: 'delete',
    },
    deletesResource(nickname),
    deletesRelationship(
      defineRelationship(
        user,
        { nicknames: [nickname] },
      ),
    ),
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
