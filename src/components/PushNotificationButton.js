import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import usePushNotifications from '~/hooks/usePushNotifications'
import { subscribePush } from '~/store/actions/webPush'
import getResponseError from '~/util/getResponseError'

import styles from './PushNotificationButton.module.scss'




const PLATFORM_OPTIONS = [
  { key: 'pc', label: 'PC', icon: 'tv' },
  { key: 'xb', label: 'Xbox', icon: ['fab', 'xbox'] },
  { key: 'ps', label: 'PS', icon: ['fab', 'playstation'] },
]

const GAME_VERSION_OPTIONS = [
  { key: 'horizons3', label: 'Legacy' },
  { key: 'horizons4', label: 'Horizons' },
  { key: 'odyssey', label: 'Odyssey' },
]

const DEFAULT_FILTERS = {
  pc: true, xb: true, ps: true,
  horizons3: true, horizons4: true, odyssey: true,
  alertsOnly: true,
}


function PushNotificationButton ({ className }) {
  const dispatch = useDispatch()
  const { supported, ready, permission, subscribed, loading, toggle, subscribe } = usePushNotifications()
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [subscribing, setSubscribing] = useState(false)
  const popoverRef = useRef(null)

  // Close popover on outside click
  useEffect(() => {
    if (!open) {
      return undefined
    }
    const handleClick = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => { document.removeEventListener('mousedown', handleClick) }
  }, [open])

  const handleToggleFilter = useCallback((key) => {
    setFilters((prev) => { return { ...prev, [key]: !prev[key] } })
  }, [])

  const handleSubscribe = useCallback(async () => {
    setSubscribing(true)
    await subscribe(filters)
    setSubscribing(false)
    setOpen(false)
  }, [subscribe, filters])

  const handleBellClick = useCallback(() => {
    if (subscribed) {
      toggle()
    } else {
      setFilters(DEFAULT_FILTERS)
      setOpen((prev) => { return !prev })
    }
  }, [subscribed, toggle])

  if (!supported || !ready) {
    return null
  }

  const denied = permission === 'denied'

  let title = 'Enable rescue notifications'
  if (denied) {
    title = 'Notifications blocked — check browser settings'
  } else if (subscribed) {
    title = 'Click to disable rescue notifications'
  }

  return (
    <div ref={popoverRef} className={styles.container}>
      <button
        aria-label={title}
        className={clsx('compact', className)}
        disabled={loading || denied}
        style={subscribed ? { color: '#fff' } : { opacity: 0.5 }}
        title={title}
        type="button"
        onClick={handleBellClick}>
        <FontAwesomeIcon fixedWidth icon="bell" />
        <span className={styles.label}>
          {subscribed ? 'On' : 'Off'}
        </span>
      </button>

      {
        open && (
          <div className={styles.popover}>
            <div className={styles.popoverTitle}>{'Notify me about...'}</div>

            <div className={styles.filterGroup}>
              <div className={styles.filterGroupLabel}>{'Platforms'}</div>
              <div className={styles.filterItems}>
                {PLATFORM_OPTIONS.map((item) => {
                  return (
                    <button
                      key={item.key}
                      className={clsx(styles.filterChip, { [styles.active]: filters[item.key] })}
                      type="button"
                      onClick={() => { return handleToggleFilter(item.key) }}>
                      {item.icon && (<FontAwesomeIcon fixedWidth icon={item.icon} />)}
                      {` ${item.label}`}
                    </button>
                  )
                })}
              </div>
            </div>

            {
              filters.pc && (
                <div className={styles.filterGroup}>
                  <div className={styles.filterGroupLabel}>{'PC Game Version'}</div>
                  <div className={styles.filterItems}>
                    {GAME_VERSION_OPTIONS.map((item) => {
                      return (
                        <button
                          key={item.key}
                          className={clsx(styles.filterChip, { [styles.active]: filters[item.key] })}
                          type="button"
                          onClick={() => { return handleToggleFilter(item.key) }}>
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            }

            <div className={styles.filterGroup}>
              <div className={styles.filterGroupLabel}>{'When to notify'}</div>
              <div className={styles.filterItems}>
                <button
                  className={clsx(styles.filterChip, { [styles.active]: filters.alertsOnly })}
                  type="button"
                  onClick={() => { return handleToggleFilter('alertsOnly') }}>
                  {'Dispatch alerts only'}
                </button>
                <button
                  className={clsx(styles.filterChip, { [styles.active]: !filters.alertsOnly })}
                  type="button"
                  onClick={() => { return handleToggleFilter('alertsOnly') }}>
                  {'All new rescues'}
                </button>
              </div>
            </div>

            <button
              className={clsx('compact', styles.subscribeButton)}
              disabled={subscribing}
              type="button"
              onClick={handleSubscribe}>
              {subscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        )
      }
    </div>
  )
}

PushNotificationButton.propTypes = {
  className: PropTypes.string,
}




export default PushNotificationButton
