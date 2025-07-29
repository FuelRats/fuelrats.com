import { defineRelationship } from '@fuelrats/web-util/redux-json-api'

import createRequestBody from '~/util/jsonapi/createRequestBody'



import actionTypes from '../actionTypes'
import { deletesResource, deletesRelationship, createsRelationship, RESOURCE } from '../reducers/frAPIResources'
import { withCurrentUserId, selectUserById, selectCurrentUserId } from '../selectors'
import { frApiRequest, frApiPlainRequest } from './services'

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
      data: createRequestBody('nicknames', data),
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
      data: createRequestBody('users', data),
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

export const updateAvatar = (data) => {
  return (dispatch, getState) => {
    const user = selectCurrentUserId(getState())
    const formData = new FormData()
    formData.append('image', data)
    const request = {
      url: `/users/${user}/image`,
      method: 'post',
      data: formData,
    }

    return dispatch(frApiRequest(actionTypes.users.avatar.update, request))
  }
}

export const changeEmail = ({ id, ...data }) => {
  return frApiPlainRequest(
    actionTypes.users.email.update,
    {
      url: `/users/${id}/email`,
      method: 'patch',
      data: createRequestBody('email-changes', data),
    },
  )
}
