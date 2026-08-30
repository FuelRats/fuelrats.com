import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react'

import usePushNotifications from '~/hooks/usePushNotifications'
import { loadSoundSettings, saveSoundSettings } from '~/hooks/useSoundNotifications'
import { playNewCaseSound, playCaseChangeSound, playCaseClosedSound } from '~/util/sounds'

import styles from './NotificationPanel.module.scss'




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

const DEFAULT_PUSH_FILTERS = {
  pc: true,
  xb: true,
  ps: true,
  horizons3: true,
  horizons4: true,
  odyssey: true,
  alertsOnly: true,
}

const SOUND_PREVIEWS = {
  newCase: playNewCaseSound,
  caseChange: playCaseChangeSound,
  caseClosed: playCaseClosedSound,
}

const SOUND_OPTIONS = [
  { key: 'newCase', label: 'New case', icon: 'plus' },
  { key: 'caseChange', label: 'Case update', icon: 'arrows-rotate' },
  { key: 'caseClosed', label: 'Case closed', icon: 'check' },
]

const CLOSE_ANIMATION_MS = 150


function NotificationPanel ({ className, open, onClose }) {
  const panelRef = useRef(null)
  const {
    supported: pushSupported, ready: pushReady, permission, subscribed, loading: pushLoading, toggle, subscribe,
  } = usePushNotifications()

  // Push filters
  const [pushFilters, setPushFilters] = useState(DEFAULT_PUSH_FILTERS)
  const [subscribing, setSubscribing] = useState(false)

  // Sound settings
  const [sound, setSound] = useState(() => {
    return loadSoundSettings()
  })

  // Reload sound settings when panel opens
  useEffect(() => {
    if (open) {
      setSound(loadSoundSettings())
    }
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) {
      return undefined
    }
    const handleClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [open, onClose])

  // Push handlers
  const handleTogglePushFilter = useCallback((key) => {
    const next = { ...pushFilters, [key]: !pushFilters[key] }
    setPushFilters(next)
    // Re-register with new filters if already subscribed
    if (subscribed) {
      subscribe(next)
    }
  }, [pushFilters, subscribed, subscribe])

  const handlePushToggle = useCallback(async () => {
    if (subscribed) {
      toggle()
    } else {
      setSubscribing(true)
      await subscribe(pushFilters)
      setSubscribing(false)
    }
  }, [subscribed, toggle, subscribe, pushFilters])

  // Sound handlers
  const updateSound = useCallback((key, value) => {
    setSound((prev) => {
      const next = { ...prev, [key]: value }
      saveSoundSettings(next)
      return next
    })
  }, [])

  const handlePreview = useCallback((key) => {
    SOUND_PREVIEWS[key]?.(sound.volume)
  }, [sound.volume])

  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useLayoutEffect(() => {
    if (open) {
      setVisible(true)
      setClosing(false)
    } else if (visible) {
      setClosing(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setClosing(false)
      }, CLOSE_ANIMATION_MS)
      return () => {
        return clearTimeout(timer)
      }
    }
    return undefined
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps -- only react to open changes

  if (!visible) {
    return null
  }

  const pushDenied = permission === 'denied'

  return (
    <div ref={panelRef} className={clsx(styles.panel, { [styles.closing]: closing }, className)}>
      {/* ── Sound Notifications ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>{'Sound Notifications'}</h3>
          <button
            className={clsx(styles.toggle, { [styles.toggleOn]: sound.enabled })}
            type="button"
            onClick={
() => {
  return updateSound('enabled', !sound.enabled)
}
}>
            {sound.enabled ? 'On' : 'Off'}
          </button>
        </div>

        {
          sound.enabled && (
            <>
              <div className={styles.soundOptions}>
                {
SOUND_OPTIONS.map((item) => {
  return (
    <div key={item.key} className={styles.soundRow}>
      <button
        className={clsx(styles.soundToggle, { [styles.active]: sound[item.key] })}
        type="button"
        onClick={
() => {
  return updateSound(item.key, !sound[item.key])
}
}>
        <FontAwesomeIcon fixedWidth icon={item.icon} />
        {` ${item.label}`}
      </button>
      <button
        aria-label={`Preview ${item.label} sound`}
        className={styles.previewButton}
        disabled={!sound[item.key]}
        type="button"
        onClick={
() => {
  return handlePreview(item.key)
}
}>
        <FontAwesomeIcon fixedWidth icon="play" />
      </button>
    </div>
  )
})
}
              </div>

              <div className={styles.volumeRow}>
                <FontAwesomeIcon fixedWidth icon="volume-low" />
                <input
                  aria-label="Notification volume"
                  className={styles.volumeSlider}
                  max={1}
                  min={0}
                  step={0.1}
                  type="range"
                  value={sound.volume}
                  onChange={
(event) => {
  return updateSound('volume', parseFloat(event.target.value))
}
} />
                <FontAwesomeIcon fixedWidth icon="volume-high" />
              </div>
            </>
          )
        }
      </section>

      {/* ── Push Notifications ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>{'Push Notifications'}</h3>
          {
            pushSupported && pushReady && !pushDenied && (
              <button
                className={clsx(styles.toggle, { [styles.toggleOn]: subscribed })}
                disabled={pushLoading || subscribing}
                type="button"
                onClick={handlePushToggle}>
                {subscribed ? 'On' : 'Off'}
              </button>
            )
          }
        </div>

        {
          !pushSupported && (
            <p className={styles.muted}>{'Not supported in this browser.'}</p>
          )
        }

        {
          pushDenied && (
            <p className={styles.muted}>{'Blocked — check browser notification settings.'}</p>
          )
        }

        {
          pushSupported && !pushDenied && (
            <>
              <div className={styles.filterSection}>
                <div className={styles.filterLabel}>{'Platforms'}</div>
                <div className={styles.filterItems}>
                  {
PLATFORM_OPTIONS.map((item) => {
  return (
    <button
      key={item.key}
      className={clsx(styles.filterChip, { [styles.chipActive]: pushFilters[item.key] })}
      type="button"
      onClick={
() => {
  return handleTogglePushFilter(item.key)
}
}>
      {item.icon && (<FontAwesomeIcon fixedWidth icon={item.icon} />)}
      {` ${item.label}`}
    </button>
  )
})
}
                </div>
              </div>

              {
                pushFilters.pc && (
                  <div className={styles.filterSection}>
                    <div className={styles.filterLabel}>{'PC Game Version'}</div>
                    <div className={styles.filterItems}>
                      {
GAME_VERSION_OPTIONS.map((item) => {
  return (
    <button
      key={item.key}
      className={clsx(styles.filterChip, { [styles.chipActive]: pushFilters[item.key] })}
      type="button"
      onClick={
() => {
  return handleTogglePushFilter(item.key)
}
}>
      {item.label}
    </button>
  )
})
}
                    </div>
                  </div>
                )
              }

              <div className={styles.filterSection}>
                <div className={styles.filterLabel}>{'When to notify'}</div>
                <div className={styles.filterItems}>
                  <button
                    className={clsx(styles.filterChip, { [styles.chipActive]: pushFilters.alertsOnly })}
                    type="button"
                    onClick={
() => {
  return handleTogglePushFilter('alertsOnly')
}
}>
                    {'Dispatch alerts only'}
                  </button>
                  <button
                    className={clsx(styles.filterChip, { [styles.chipActive]: !pushFilters.alertsOnly })}
                    type="button"
                    onClick={
() => {
  return handleTogglePushFilter('alertsOnly')
}
}>
                    {'All new rescues'}
                  </button>
                </div>
              </div>
            </>
          )
        }
      </section>
    </div>
  )
}

NotificationPanel.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}




export default NotificationPanel
