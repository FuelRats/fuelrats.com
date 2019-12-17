import httpStatus from '../../helpers/httpStatus'



import isRequired from '../../helpers/isRequired'

import frApi from '../../services/fuelrats'
import wpApi from '../../services/wordpress'
import actionStatus from '../actionStatus'



/**
 * Converts an axios reponse to object to a dispatchable action object.
 *
 * @param {!String} type Redux action type string.
 * @param {!Object} response Axios response object.
 */
const createAxiosAction = (type, response) => {
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
    status: httpStatus.isSuccess(status) ? actionStatus.SUCCESS : actionStatus.ERROR,
    type,
  }
}





const axiosRequest = (service) => (type = isRequired('type'), config, restAction) => async (dispatch) => {
  const response = await service.request(config)
  const action = createAxiosAction(type, response)

  return dispatch(
    restAction
      ? {
        ...action,
        ...restAction,
      }
      : action,
  )
}

const frApiRequest = axiosRequest(frApi)

const wpApiRequest = axiosRequest(wpApi)





export {
  createAxiosAction,
  frApiRequest,
  wpApiRequest,
}
