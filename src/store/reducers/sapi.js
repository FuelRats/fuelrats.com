import { produce } from 'immer'

import actionTypes from '../actionTypes'
import initialState from '../initialState'


const SYSTEM_URL_PATTERN = /\/api\/systems\/([^/?]+)/u


function extractSystemId (url) {
  const match = url?.match(SYSTEM_URL_PATTERN)
  return match ? match[1] : null
}


function buildSystemEntry (payload) {
  const data = payload?.data
  if (!data) {
    return null
  }
  const stars = (payload.included ?? [])
    .filter((item) => {
      return item.type === 'stars'
    })
    .map((item) => {
      return { id: item.id, ...item.attributes }
    })
  return {
    id: data.id,
    name: data.attributes?.name,
    coords: data.attributes?.coords,
    stars,
  }
}


export default produce((draft, action) => {
  switch (action.type) {
    case actionTypes.sapi.systems: {
      if (action.error) {
        return
      }
      const systemId = extractSystemId(action.meta?.request?.url)
      if (!systemId) {
        return
      }
      const entry = buildSystemEntry(action.payload)
      if (entry) {
        draft.systems[systemId] = entry
      }
      break
    }

    case actionTypes.sapi.landmarks: {
      if (action.error) {
        return
      }
      const landmarks = action.payload?.landmarks ?? action.payload?.data?.landmarks
      if (Array.isArray(landmarks)) {
        draft.landmarks = landmarks
      }
      break
    }

    default:
      break
  }
}, initialState.sapi)
