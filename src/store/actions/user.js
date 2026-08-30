import { defineRelationship } from '@fuelrats/web-util/redux-json-api'

import createRequestBody from '~/util/jsonapi/createRequestBody'



import actionTypes from '../actionTypes'
import { frApiRequest, frApiPlainRequest } from './services'
import { deletesResource, deletesRelationship, createsRelationship, RESOURCE } from '../reducers/frAPIResources'
import { withCurrentUserId, selectUserById, selectCurrentUserId, selectSessionToken } from '../selectors'

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
  return async (dispatch, getState) => {
    const user = selectCurrentUserId(getState())
    const token = selectSessionToken(getState())
    const formData = new FormData()
    formData.append('image', data)

    const response = await fetch(`/api/fr/avatar-upload?userId=${user}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    if (response.ok) {
      await dispatch(getUserProfile())
    }

    const result = await response.json().catch(() => {
      return null
    })

    return dispatch({
      type: actionTypes.users.avatar.update,
      payload: result,
      error: !response.ok,
    })
  }
}

export const deleteAvatar = () => {
  return (dispatch, getState) => {
    const user = selectCurrentUserId(getState())
    return dispatch(frApiRequest(actionTypes.users.avatar.update, {
      url: `/users/${user}/image`,
      method: 'delete',
    }))
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

export const setDisplayNickname = (nicknameId, displayNick) => {
  return frApiRequest(
    actionTypes.nicknames.setDisplay,
    {
      url: `/nicknames/${nicknameId}/display`,
      method: 'put',
      data: createRequestBody('nicknames', { displayNick }),
    },
  )
}


export const getGroups = (params) => {
  return frApiRequest(
    actionTypes.groups.search,
    { url: '/groups', params },
  )
}


export const getUsers = (params, ...meta) => {
  return frApiRequest(
    actionTypes.users.search,
    {
      url: '/users',
      params,
    },
    ...meta,
  )
}


export const searchNicknames = (params, ...meta) => {
  return frApiRequest(
    actionTypes.nicknames.read,
    {
      url: '/nicknames',
      params,
    },
    ...meta,
  )
}


export const adminUpdateUser = (data) => {
  return frApiRequest(
    actionTypes.users.update,
    {
      url: `/users/${data.id}`,
      method: 'put',
      data: createRequestBody('users', data),
    },
  )
}


export const adminAddGroups = (userId, groupIds) => {
  const groupRefs = groupIds.map((id) => {
    return { type: 'groups', id }
  })
  return frApiRequest(
    actionTypes.users.update,
    {
      url: `/users/${userId}/relationships/groups`,
      method: 'post',
      data: { data: groupRefs },
    },
    createsRelationship(
      defineRelationship(
        { type: 'users', id: userId },
        { groups: groupRefs },
      ),
    ),
  )
}


export const adminRemoveGroups = (userId, groupIds) => {
  const groupRefs = groupIds.map((id) => {
    return { type: 'groups', id }
  })
  return frApiRequest(
    actionTypes.users.update,
    {
      url: `/users/${userId}/relationships/groups`,
      method: 'delete',
      data: { data: groupRefs },
    },
    deletesRelationship(
      defineRelationship(
        { type: 'users', id: userId },
        { groups: groupRefs },
      ),
    ),
  )
}


export const adminRemoveTotp = (userId) => {
  return frApiPlainRequest(
    actionTypes.totp.remove,
    {
      url: `/users/${userId}/authenticator`,
      method: 'delete',
    },
  )
}


export const adminDeleteUser = (userId) => {
  return frApiRequest(
    actionTypes.users.delete,
    {
      url: `/users/${userId}`,
      method: 'delete',
    },
  )
}


export const adminAnonymiseUser = (userId) => {
  return frApiPlainRequest(
    actionTypes.users.update,
    {
      url: `/users/${userId}/gdpr-anonymise`,
      method: 'post',
    },
  )
}


export const adminResetPassword = (userId, newPassword) => {
  return frApiPlainRequest(
    actionTypes.passwords.update,
    {
      url: `/users/${userId}/password`,
      method: 'patch',
      data: createRequestBody('password-changes', { newPassword }),
    },
  )
}
