import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parse-json-api-response-for-entity-type'





export default function (state = initialState.ships, action) {
  let {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_USER:
      let {
        ships,
        retrieving,
        total,
      } = state

      switch (status) {
        case 'success':
          let newShips = parseJSONAPIResponseForEntityType(payload, 'ships')

          for (let newShip of newShips) {
            let index = ships.findIndex(ship => newShip.id === ship.id)

            if (index === -1) {
              ships.push(newShip)

            } else {
              ships[index] = newShip
            }
          }

          return Object.assign({}, state, {
            ships: ships,
            retrieving: false,
            total: action.total,
          })

        default:
          return Object.assign({}, state, {
            ships,
            retrieving,
            total,
          })
      }

    default:
      return state
  }
}
