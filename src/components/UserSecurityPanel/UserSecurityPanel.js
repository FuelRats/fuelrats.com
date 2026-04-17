import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { isError } from 'flux-standard-action'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ChangeEmailModal from '~/components/ChangeEmailModal'
import ChangePasswordModal from '~/components/ChangePasswordModal'
import ConfirmActionButton from '~/components/ConfirmActionButton'
import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'
import { listPasskeys, registerPasskey, deletePasskey } from '~/store/actions/passkeys'
import { removeTotp } from '~/store/actions/totp'
import { getUserProfile } from '~/store/actions/user'
import { selectCurrentUserId, selectSessionToken, selectUserById, withCurrentUserId } from '~/store/selectors'
import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'
import friendlyApiError from '~/util/friendlyApiError'
import getResponseError from '~/util/getResponseError'

import ActiveSessionsPanel from './ActiveSessionsPanel'
import PushSubscriptionsPanel from './PushSubscriptionsPanel'
import RegenerateRecoveryCodesModal from './RegenerateRecoveryCodesModal'
import SetupTotpModal from './SetupTotpModal'
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
  const [showTotpSetup, setShowTotpSetup] = useState(false)
  const [showRegenerateCodes, setShowRegenerateCodes] = useState(false)
  const [removeTotpCode, setRemoveTotpCode] = useState('')
  const [removingTotp, setRemovingTotp] = useState(false)

  const userId = useSelector(selectCurrentUserId)
  const token = useSelector(selectSessionToken)
  const user = useSelector(withCurrentUserId(selectUserById))
  const hasTotp = Boolean(user?.relationships?.authenticator?.data)

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

  const handleRemoveTotp = useCallback(async () => {
    if (removeTotpCode.length !== 6) {
      return
    }
    setRemovingTotp(true)
    setError(null)
    const response = await dispatch(removeTotp(removeTotpCode))
    const err = getResponseError(response)
    if (err) {
      setError(err)
    } else {
      setRemoveTotpCode('')
      await dispatch(getUserProfile())
    }
    setRemovingTotp(false)
    return true
  }, [dispatch, removeTotpCode])

  const handleTotpSetupClose = useCallback(() => {
    setShowTotpSetup(false)
    dispatch(getUserProfile())
  }, [dispatch])

  const [downloadingCert, setDownloadingCert] = useState(false)

  const handleDownloadCertificate = useCallback(async () => {
    setDownloadingCert(true)
    setError(null)
    try {
      const response = await fetch(`/api/fr/users/${userId}/certificate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify({ data: { type: 'certificate-requests', attributes: {} } }),
      })
      if (!response.ok) {
        const errData = await response.json().catch(() => { return null })
        setError(errData?.errors?.[0] ?? {
          status: 'internal_server',
          title: 'Certificate Error',
          detail: 'Failed to generate certificate.',
        })
        setDownloadingCert(false)
        return
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'FuelRats-IRC.pem'
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setError({
        status: 'internal_server',
        title: 'Certificate Error',
        detail: 'Failed to download certificate. Please check your connection and try again.',
      })
    }
    setDownloadingCert(false)
  }, [userId, token])

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
              <ApiErrorBox
                error={error}
                renderError={(err) => {
                  return friendlyApiError(err, {
                    statusMessages: {
                      conflict: { detail: 'This passkey is already registered on an account.' },
                      unprocessable_entity: { detail: 'Passkey verification failed. Please try again.' },
                    },
                    fallbackDetail: 'Something went wrong. Please try again.',
                  })
                }} />
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

      <div className="panel">
        <header>{'Two-Factor Authentication'}</header>
        <div className={styles.content}>
          {
            hasTotp
              ? (
                <div className={styles.totpEnabled}>
                  <div className={styles.totpStatus}>
                    <FontAwesomeIcon className={styles.synced} icon="circle-check" />
                    {' Two-factor authentication is enabled'}
                  </div>
                  <div className={styles.totpActions}>
                    <button
                      type="button"
                      onClick={() => { return setShowRegenerateCodes(true) }}>
                      <FontAwesomeIcon fixedWidth icon="key" />
                      {' Regenerate recovery codes'}
                    </button>
                  </div>
                  <div className={styles.totpRemove}>
                    <input
                      disabled={removingTotp}
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      placeholder="Enter 6-digit code to disable"
                      type="text"
                      value={removeTotpCode}
                      onChange={(event) => { return setRemoveTotpCode(event.target.value.replace(/\D/gu, '')) }} />
                    <button
                      className="secondary"
                      disabled={removingTotp || removeTotpCode.length !== 6}
                      type="button"
                      onClick={handleRemoveTotp}>
                      {removingTotp ? 'Removing...' : 'Disable 2FA'}
                    </button>
                  </div>
                </div>
              )
              : (
                <div className={styles.totpDisabled}>
                  <p>{'Add an extra layer of security by requiring a code from an authenticator app when you log in.'}</p>
                  <button
                    type="button"
                    onClick={() => { return setShowTotpSetup(true) }}>
                    {'Enable Two-Factor Authentication'}
                  </button>
                </div>
              )
          }
        </div>
      </div>

      <SetupTotpModal
        isOpen={showTotpSetup}
        onClose={handleTotpSetupClose} />

      <RegenerateRecoveryCodesModal
        isOpen={showRegenerateCodes}
        onClose={() => { return setShowRegenerateCodes(false) }} />

      <PushSubscriptionsPanel />

      <ActiveSessionsPanel />

      <div className="panel">
        <header>{'IRC Certificate'}</header>
        <div className={styles.content}>
          <p className={styles.certDescription}>
            {'Download an SSL client certificate for connecting to IRC. This certificate identifies you to NickServ automatically.'}
          </p>
          <button
            disabled={downloadingCert}
            type="button"
            onClick={handleDownloadCertificate}>
            <FontAwesomeIcon fixedWidth icon="shield-halved" />
            {downloadingCert ? ' Generating...' : ' Download IRC Certificate'}
          </button>
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
