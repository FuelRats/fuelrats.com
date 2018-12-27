import isPlainObject from 'lodash/isPlainObject'

// Component imports
import actionStatus from './actionStatus'
import isRequired from '../helpers/isRequired'
import apiService from '../services/api'
import wpService from '../services/wordpress'




const buildActionOptions = (options = isRequired('options')) => {
  const {
    actionFunction,
    actionType,
    onComplete,
    onError,
    onSuccess,
    onUnhandledResult,
    onUnhandledError,
    onUnhandledSuccess,
    preDispatch,
    postDispatch,
    ...actionPayload
  } = options

  return {
    actionFunction: typeof actionFunction === 'function' ? actionFunction : isRequired('options.actionFunction'),
    actionPayload: [actionPayload],
    actionType: actionType || isRequired('options.actionType'),
    onComplete: typeof onComplete === 'function' ? onComplete : () => undefined,
    onError: typeof onError === 'function' ? onError : () => undefined,
    onSuccess: typeof onSuccess === 'function' ? onSuccess : () => undefined,
    onUnhandledError: typeof onUnhandledError === 'function' ? onUnhandledError : onUnhandledResult,
    onUnhandledSuccess: typeof onUnhandledSuccess === 'function' ? onUnhandledSuccess : onUnhandledResult,
    preDispatch: isPlainObject(preDispatch) ? preDispatch : {},
    postDispatch: isPlainObject(postDispatch) ? postDispatch : {},
  }
}





/**
 * Constructs a new redux action function.
 *
 * @param   {Object.<string, *>} options                      Object containing configuration settings for the action.
 * @param   {Function}           options.actionFunction       The main action to perform.
 * @param   {String}             options.actionType           Redux action type.
 * @param   {Function}           [options.onComplete]         Called immediately after the action has been completed and dispatched to redux.
 * @param   {Function}           [options.onError]            Called immediately after catching an error thrown by the action.
 * @param   {Function}           [options.onSuccess]          Called immediately after the action completes.
 * @param   {Function}           [options.onUnhandledResult]  Convenience option to populate both onUnhandledError/Success.
 * @param   {Function}           [options.onUnhandledError]   Called if onError either is or returns undefined.
 * @param   {Function}           [options.onUnhandledSuccess] Called if onSuccess either is or returns undefined.
 * @param   {Object.<string, *>} [options.preDispatch]        Object of extra properties to include in the pre-action redux dispatch call.
 * @param   {Object.<string, *>} [options.postDispatch]       Object of extra properties to include in the post-action redux dispatch call.
 * @param   {*}                  [options.any]                All other entries of the options object are passed to the actionFunction by default.
 * @returns {Function}                                        Function which performs a redux action defined by the given configuration.
 */
const createAction = (options) => {
  const {
    actionFunction,
    actionPayload,
    actionType,
    onComplete,
    onError,
    onSuccess,
    onUnhandledError,
    onUnhandledSuccess,
    preDispatch,
    postDispatch,
  } = buildActionOptions(options)

  return async (dispatch, getState) => {
    let response = null
    let success = false

    dispatch({
      ...preDispatch,
      type: actionType,
    })

    try {
      response = await actionFunction(...actionPayload)

      const eventResponse = await onSuccess(response, {
        dispatch,
        getState,
      })

      if (typeof eventResponse !== 'undefined') {
        response = eventResponse
      } else if (onUnhandledSuccess) {
        response = await onUnhandledSuccess(response)
      }

      success = true
    } catch (error) {
      const eventResponse = await onError(error, {
        dispatch,
        getState,
      })

      if (typeof eventResponse !== 'undefined') {
        response = eventResponse
      } else if (onUnhandledError) {
        response = await onUnhandledError(error)
      }

      success = false
    }

    let postDispatchObj = dispatch({
      ...postDispatch,
      payload: response || null,
      status: success ? actionStatus.SUCCESS : actionStatus.ERROR,
      type: actionType,
    })

    if (onComplete) {
      postDispatchObj = onComplete(postDispatchObj, {
        dispatch,
        getState,
      }) || postDispatchObj
    }
    return postDispatchObj
  }
}





const createApiAction = (options) => createAction({
  ...options,
  actionFunction: apiService().request,
  onUnhandledSuccess: (res) => res.data,
  onUnhandledError: (res) => res && res.response && res.response.data,
})





const createWpAction = (options) => createAction({
  ...options,
  actionFunction: wpService().request,
  onUnhandledSuccess: (res) => res.data,
  onUnhandledError: (res) => res && res.response && res.response.data,
})





const createTimeoutAction = (options) => createAction({
  ...options,
  actionFunction: (opts) => {
    const data = { data: opts.data }

    return new Promise((resolve, reject) => setTimeout(
      () => (opts.fail ? reject(data) : resolve(data)),
      opts.timeout || 1000
    ))
  },
})





/**
 * Performs a series of specified redux actions
 *
 * @deprecated Avoid using. Will be removed once we start patching rat list for paperwork
 * @param   {String}       actions      List of actions to take
 * @param   {Boolean}      [silentFail] Determines if the action chain should ignore actions which return with an error
 * @param   {Boolean}      [returnLast] Determines if the last response or the entire array of responses should be returned
 * @returns {Array|Object}              Array of responses from the actions performed, or the last response in the chain depending on returnLast
 */
/* eslint-disable no-await-in-loop, no-restricted-syntax */
const actionSeries = (actions = isRequired('actions'), silentFail, returnLast) => async (dispatch) => {
  const responses = []

  if (Array.isArray(actions) && actions.length) {
    for (const action of actions) {
      if (typeof action === 'function') {
        const response = await action(dispatch)

        responses.push(response)

        if (!silentFail && response && response.status && response.status === actionStatus.ERROR) {
          break
        }
      }
    }
  }

  if (returnLast) {
    if (responses.length) {
      return responses[responses.length - 1]
    }
    return null
  }

  return responses
}
/* eslint-enable no-await-in-loop, no-restricted-syntax */





export default createAction
export {
  actionSeries,
  createAction,
  createApiAction,
  createTimeoutAction,
  createWpAction,
}
