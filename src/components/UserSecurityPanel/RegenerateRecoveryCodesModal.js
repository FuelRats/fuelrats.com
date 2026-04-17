import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import asModal, { ModalContent, ModalFooter } from '~/components/asModal'
import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'
import { regenerateRecoveryCodes } from '~/store/actions/totp'
import friendlyApiError from '~/util/friendlyApiError'
import getResponseError from '~/util/getResponseError'

import RecoveryCodesDisplay from './RecoveryCodesDisplay'
import styles from './UserSecurityPanel.module.scss'




function RegenerateRecoveryCodesModal ({ onClose }) {
  const dispatch = useDispatch()
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [newCodes, setNewCodes] = useState(null)

  const handleSubmit = useCallback(async () => {
    if (!code.trim()) {
      return
    }
    setSubmitting(true)
    setError(null)
    const response = await dispatch(regenerateRecoveryCodes(code.trim()))
    const err = getResponseError(response)
    if (err) {
      setError(err)
      setSubmitting(false)
      return
    }
    setNewCodes(response.payload?.recoveryCodes ?? [])
    setSubmitting(false)
  }, [dispatch, code])

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <ModalContent className="dialog">
      <div className={styles.totpSetup}>
        {
          error && (
            <ApiErrorBox
              error={error}
              renderError={
(err) => {
  return friendlyApiError(err, {
    statusMessages: {
      unauthorized: { detail: 'That code is incorrect. Check your authenticator app and try again.' },
      not_found: { detail: 'Two-factor authentication is not enabled on this account.' },
    },
    fallbackDetail: 'Unable to regenerate recovery codes. Please try again.',
  })
}
} />
          )
        }

        {
          !newCodes && (
            <>
              <p>
                {'Generating new recovery codes will '}
                <strong>{'invalidate all existing codes'}</strong>
                {'. Enter your current authenticator code or an unused recovery code to continue.'}
              </p>
              <div className={styles.totpForm}>
                <input
                  aria-label="Authenticator or recovery code"
                  className={styles.totpInput}
                  disabled={submitting}
                  placeholder="6-digit code or recovery code"
                  type="text"
                  value={code}
                  onChange={
(event) => {
  return setCode(event.target.value)
}
}
                  onKeyDown={handleKeyDown} />
              </div>
            </>
          )
        }

        {
          newCodes && (
            <>
              <h3>{'Your new recovery codes'}</h3>
              <RecoveryCodesDisplay codes={newCodes} />
            </>
          )
        }
      </div>

      <ModalFooter>
        <div className="secondary">
          {
            !newCodes && (
              <button
                className="secondary"
                disabled={submitting}
                type="button"
                onClick={onClose}>
                {'Cancel'}
              </button>
            )
          }
        </div>
        <div className="primary">
          {
            !newCodes && (
              <button
                className="green"
                disabled={submitting || !code.trim()}
                type="button"
                onClick={handleSubmit}>
                {submitting ? 'Generating...' : 'Generate new codes'}
              </button>
            )
          }
          {
            newCodes && (
              <button
                className="green"
                type="button"
                onClick={onClose}>
                {'I\'ve saved my codes'}
              </button>
            )
          }
        </div>
      </ModalFooter>
    </ModalContent>
  )
}




export default asModal({
  className: 'regenerate-recovery-codes-dialog',
  title: 'Regenerate Recovery Codes',
})(RegenerateRecoveryCodesModal)
