import { createCachedSelector } from 're-reselect'

import { getUserId } from './users'


const selectClients = (state) => {
  return state.clients
}

const selectClientsByUserId = createCachedSelector(
  [selectClients, getUserId],
  (clients, userId) => {
    return Object.values(clients).filter((client) => {
      return client.relationships.user?.data?.id === userId
    }) ?? []
  },
)(getUserId)

export {
  selectClients,
  selectClientsByUserId,
}
