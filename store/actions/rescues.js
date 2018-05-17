// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'





export const getRescues = () => createApiAction({
  actionType: actionTypes.GET_RESCUES,
  url: '/rescues',
})

export const getRescuesByRat = ratId => createApiAction({
  actionType: actionTypes.GET_RESCUES,
  url: `/rescues?rats=${ratId}`,
  preDispatch: {
    rat: ratId,
  },
})
