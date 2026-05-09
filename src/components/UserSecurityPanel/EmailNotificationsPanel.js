import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import Switch from '~/components/Switch'
import { getMemoMail, setMemoMail } from '~/store/actions/memoMail'
import getResponseError from '~/util/getResponseError'

import styles from './UserSecurityPanel.module.scss'


function EmailNotificationsPanel () {
  const dispatch = useDispatch()
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch () {
      const response = await dispatch(getMemoMail())
      const err = getResponseError(response)
      if (!err) {
        setEnabled(response.payload?.data?.attributes?.enabled ?? false)
      }
      setLoading(false)
    }
    fetch()
  }, [dispatch])

  const handleToggle = useCallback(async () => {
    const newValue = !enabled
    const response = await dispatch(setMemoMail(newValue))
    const err = getResponseError(response)
    if (!err) {
      setEnabled(response.payload?.data?.attributes?.enabled ?? newValue)
    }
  }, [dispatch, enabled])

  return (
    <div className="panel">
      <header>{'Email Notifications'}</header>
      <div className={styles.content}>
        <p className={styles.emailNotifDescription}>
          {'Choose which events you want to be notified about via email.'}
        </p>
        {
          loading
            ? <div className={styles.empty}>{'Loading...'}</div>
            : (
              <Switch
                checked={enabled}
                id="memoMail"
                label="IRC messages received while offline"
                onChange={handleToggle} />
            )
        }
      </div>
    </div>
  )
}


export default EmailNotificationsPanel
