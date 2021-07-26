import { useCallback } from 'react'

import useToggleState from '~/hooks/useToggleState'

import asModal, { ModalContent, ModalFooter } from '../asModal'
import WordpressPage from '../WordpressPage'
import styles from './TermsModal.module.scss'




function TermsModal (props) {
  const {
    checkboxLabel,
    onAccept,
    slug,
    title,
  } = props

  const [termsAccepted, toggleTermsAccepted] = useToggleState(false)
  const handleTermsToggle = useCallback(() => {
    toggleTermsAccepted()
  }, [toggleTermsAccepted])

  const handleAcceptTerms = useCallback(() => {
    if (termsAccepted) {
      onAccept?.()
    }
  }, [onAccept, termsAccepted])

  const checkboxId = `TermsDialog-${title.replace(/\s/gu, '')}-checkbox`

  return (
    <>
      <ModalContent className={[styles.content]}>
        <WordpressPage slug={slug} />
      </ModalContent>
      <ModalFooter>
        <div className="secondary" />
        <div className="primary">
          <span key="AgreeCheckbox">
            <input
              aria-label={checkboxLabel}
              checked={termsAccepted}
              className="large"
              id={checkboxId}
              type="checkbox"
              onChange={handleTermsToggle} />
            <label htmlFor={checkboxId}>{checkboxLabel}</label>
          </span>
          <button
            key="NextButton"
            disabled={!termsAccepted}
            type="button"
            onClick={handleAcceptTerms}>
            {'Next'}
          </button>
        </div>
      </ModalFooter>
    </>
  )
}





export default asModal({
  className: 'terms-dialog',
})(TermsModal)
