import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Router from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { FooterPrimary, FooterSecondary, ModalFooter, useModalContext } from '~/components/asModal'
import EmailFieldset from '~/components/Fieldsets/EmailFieldset'
import PasswordFieldset from '~/components/Fieldsets/PasswordFieldset'
import SwitchFieldset from '~/components/Fieldsets/SwitchFieldset'
import useForm from '~/hooks/useForm'
import { login } from '~/store/actions/authentication'
import { listPasskeys, loginWithPasskey, registerPasskey } from '~/store/actions/passkeys'
import { getUserProfile } from '~/store/actions/user'
import getResponseError from '~/util/getResponseError'

import styles from './LoginModal.module.scss'





// Component Constants
const initialData = {
  remember: false,
  data: {
    password: '',
    username: '',
  },
}

function LoginView () {
  const [{ formData: data, onClose }, setModalState] = useModalContext()

  const dispatch = useDispatch()

  const [webAuthnSupported, setWebAuthnSupported] = useState(false)
  useEffect(() => {
    setWebAuthnSupported(typeof window !== 'undefined' && window.PublicKeyCredential !== undefined)
  }, [])

  const onSubmit = useCallback(async (formData) => {
    setModalState({ error: undefined })

    const response = await dispatch(login(formData))

    const error = getResponseError(response)
    if (error) {
      const nextState = { error, formData }

      if (error.status === 'verification_required') {
        nextState.view = 'verify'
      }

      setModalState(nextState)
      return
    }

    await dispatch(getUserProfile())

    // Check if user should be prompted to add a passkey
    if (webAuthnSupported && !localStorage.getItem('fr.passkeyPromptDismissed')) {
      const passkeyResponse = await dispatch(listPasskeys())
      const passkeys = passkeyResponse?.payload?.data ?? []
      if (passkeys.length === 0) {
        setModalState({ view: 'passkey-prompt' })
        return
      }
    }

    onClose()
    Router.push('/profile/overview')
  }, [dispatch, onClose, setModalState, webAuthnSupported])

  const handleRegisterClick = useCallback(() => {
    onClose()
    Router.push('/register')
  }, [onClose])

  const handleForgotPassword = useCallback(() => {
    setModalState({ error: null, view: 'reset' })
  }, [setModalState])

  const [passkeyLoading, setPasskeyLoading] = useState(false)
  const handlePasskeyLogin = useCallback(async () => {
    setModalState({ error: undefined })
    setPasskeyLoading(true)

    const emailInput = document.getElementById('LoginEmail')
    const email = emailInput?.value || undefined

    const response = await dispatch(loginWithPasskey(email))

    if (!response) {
      // User cancelled the passkey prompt
      setPasskeyLoading(false)
      return
    }

    const error = getResponseError(response)
    if (error) {
      setModalState({ error })
      setPasskeyLoading(false)
      return
    }

    dispatch(getUserProfile())
    onClose()
    Router.push('/profile/overview')
  }, [dispatch, onClose, setModalState])

  const { Form, canSubmit, submitting } = useForm({ data: data ?? initialData, onSubmit })

  return (
    <Form className={[styles.loginForm, 'dialog']}>
      <EmailFieldset
        autoFocus
        dark
        required
        aria-label="E-Mail"
        autoComplete="email"
        id="LoginEmail"
        name="data.username"
        placeholder="E-Mail" />
      <PasswordFieldset
        dark
        required
        aria-label="Password"
        id="LoginPassword"
        minLength={8}
        name="data.password"
        placeholder="Password" />
      <SwitchFieldset
        id="LoginRemember"
        label="Remember me"
        name="remember" />

      {
        webAuthnSupported && (
          <div className={styles.passkeySection}>
            <div className={styles.divider}>
              <span>{'or'}</span>
            </div>
            <button
              className={[styles.passkeyButton]}
              disabled={passkeyLoading || submitting}
              type="button"
              onClick={handlePasskeyLogin}>
              <FontAwesomeIcon fixedWidth icon="key" />
              {passkeyLoading ? ' Waiting for passkey...' : ' Sign in with passkey'}
            </button>
          </div>
        )
      }

      <ModalFooter className={styles.footer}>
        <FooterSecondary className={styles.secondary}>
          <button
            className={[styles.button, 'secondary']}
            type="button"
            onClick={handleRegisterClick}>
            {'Become a Rat'}
          </button>
        </FooterSecondary>

        <FooterPrimary className={styles.primary}>
          <button className={styles.linkButton} type="button" onClick={handleForgotPassword}>
            {'Forgot password?'}
          </button>
          <button
            className={[styles.button, 'green']}
            disabled={!canSubmit}
            type="submit">
            {submitting ? 'Submitting...' : 'Login'}
          </button>
        </FooterPrimary>
      </ModalFooter>
    </Form>
  )
}


export default LoginView
