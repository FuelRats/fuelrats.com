import actionTypes from '../actionTypes'
import initialState from '../initialState'
import parseJSONAPIResponseForEntityType from '../../helpers/parseJSONAPIResponseForEntityType'





export default function groupsReducer (state = initialState.groups, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_USER:
      if (status === 'success') {
        return {
          ...state,
          ...parseJSONAPIResponseForEntityType(payload, 'groups', true),
        }
      }
      return { ...state }

    default:
      return { ...state }
  }
}
