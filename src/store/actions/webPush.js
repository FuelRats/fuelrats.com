import actionTypes from '../actionTypes'
import { selectCurrentUserId } from '../selectors'
import { frApiPlainRequest } from './services'


export const subscribePush = (subscription, filters = {}) => {
  return (dispatch) => {
    const json = subscription.toJSON()
    return dispatch(frApiPlainRequest(
      actionTypes.webPush.subscribe,
      {
        url: '/web-push',
        method: 'post',
        data: {
          endpoint: json.endpoint,
          expirationTime: json.expirationTime ?? null,
          keys: json.keys,
          ...filters,
        },
      },
    ))
  }
}


export const unsubscribePush = (endpoint) => {
  return (dispatch) => {
    return dispatch(frApiPlainRequest(
      actionTypes.webPush.unsubscribe,
      {
        url: '/web-push',
        method: 'delete',
        data: { endpoint },
      },
    ))
  }
}


export const listPushSubscriptions = () => {
  return (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    return dispatch(frApiPlainRequest(
      actionTypes.webPush.list,
      { url: `/users/${userId}/web-push-subscriptions` },
    ))
  }
}


export const updatePushSubscription = (subscriptionId, filters) => {
  return (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    return dispatch(frApiPlainRequest(
      actionTypes.webPush.update,
      {
        url: `/users/${userId}/web-push-subscriptions/${subscriptionId}`,
        method: 'patch',
        data: filters,
      },
    ))
  }
}


export const deletePushSubscription = (subscriptionId) => {
  return (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    return dispatch(frApiPlainRequest(
      actionTypes.webPush.remove,
      {
        url: `/users/${userId}/web-push-subscriptions/${subscriptionId}`,
        method: 'delete',
      },
    ))
  }
}


export const sendTestPush = () => {
  return (dispatch, getState) => {
    const userId = selectCurrentUserId(getState())
    return dispatch(frApiPlainRequest(
      actionTypes.webPush.test,
      {
        url: `/users/${userId}/alerts`,
        method: 'post',
        data: {
          title: 'Fuel Rats',
          body: 'Test notification — your push notifications are working! o7',
          tag: 'fr-test-notification',
          data: { url: '/profile/overview' },
        },
      },
    ))
  }
}
