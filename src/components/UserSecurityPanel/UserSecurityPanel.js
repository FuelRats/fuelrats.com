import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { isError } from 'flux-standard-action'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import ChangeEmailModal from '~/components/ChangeEmailModal'
import ChangePasswordModal from '~/components/ChangePasswordModal'
import ConfirmActionButton from '~/components/ConfirmActionButton'
import { listPasskeys, registerPasskey, deletePasskey } from '~/store/actions/passkeys'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import getResponseError from '~/util/getResponseError'

import styles from './UserSecurityPanel.module.scss'


function UserSecurityPanel () {
  const dispatch = useDispatch()
  const [passkeys, setPasskeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newPasskeyName, setNewPasskeyName] = useState('')
  const [registering, setRegistering] = useState(false)
  const [showChangeEmail, setShowChangeEmail] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  const fetchPasskeys = useCallback(async () => {
    setLoading(true)
    const response = await dispatch(listPasskeys())
    const err = getResponseError(response)
    if (err) {
      // If forbidden, just show empty list — user may not have permission
      if (err.code === 403) {
        setPasskeys([])
      } else {
        setError(err)
      }
    } else {
      setPasskeys(response.payload?.data ?? [])
    }
    setLoading(false)
  }, [dispatch])

  useEffect(() => {
    fetchPasskeys()
  }, [fetchPasskeys])

  const handleRegister = useCallback(async () => {
    if (!newPasskeyName.trim()) {
      return
    }
    setRegistering(true)
    setError(null)
    const response = await dispatch(registerPasskey(newPasskeyName.trim()))
    if (response && isError(response)) {
      setError(getResponseError(response))
    } else if (response) {
      setNewPasskeyName('')
      await fetchPasskeys()
    }
    setRegistering(false)
  }, [dispatch, fetchPasskeys, newPasskeyName])

  const handleDelete = useCallback(async (event) => {
    const passkeyId = event.target.name
    setError(null)
    const response = await dispatch(deletePasskey(passkeyId))
    const err = getResponseError(response)
    if (err) {
      setError(err)
    } else {
      await fetchPasskeys()
    }
    return true
  }, [dispatch, fetchPasskeys])

  const handleNameKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleRegister()
    }
  }, [handleRegister])

  const [webAuthnSupported, setWebAuthnSupported] = useState(false)
  useEffect(() => {
    setWebAuthnSupported(typeof window !== 'undefined' && window.PublicKeyCredential !== undefined)
  }, [])

  return (
    <div>
      <div className="panel">
        <header>{'Passkeys'}</header>
        <div className={styles.content}>
          {
            error && (
              <div className={styles.error}>
                {error.detail ?? error.title ?? 'An error occurred'}
              </div>
            )
          }

          {
            !webAuthnSupported && (
              <div className={styles.warning}>
                {'Your browser does not support passkeys.'}
              </div>
            )
          }

          {loading && <div className={styles.empty}>{'Loading...'}</div>}

          {
            !loading && passkeys.length === 0 && (
              <div className={styles.empty}>{'No passkeys registered.'}</div>
            )
          }

          {
            !loading && passkeys.length > 0 && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{'Name'}</th>
                    <th>{'Added'}</th>
                    <th>{'Synced'}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {
                    passkeys.map((passkey) => {
                      return (
                        <tr key={passkey.id}>
                          <td>
                            <FontAwesomeIcon fixedWidth icon="key" />
                            {' '}
                            {passkey.attributes.name}
                          </td>
                          <td className={styles.date}>
                            {formatAsEliteDateTime(passkey.attributes.createdAt)}
                          </td>
                          <td>
                            {
                              passkey.attributes.backedUp
                                ? <FontAwesomeIcon className={styles.synced} icon="circle-check" title="Synced" />
                                : <FontAwesomeIcon className={styles.notSynced} icon="circle-xmark" title="Not synced" />
                            }
                          </td>
                          <td>
                            <ConfirmActionButton
                              className="icon"
                              confirmButtonText={`Delete passkey '${passkey.attributes.name}'`}
                              confirmSubText=""
                              denyButtonText="Cancel"
                              name={passkey.id}
                              onConfirm={handleDelete}
                              onConfirmText="">
                              <FontAwesomeIcon fixedWidth icon="trash" title="Delete passkey" />
                            </ConfirmActionButton>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            )
          }

          {
            webAuthnSupported && (
              <div className={styles.addPasskey}>
                <input
                  className={styles.nameInput}
                  disabled={registering}
                  placeholder="Passkey name (e.g. MacBook, iPhone)"
                  type="text"
                  value={newPasskeyName}
                  onChange={(event) => { return setNewPasskeyName(event.target.value) }}
                  onKeyDown={handleNameKeyDown} />
                <button
                  className="green"
                  disabled={registering || !newPasskeyName.trim()}
                  type="button"
                  onClick={handleRegister}>
                  <FontAwesomeIcon fixedWidth icon="plus" />
                  {registering ? ' Registering...' : ' Add Passkey'}
                </button>
              </div>
            )
          }
        </div>
      </div>

      <div className={styles.accountActions}>
        <button
          type="button"
          onClick={() => { return setShowChangeEmail(true) }}>
          {'Change E-Mail'}
        </button>
        <button
          type="button"
          onClick={() => { return setShowChangePassword(true) }}>
          {'Change Password'}
        </button>
      </div>

      <ChangeEmailModal
        isOpen={showChangeEmail}
        onClose={() => { return setShowChangeEmail(false) }} />
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => { return setShowChangePassword(false) }} />
    </div>
  )
}


export default UserSecurityPanel
