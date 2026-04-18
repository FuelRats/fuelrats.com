import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { UAParser } from 'ua-parser-js'

import ConfirmActionButton from '~/components/ConfirmActionButton'
import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'
import { listSessions, revokeSession, revokeAllSessions } from '~/store/actions/sessions'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import friendlyApiError from '~/util/friendlyApiError'
import getResponseError from '~/util/getResponseError'

import styles from './UserSecurityPanel.module.scss'




const MS_IN_SECOND = 1000
const MS_IN_MINUTE = 60 * MS_IN_SECOND
const MS_IN_HOUR = 60 * MS_IN_MINUTE
const MS_IN_DAY = 24 * MS_IN_HOUR
const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })


function formatLastSeen (value) {
  if (!value) {
    return '—'
  }
  const elapsed = Date.now() - new Date(value).getTime()
  if (elapsed < 0 || elapsed >= MS_IN_DAY * 2) {
    return formatAsEliteDateTime(value)
  }
  if (elapsed < MS_IN_MINUTE) {
    return 'just now'
  }
  if (elapsed < MS_IN_HOUR) {
    return relativeFormatter.format(-Math.floor(elapsed / MS_IN_MINUTE), 'minute')
  }
  if (elapsed < MS_IN_DAY) {
    return relativeFormatter.format(-Math.floor(elapsed / MS_IN_HOUR), 'hour')
  }
  return relativeFormatter.format(-Math.floor(elapsed / MS_IN_DAY), 'day')
}


function describeDevice (userAgent) {
  if (!userAgent) {
    return { label: 'Unknown device', icon: 'circle-question' }
  }
  const parsed = new UAParser(userAgent).getResult()
  const browser = parsed.browser?.name
  const os = parsed.os?.name
  const deviceType = parsed.device?.type

  let label = 'Unknown device'
  if (browser && os) {
    label = `${browser} on ${os}`
  } else if (browser) {
    label = browser
  } else if (os) {
    label = os
  } else {
    label = userAgent.split(' ')[0] || 'Unknown device'
  }

  let icon = 'desktop'
  if (deviceType === 'mobile' || deviceType === 'tablet') {
    icon = 'mobile-screen'
  }
  return { label, icon }
}


function ActiveSessionsPanel () {
  const dispatch = useDispatch()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [revokingIds, setRevokingIds] = useState(() => {
    return new Set()
  })
  const [signingOutAll, setSigningOutAll] = useState(false)

  const fetchSessions = useCallback(async () => {
    setLoading(true)
    setError(null)
    const response = await dispatch(listSessions())
    const err = getResponseError(response)
    if (err) {
      setError(err)
      setSessions([])
    } else {
      setSessions(response.payload?.data ?? [])
    }
    setLoading(false)
  }, [dispatch])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handleRevoke = useCallback(async (event) => {
    const sessionId = event.target.name
    setRevokingIds((prev) => {
      const next = new Set(prev)
      next.add(sessionId)
      return next
    })
    setError(null)
    const response = await dispatch(revokeSession(sessionId))
    const err = getResponseError(response)
    if (err) {
      setError(err)
    } else {
      setSessions((prev) => {
        return prev.filter((session) => {
          return session.id !== sessionId
        })
      })
    }
    setRevokingIds((prev) => {
      const next = new Set(prev)
      next.delete(sessionId)
      return next
    })
    return true
  }, [dispatch])

  const otherSessions = useMemo(() => {
    return sessions.filter((session) => {
      return !session.meta?.current
    })
  }, [sessions])

  const handleSignOutEverywhere = useCallback(async () => {
    setSigningOutAll(true)
    setError(null)
    const response = await dispatch(revokeAllSessions())
    const err = getResponseError(response)
    if (err) {
      setError(err)
    }
    await fetchSessions()
    setSigningOutAll(false)
  }, [dispatch, fetchSessions])

  return (
    <div className="panel">
      <header>{'Active Sessions'}</header>
      <div className={styles.content}>
        {
          error && (
            <ApiErrorBox
              error={error}
              renderError={
(err) => {
  return friendlyApiError(err, {
    fallbackDetail: 'Unable to load sessions. Please try again.',
  })
}
} />
          )
        }

        {loading && <div className={styles.empty}>{'Loading sessions...'}</div>}

        {
          !loading && sessions.length === 0 && !error && (
            <div className={styles.empty}>{'No active sessions found.'}</div>
          )
        }

        {
          !loading && sessions.length > 0 && (
            <ul className={styles.sessionsList}>
              {
sessions.map((session) => {
  const {
    userAgent, ipAddress, lastAccess, createdAt, authMethod,
  } = session.attributes
  const isCurrent = session.meta?.current
  const device = describeDevice(userAgent)
  const isRevoking = revokingIds.has(session.id)
  return (
    <li key={session.id} className={styles.sessionItem}>
      <FontAwesomeIcon fixedWidth className={styles.sessionIcon} icon={device.icon} />
      <div className={styles.sessionInfo}>
        <div className={styles.sessionLabel}>
          {device.label}
          {isCurrent && (<span className={styles.currentBadge}>{'This device'}</span>)}
        </div>
        <div className={styles.sessionMeta}>
          {authMethod && (<span>{authMethod === 'passkey' ? 'via passkey' : `via ${authMethod}`}</span>)}
          {ipAddress && (<span title={`IP: ${ipAddress}`}>{ipAddress}</span>)}
          {
lastAccess && (
  <span title={formatAsEliteDateTime(lastAccess)}>
    {'Last seen '}{formatLastSeen(lastAccess)}
  </span>
)
}
          {
createdAt && (
  <span title={formatAsEliteDateTime(createdAt)}>
    {'Signed in '}{formatLastSeen(createdAt)}
  </span>
)
}
        </div>
      </div>
      {
                      !isCurrent && (
                        <ConfirmActionButton
                          className="compact"
                          confirmButtonText={`Revoke session from ${device.label}`}
                          confirmSubText="Revoke?"
                          denyButtonText="Cancel"
                          disabled={isRevoking}
                          name={session.id}
                          onConfirm={handleRevoke}
                          onConfirmText="Revoking...">
                          {'Revoke'}
                        </ConfirmActionButton>
                      )
                    }
    </li>
  )
})
}
            </ul>
          )
        }

        {
          otherSessions.length > 0 && (
            <div className={styles.sessionsActions}>
              <button
                className="secondary"
                disabled={signingOutAll}
                type="button"
                onClick={handleSignOutEverywhere}>
                {signingOutAll ? 'Signing out...' : 'Sign out everywhere else'}
              </button>
            </div>
          )
        }
      </div>
    </div>
  )
}




export default ActiveSessionsPanel
