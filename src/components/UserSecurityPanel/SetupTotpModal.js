import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { QRCodeSVG } from 'qrcode.react'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import asModal, { ModalContent, ModalFooter } from '~/components/asModal'
import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'
import { generateTotpSecret, linkTotp } from '~/store/actions/totp'
import friendlyApiError from '~/util/friendlyApiError'
import getResponseError from '~/util/getResponseError'

import styles from './UserSecurityPanel.module.scss'


function SetupTotpModal ({ onClose }) {
  const dispatch = useDispatch()
  const [step, setStep] = useState('loading')
  const [secret, setSecret] = useState(null)
  const [dataUri, setDataUri] = useState(null)
  const [token, setToken] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchSecret = async () => {
      const response = await dispatch(generateTotpSecret())
      const err = getResponseError(response)
      if (err) {
        setError(err)
        setStep('error')
        return
      }
      const attrs = response.payload?.data?.attributes
      setSecret(attrs?.secret)
      setDataUri(attrs?.dataUri)
      setStep('scan')
    }
    fetchSecret()
  }, [dispatch])

  const handleSubmit = useCallback(async () => {
    if (token.length !== 6) {
      return
    }
    setSubmitting(true)
    setError(null)
    const response = await dispatch(linkTotp(secret, token, description || 'Authenticator App'))
    const err = getResponseError(response)
    if (err) {
      setError(err)
      setSubmitting(false)
      return
    }
    setStep('success')
    setSubmitting(false)
  }, [dispatch, secret, token, description])

  const handleTokenKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <ModalContent className="dialog no-pad">
      <div className={styles.totpSetup}>
        {
          error && (
            <ApiErrorBox
              error={error}
              renderError={(err) => {
                return friendlyApiError(err, {
                  pointerMessages: {
                    '/data/attributes/token': { detail: 'That code is incorrect. Double-check your authenticator app and try again.' },
                    '/data/attributes/secret': { detail: 'Setup session expired. Please close this dialog and try again.' },
                  },
                  statusMessages: {
                    conflict: { detail: 'Two-factor authentication is already enabled on this account.' },
                  },
                  fallbackDetail: 'Unable to complete setup. Please try again.',
                })
              }} />
          )
        }

        {step === 'loading' && <div className={styles.empty}>{'Generating secret...'}</div>}

        {
          step === 'scan' && (
            <>
              <p>{'Scan this QR code with your authenticator app:'}</p>
              {
                dataUri && (
                  <div className={styles.qrCode}>
                    <QRCodeSVG bgColor="transparent" fgColor="currentColor" size={200} value={dataUri} />
                  </div>
                )
              }
              <details className={styles.secretDetails}>
                <summary>{'Can\'t scan? Enter this key manually:'}</summary>
                <code className={styles.secretKey}>{secret}</code>
              </details>

              <div className={styles.totpForm}>
                <input
                  autoFocus
                  className={styles.totpInput}
                  disabled={submitting}
                  inputMode="numeric"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  placeholder="6-digit code"
                  type="text"
                  value={token}
                  onChange={(event) => { return setToken(event.target.value.replace(/\D/gu, '')) }}
                  onKeyDown={handleTokenKeyDown} />
                <input
                  className={styles.descriptionInput}
                  disabled={submitting}
                  placeholder="Description (e.g. Google Authenticator)"
                  type="text"
                  value={description}
                  onChange={(event) => { return setDescription(event.target.value) }} />
              </div>
            </>
          )
        }

        {
          step === 'success' && (
            <div className={styles.successMessage}>
              <FontAwesomeIcon className={styles.successIcon} icon="circle-check" />
              <h3>{'Two-factor authentication enabled'}</h3>
              <p>{'Your account is now protected with an authenticator app.'}</p>
            </div>
          )
        }

        {step === 'error' && !error && <div className={styles.empty}>{'Failed to generate secret. Please try again.'}</div>}
      </div>

      <ModalFooter>
        <div className="secondary" />
        <div className="primary">
          {
            step === 'scan' && (
              <button
                className="green"
                disabled={submitting || token.length !== 6}
                type="button"
                onClick={handleSubmit}>
                {submitting ? 'Verifying...' : 'Verify & Enable'}
              </button>
            )
          }
          {
            step === 'success' && (
              <button
                className="green"
                type="button"
                onClick={onClose}>
                {'Done'}
              </button>
            )
          }
        </div>
      </ModalFooter>
    </ModalContent>
  )
}


export default asModal({
  className: 'setup-totp-dialog',
  title: 'Set Up Two-Factor Authentication',
})(SetupTotpModal)
