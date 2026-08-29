import createRequestBody from '~/util/jsonapi/createRequestBody'

import actionTypes from '../actionTypes'
import { frApiRequest, frApiPlainRequest } from './services'
import { deletesResource } from '../reducers/frAPIResources'


// Channels are stored bare (no leading `#`); strip it and URL-encode for the path.
const channelPath = (channel) => {
  return encodeURIComponent(channel.replace(/^[#&]/u, ''))
}


// Registered ChanServ channels (plain `{ channels: [...] }`, not a JSON:API resource) —
// backs the channel-access autocomplete so access is granted to real channels.
export const getRegisteredChannels = () => {
  return frApiPlainRequest(
    actionTypes.groups.registeredChannels,
    { url: '/anope/channels' },
  )
}


export const createGroup = (data) => {
  return frApiRequest(
    actionTypes.groups.create,
    {
      url: '/groups',
      method: 'post',
      data: createRequestBody('groups', data),
    },
  )
}


export const updateGroup = (data) => {
  return frApiRequest(
    actionTypes.groups.update,
    {
      url: `/groups/${data.id}`,
      method: 'put',
      data: createRequestBody('groups', data),
    },
  )
}


export const deleteGroup = (group) => {
  return frApiRequest(
    actionTypes.groups.delete,
    {
      url: `/groups/${group.id}`,
      method: 'delete',
    },
    deletesResource(group),
  )
}


export const setGroupChannel = (id, channel, flags) => {
  return frApiRequest(
    actionTypes.groups.update,
    {
      url: `/groups/${id}/channels/${channelPath(channel)}`,
      method: 'put',
      data: { flags },
    },
  )
}


export const removeGroupChannel = (id, channel) => {
  return frApiRequest(
    actionTypes.groups.update,
    {
      url: `/groups/${id}/channels/${channelPath(channel)}`,
      method: 'delete',
    },
  )
}


export const setGroupPermission = (id, scope) => {
  return frApiRequest(
    actionTypes.groups.update,
    {
      url: `/groups/${id}/permissions/${encodeURIComponent(scope)}`,
      method: 'put',
    },
  )
}


export const removeGroupPermission = (id, scope) => {
  return frApiRequest(
    actionTypes.groups.update,
    {
      url: `/groups/${id}/permissions/${encodeURIComponent(scope)}`,
      method: 'delete',
    },
  )
}
