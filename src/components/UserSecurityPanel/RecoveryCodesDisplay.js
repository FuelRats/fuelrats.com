import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'

import styles from './UserSecurityPanel.module.scss'




/**
 * Shows the one-time recovery codes returned by the API after TOTP setup
 * or regeneration. Users can copy them to the clipboard or download a
 * .txt file so they have them saved before dismissing the dialog.
 */
function RecoveryCodesDisplay ({ codes }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codes.join('\n'))
      setCopied(true)
      setTimeout(() => { return setCopied(false) }, 2000)
    } catch {
      // Fallback: nothing — user can still manually copy from the list
    }
  }, [codes])

  const handleDownload = useCallback(() => {
    const content = [
      'Fuel Rats — Two-Factor Authentication Recovery Codes',
      '',
      'Keep these codes somewhere safe. Each code can be used once',
      'to log in if you lose access to your authenticator app.',
      '',
      ...codes,
      '',
    ].join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'fuelrats-recovery-codes.txt'
    link.click()
    URL.revokeObjectURL(url)
  }, [codes])

  return (
    <div className={styles.recoveryCodes}>
      <div className={styles.recoveryCodesWarning}>
        <FontAwesomeIcon icon="triangle-exclamation" />
        <span>
          {'Save these recovery codes now. You won\'t see them again. Each code can be used once if you lose access to your authenticator app.'}
        </span>
      </div>

      <ul className={styles.recoveryCodesList}>
        {codes.map((code) => {
          return (<li key={code}><code>{code}</code></li>)
        })}
      </ul>

      <div className={styles.recoveryCodesActions}>
        <button type="button" onClick={handleCopy}>
          <FontAwesomeIcon fixedWidth icon={copied ? 'clipboard-check' : 'clipboard-list'} />
          {copied ? ' Copied' : ' Copy codes'}
        </button>
        <button type="button" onClick={handleDownload}>
          <FontAwesomeIcon fixedWidth icon="download" />
          {' Download as .txt'}
        </button>
      </div>
    </div>
  )
}

RecoveryCodesDisplay.propTypes = {
  codes: PropTypes.arrayOf(PropTypes.string).isRequired,
}




export default RecoveryCodesDisplay
