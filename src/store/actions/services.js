import { isRequired } from '@fuelrats/validation-util'
import { axiosRequest, createAxiosFSA } from '@fuelrats/web-util/actions'

import frApi from '~/services/fuelrats'
import stApi from '~/services/stripe'
import wpApi from '~/services/wordpress'

import { updatesResources } from '../reducers/frAPIResources'
import { selectSessionToken } from '../selectors'


function frAxiosRequest (...commonMeta) {
  return (type = isRequired('type'), config, ...meta) => {
    return async (dispatch, getState) => {
      const token = selectSessionToken(getState())
      const response = await frApi.request({
        ...config,
        headers: {
          ...(config.headers ?? {}),
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
    }
  }
}


export const frApiRequest = frAxiosRequest(updatesResources('fuelrats'))
export const frApiPlainRequest = frAxiosRequest()
export const stApiRequest = axiosRequest(stApi)
export const wpApiRequest = axiosRequest(wpApi)
