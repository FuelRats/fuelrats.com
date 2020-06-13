import { axiosRequest } from '@fuelrats/web-util/actions'

import { updatesResources } from '../reducers/frAPIResources'

import frApi from '~/services/fuelrats'
import stApi from '~/services/stripe'
import wpApi from '~/services/wordpress'





export const frApiRequest = axiosRequest(frApi, updatesResources('fuelrats'))
export const frApiPlainRequest = axiosRequest(frApi)
export const stApiRequest = axiosRequest(stApi)
export const wpApiRequest = axiosRequest(wpApi)
