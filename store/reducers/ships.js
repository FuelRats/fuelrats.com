import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parseJSONAPIResponseForEntityType'





export default function (state = initialState.ships, action) {
  const {
    payload,
    status,
    type,
  } = action
  const {
    ships,
    retrieving,
    total,
  } = state
  let newShips

  switch (type) {
    case actionTypes.GET_USER:
      switch (status) {
        case 'success':
          newShips = parseJSONAPIResponseForEntityType(payload, 'ships')

          for (const newShip of newShips) {
            const index = ships.findIndex(ship => newShip.id === ship.id)

            if (index === -1) {
              ships.push(newShip)
            } else {
              ships[index] = newShip
            }
          }

          return {
            ...state,
            ships,
            retrieving: false,
            total: action.total,
          }

        default:
          return {
            ...state,
            ships,
            retrieving,
            total,
          }
      }

    default:
      return state
  }
}
