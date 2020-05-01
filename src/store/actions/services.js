import { HttpStatus } from '../../helpers/HttpStatus'
import isRequired from '../../helpers/isRequired'
import frApi from '../../services/fuelrats'
import stApi from '../../services/stripe'
import wpApi from '../../services/wordpress'
import actionStatus from '../actionStatus'



/**
 * Converts an axios reponse to object to a dispatchable action object.
 *
 * @param {!string} type Redux action type string.
 * @param {!object} response Axios response object.
 * @returns {object} axios response formatted for redux consumption.
 */
export const createAxiosAction = (type, response) => {
  const {
    config,
    data,
    headers,
    request,
    status,
    statusText,
  } = response

  let requestBody = config.data

  if (config.headers['Content-Type'] === 'application/json') {
    requestBody = JSON.parse(requestBody)
  }

  return {
    payload: data,
    request: {
      url: config.url,
      baseUrl: config.baseURL,
      method: config.method,
      data: requestBody,
    },
    response: {
      data: request.response,
      headers,
      status,
      statusText,
    },
    status: HttpStatus.isSuccess(status) ? actionStatus.SUCCESS : actionStatus.ERROR,
    type,
  }
}


export const axiosRequest = (service) => {
  return (type = isRequired('type'), config, restAction = {}) => {
    return async (dispatch) => {
      const response = await service.request(config)
      const action = createAxiosAction(type, response)

      return dispatch({
        ...action,
        ...restAction,
      })
    }
  }
}

export const frApiRequest = axiosRequest(frApi)

export const stApiRequest = axiosRequest(stApi)

export const wpApiRequest = axiosRequest(wpApi)
