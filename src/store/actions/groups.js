import actionTypes from '../actionTypes'
import { frApiRequest } from './services'

export const getGroups = (params) => {
  return frApiRequest(
    actionTypes.groups.search,
    {
      url: '/groups',
      params,
    },
  )
}

export const getGroup = (groupId) => {
  return frApiRequest(
    actionTypes.groups.read,
    { url: `/groups/${groupId}` },
  )
}
