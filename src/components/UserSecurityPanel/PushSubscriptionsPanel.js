import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import ConfirmActionButton from '~/components/ConfirmActionButton'
import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'
import usePushNotifications from '~/hooks/usePushNotifications'
import { listPushSubscriptions, updatePushSubscription, deletePushSubscription } from '~/store/actions/webPush'
import friendlyApiError from '~/util/friendlyApiError'
import getResponseError from '~/util/getResponseError'

import styles from './UserSecurityPanel.module.scss'




const FILTER_LABELS = {
  pc: 'PC',
  xb: 'Xbox',
  ps: 'PS',
  horizons3: 'Legacy',
  horizons4: 'Horizons',
  odyssey: 'Odyssey',
}
const FILTER_KEYS = Object.keys(FILTER_LABELS)


function PushSubscriptionsPanel () {
  const dispatch = useDispatch()
  const {
    supported, permission, subscribed, loading: toggleLoading, toggle,
  } = usePushNotifications()
  const [subscriptions, setSubscriptions] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [error, setError] = useState(null)

  const fetchSubscriptions = useCallback(async () => {
    setLoadingList(true)
    setError(null)
    const response = await dispatch(listPushSubscriptions())
    const err = getResponseError(response)
    if (err) {
      const HTTP_FORBIDDEN = 403
      if (err.code !== HTTP_FORBIDDEN) {
        setError(err)
      }
      setSubscriptions([])
    } else {
      setSubscriptions(response.payload?.data ?? [])
    }
    setLoadingList(false)
  }, [dispatch])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  const handleDelete = useCallback(async (event) => {
    const subId = event.target.name
    setError(null)
    const response = await dispatch(deletePushSubscription(subId))
    const err = getResponseError(response)
    if (err) {
      setError(err)
    } else {
      setSubscriptions((prev) => {
        return prev.filter((sub) => {
          return sub.id !== subId
        })
      })
    }
    return true
  }, [dispatch])

  const handleToggleFilter = useCallback(async (subId, field, currentValue) => {
    setError(null)
    const response = await dispatch(updatePushSubscription(subId, { [field]: !currentValue }))
    const err = getResponseError(response)
    if (err) {
      setError(err)
    } else {
      setSubscriptions((prev) => {
        return prev.map((sub) => {
          if (sub.id !== subId) {
            return sub
          }
          return { ...sub, attributes: { ...sub.attributes, [field]: !currentValue } }
        })
      })
    }
  }, [dispatch])

  const denied = permission === 'denied'

  return (
    <div className="panel">
      <header>{'Push Notifications'}</header>
      <div className={styles.content}>
        {
          error && (
            <ApiErrorBox
              error={error}
              renderError={
(err) => {
  return friendlyApiError(err, {
    fallbackDetail: 'Unable to manage push subscriptions.',
  })
}
} />
          )
        }

        {
          !supported && (
            <p className={styles.pushDescription}>
              {'Push notifications are not supported in this browser.'}
            </p>
          )
        }

        {
          denied && (
            <p className={styles.pushDescription}>
              {'Notifications are blocked. To enable them, update your browser\'s notification permission for this site.'}
            </p>
          )
        }

        {
          supported && !denied && (
            <>
              <p className={styles.pushDescription}>
                {'Receive browser notifications when new rescues come in, even when the dispatch board isn\'t open.'}
              </p>
              <div className={styles.pushToggle}>
                <button
                  disabled={toggleLoading}
                  type="button"
                  onClick={
async () => {
  await toggle()
  await fetchSubscriptions()
}
}>
                  <FontAwesomeIcon fixedWidth icon={subscribed ? 'bell-slash' : 'bell'} />
                  {subscribed ? ' Disable on this device' : ' Enable on this device'}
                </button>
              </div>
            </>
          )
        }

        {loadingList && <div className={styles.empty}>{'Loading subscriptions...'}</div>}

        {
          !loadingList && subscriptions.length > 0 && (
            <>
              <h4 className={styles.pushSubheading}>{'Subscribed Devices'}</h4>
              <ul className={styles.sessionsList}>
                {
subscriptions.map((sub) => {
  return (
    <li key={sub.id} className={styles.sessionItem}>
      <FontAwesomeIcon fixedWidth className={styles.sessionIcon} icon="bell" />
      <div className={styles.sessionInfo}>
        <div className={styles.sessionLabel}>
          {
            (() => {
              const ENDPOINT_HOST_INDEX = 2
              const parts = sub.attributes.endpoint?.split('/')
              return parts?.[ENDPOINT_HOST_INDEX] ?? 'Push subscription'
            })()
          }
        </div>
        <div className={styles.pushFilters}>
          {
FILTER_KEYS.map((key) => {
  const active = sub.attributes[key]
  return (
    <button
      key={key}
      className={active ? styles.filterActive : styles.filterInactive}
      title={`${active ? 'Disable' : 'Enable'} ${FILTER_LABELS[key]} notifications`}
      type="button"
      onClick={
() => {
  return handleToggleFilter(sub.id, key, active)
}
}>
      {FILTER_LABELS[key]}
    </button>
  )
})
}
        </div>
        <div className={styles.pushFilters}>
          <button
            className={sub.attributes.alertsOnly ? styles.filterActive : styles.filterInactive}
            title={sub.attributes.alertsOnly ? 'Currently: dispatch alerts only' : 'Currently: all new rescues'}
            type="button"
            onClick={
() => {
  return handleToggleFilter(sub.id, 'alertsOnly', sub.attributes.alertsOnly)
}
}>
            {sub.attributes.alertsOnly ? 'Alerts only' : 'All rescues'}
          </button>
        </div>
      </div>
      <ConfirmActionButton
        className="compact"
        confirmButtonText="Remove"
        confirmSubText="Remove?"
        denyButtonText="Cancel"
        name={sub.id}
        onConfirm={handleDelete}
        onConfirmText="">
        <FontAwesomeIcon fixedWidth icon="trash" />
      </ConfirmActionButton>
    </li>
  )
})
}
              </ul>
            </>
          )
        }
      </div>
    </div>
  )
}




export default PushSubscriptionsPanel
