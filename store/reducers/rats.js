import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parseJSONAPIResponseForEntityType'





export default function (state = initialState.rats, action) {
  const {
    payload,
    status,
    type,
  } = action
  const { rats } = state
  let newRats

  switch (type) {
    case actionTypes.CREATE_RAT:
      switch (status) {
        case 'success':
          rats.push(action.rat)

          return Object.assign({}, state, {
            rats,
          })

        default:
          return state
      }

    case actionTypes.GET_USER:
    case actionTypes.GET_RESCUE:
    case actionTypes.UPDATE_RESCUE:
      switch (status) {
        case 'success':
          newRats = parseJSONAPIResponseForEntityType(payload, 'rats')

          for (const newRat of newRats) {
            const index = rats.findIndex(rat => newRat.id === rat.id)

            if (index === -1) {
              rats.push(newRat)
            } else {
              rats[index] = newRat
            }
          }

          return {
            ...state,
            rats,
            retrieving: false,
            total: action.total,
          }

        default:
          return state
      }

    default:
      return state
  }
}
