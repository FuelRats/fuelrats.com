import { axiosRequest } from '@fuelrats/web-util/actions'

import frApi from '~/services/fuelrats'
import stApi from '~/services/stripe'
import wpApi from '~/services/wordpress'

import { updatesResources } from '../reducers/frAPIResources'





export const frApiRequest = axiosRequest(frApi, updatesResources('fuelrats'))
export const frApiPlainRequest = axiosRequest(frApi)
export const stApiRequest = axiosRequest(stApi)
export const wpApiRequest = axiosRequest(wpApi)
