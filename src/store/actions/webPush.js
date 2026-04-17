import actionTypes from '../actionTypes'
import { selectCurrentUserId } from '../selectors'
import { frApiPlainRequest } from './services'


export const subscribePush = (subscription, filters = {}) => {
  return (dispatch) => {
    return dispatch(frApiPlainRequest(
      actionTypes.webPush.subscribe,
      {
        url: '/web-push',
        method: 'post',
        data: {
          data: {
            type: 'web-push-subscriptions',
            attributes: {
              endpoint: subscription.endpoint,
              keys: {
                auth: subscription.toJSON?.().keys?.auth ?? subscription.keys?.auth,
                p256dh: subscription.toJSON?.().keys?.p256dh ?? subscription.keys?.p256dh,
              },
              ...filters,
            },
          },
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
        data: {
          data: {
            type: 'web-push-subscriptions',
            id: subscriptionId,
            attributes: filters,
          },
        },
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
