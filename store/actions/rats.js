// Component imports
import { createApiAction } from '../actionCreators'
import actionTypes from '../actionTypes'





export const createRat = (name, platform, userId) => createApiAction({
  actionType: actionTypes.CREATE_RAT,
  url: '/rats',
  method: 'post',
  data: {
    name,
    platform,
    userId,
  },
})





export const getRats = ratIds => dispatch => Promise.all(ratIds.map(ratId => createApiAction({
  actionType: actionTypes.GET_RAT,
  url: `/rats/${ratId}`,
  preDispatch: {
    rat: ratId,
  },
})(dispatch)))
