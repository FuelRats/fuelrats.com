import { isRequired } from '@fuelrats/validation-util'
import { axiosRequest, createAxiosFSA, createFSA } from '@fuelrats/web-util/actions'

import frApi from '~/services/frApi'
import stripeApi from '~/services/stripeApi'
import systemsApi from '~/services/systemsApi'
import wpApi from '~/services/wpApi'

import { updatesResources } from '../reducers/frAPIResources'
import { selectSessionProxyHeaders, selectSessionToken } from '../selectors'


const isServer = typeof window === 'undefined'


function frAxiosRequest (...commonMeta) {
  return (type = isRequired('type'), config, ...meta) => {
    return async (dispatch, getState) => {
      const state = getState()
      const token = selectSessionToken(state)

      try {
        const response = await frApi.request({
          ...config,
          headers: {
            ...(config.headers ?? {}),
            ...(isServer ? selectSessionProxyHeaders(state) : {}),
            Authorization: `Bearer ${token}`,
          },
        })

        return dispatch(
          createAxiosFSA(
            type,
            response,
            ...commonMeta,
            ...meta,
          ),
        )
      } catch (error) {
        // frApi resolves on any HTTP status, so reaching here means a network-level
        // failure (timeout, connection refused). Surface it as an error FSA instead
        // of letting the rejection propagate unhandled.
        return dispatch(
          createFSA(
            type,
            { message: error.message },
            true,
            ...commonMeta,
            ...meta,
          ),
        )
      }
    }
  }
}


export const frApiRequest = frAxiosRequest(updatesResources('fuelrats'))
export const frApiPlainRequest = frAxiosRequest()
export const stripeApiRequest = axiosRequest(stripeApi)
export const wpApiRequest = axiosRequest(wpApi)
export const systemsApiRequest = axiosRequest(systemsApi)
