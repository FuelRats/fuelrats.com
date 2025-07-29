import actionTypes from '../actionTypes'
import { systemsApiRequest } from './services'





export const getSystemStars = (systemId) => {
  return systemsApiRequest(
    actionTypes.sapi.systems,
    { url: `/api/systems/${systemId}/stars` },
  )
}
