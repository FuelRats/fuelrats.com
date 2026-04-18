import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import Router from 'next/router'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import { FooterPrimary, FooterSecondary, ModalFooter, useModalContext } from '~/components/asModal'
import { registerPasskey } from '~/store/actions/passkeys'
import getResponseError from '~/util/getResponseError'

import styles from './LoginModal.module.scss'


function PasskeyPromptView () {
  const [{ onClose }, setModalState] = useModalContext()
  const dispatch = useDispatch()

  const [registering, setRegistering] = useState(false)
  const [name, setName] = useState('')

  const handleDismiss = useCallback(() => {
    localStorage.setItem('fr.passkeyPromptDismissed', '1')
    onClose()
    Router.push('/profile/overview')
  }, [onClose])

  const handleRegister = useCallback(async () => {
    const passkeyName = name.trim() || 'My Passkey'
    setRegistering(true)
    const response = await dispatch(registerPasskey(passkeyName))

    if (response && getResponseError(response)) {
      setModalState({ error: getResponseError(response) })
      setRegistering(false)
      return
    }

    if (response) {
      onClose()
      Router.push('/profile/overview')
    }

    setRegistering(false)
  }, [dispatch, name, onClose, setModalState])

  const handleNameKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleRegister()
    }
  }, [handleRegister])

  return (
    <div className={clsx(styles.loginForm, 'dialog')}>
      <div className={styles.passkeyPrompt}>
        <FontAwesomeIcon className={styles.passkeyPromptIcon} icon="key" />
        <h3>{'Set up a passkey?'}</h3>
        <p>
          {'Passkeys let you sign in quickly and securely using your device\'s biometrics or screen lock — no password needed.'}
        </p>
        <input
          aria-label="Passkey name"
          className={styles.passkeyNameInput}
          disabled={registering}
          placeholder="Passkey name (e.g. MacBook, iPhone)"
          type="text"
          value={name}
          onChange={
(event) => {
  return setName(event.target.value)
}
}
          onKeyDown={handleNameKeyDown} />
      </div>

      <ModalFooter className={styles.footer}>
        <FooterSecondary className={styles.secondary}>
          <button
            className={clsx(styles.button, 'secondary')}
            disabled={registering}
            type="button"
            onClick={handleDismiss}>
            {'Not now'}
          </button>
        </FooterSecondary>

        <FooterPrimary className={styles.primary}>
          <button
            className={clsx(styles.button, 'green')}
            disabled={registering}
            type="button"
            onClick={handleRegister}>
            <FontAwesomeIcon fixedWidth icon="key" />
            {registering ? ' Setting up...' : ' Add passkey'}
          </button>
        </FooterPrimary>
      </ModalFooter>
    </div>
  )
}


export default PasskeyPromptView
