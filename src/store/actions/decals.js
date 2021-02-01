import { defineRelationship } from '@fuelrats/web-util/redux-json-api'

import actionTypes from '../actionTypes'
import { createsRelationship, RESOURCE } from '../reducers/frAPIResources'
import { decrementsEligibleDecals } from '../reducers/users'
import { frApiRequest } from './services'





export const redeemDecal = (id) => {
  return frApiRequest(
    actionTypes.decals.redeem,
    {
      url: `/users/${id}/decals`,
      method: 'post',
    },
    createsRelationship(
      defineRelationship({ type: 'users', id }, { decals: [RESOURCE] }),
    ),
    decrementsEligibleDecals(id),
  )
}
