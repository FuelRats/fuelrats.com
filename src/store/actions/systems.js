import actionTypes from '../actionTypes'
import { systemsApiRequest } from './services'




export const getSystemStars = (systemId) => {
  return systemsApiRequest(
    actionTypes.sapi.systems,
    { url: `/api/systems/${systemId}/stars` },
  )
}

export const getSystem = (systemId) => {
  return systemsApiRequest(
    actionTypes.sapi.systems,
    { url: `/api/systems/${systemId}?include=stars` },
  )
}

export const getLandmarkList = () => {
  return systemsApiRequest(
    actionTypes.sapi.landmarks,
    { url: '/landmark?list=true' },
  )
}
