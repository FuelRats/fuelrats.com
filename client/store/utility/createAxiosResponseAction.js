import actionStatus from '../actionStatus'
import httpStatus from '../../helpers/httpStatus'





const createAxiosResponseAction = (type, response) => {
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
      baseUrl: config.baseUrl,
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



export default createAxiosResponseAction
