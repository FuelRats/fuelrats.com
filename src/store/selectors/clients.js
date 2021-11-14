import { createCachedSelector } from 're-reselect'

import { getUserIdProp } from './users'


const selectClients = (state) => {
  return state.clients
}

const selectClientsByUserId = createCachedSelector(
  [selectClients, getUserIdProp],
  (clients, userId) => {
    return Object.values(clients).filter((client) => {
      return client.relationships.user?.data?.id === userId
    }) ?? []
  },
)(getUserIdProp)

export {
  selectClients,
  selectClientsByUserId,
}
