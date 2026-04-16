import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Router from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { FooterPrimary, FooterSecondary, ModalFooter, useModalContext } from '~/components/asModal'
import { login } from '~/store/actions/authentication'
import { listPasskeys } from '~/store/actions/passkeys'
import { getUserProfile } from '~/store/actions/user'
import getResponseError from '~/util/getResponseError'

import styles from './LoginModal.module.scss'
import clsx from 'clsx'


function TotpView () {
  const [{ formData: data, onClose }, setModalState] = useModalContext()
  const dispatch = useDispatch()

  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [useRecoveryCode, setUseRecoveryCode] = useState(false)

  const [webAuthnSupported, setWebAuthnSupported] = useState(false)
  useEffect(() => {
    setWebAuthnSupported(typeof window !== 'undefined' && window.PublicKeyCredential !== undefined)
  }, [])

  const codeIsValid = useRecoveryCode
    ? code.replace(/[^a-f0-9]/giu, '').length === 8
    : code.length === 6

  const handleSubmit = useCallback(async () => {
    if (!codeIsValid) {
      return
    }
    setSubmitting(true)
    setModalState({ error: undefined })

    const loginData = {
      ...data,
      data: {
        ...data.data,
        code,
      },
    }

    const response = await dispatch(login(loginData))

    const error = getResponseError(response)
    if (error) {
      if (error.source?.pointer === '/data/attributes/code') {
        setModalState({
          error: {
            title: 'Invalid Code',
            detail: useRecoveryCode
              ? 'That recovery code is incorrect or has already been used. Try another one.'
              : 'The code you entered is incorrect or expired. Please try again.',
          },
        })
      } else {
        setModalState({ error })
      }
      setCode('')
      setSubmitting(false)
      return
    }

    await dispatch(getUserProfile())

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
  }, [codeIsValid, code, data, dispatch, onClose, setModalState, useRecoveryCode, webAuthnSupported])

  const handleToggleRecovery = useCallback(() => {
    setUseRecoveryCode((prev) => {
      return !prev
    })
    setCode('')
    setModalState({ error: undefined })
  }, [setModalState])

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  const handleBack = useCallback(() => {
    setModalState({ view: 'login', error: undefined })
  }, [setModalState])

  return (
    <div className={clsx(styles.loginForm, 'dialog')}>
      <div className={styles.passkeyPrompt}>
        <FontAwesomeIcon className={styles.passkeyPromptIcon} icon="shield-halved" />
        <h3>{'Two-Factor Authentication'}</h3>
        <p>
          {useRecoveryCode
            ? 'Enter one of your recovery codes.'
            : 'Enter the 6-digit code from your authenticator app.'}
        </p>
        {
          useRecoveryCode
            ? (
              <input
                autoFocus
                className={styles.totpCodeInput}
                disabled={submitting}
                maxLength={9}
                placeholder="xxxx-xxxx"
                type="text"
                value={code}
                onChange={(event) => { return setCode(event.target.value.toLowerCase().replace(/[^a-f0-9-]/giu, '')) }}
                onKeyDown={handleKeyDown} />
            )
            : (
              <input
                autoFocus
                className={styles.totpCodeInput}
                disabled={submitting}
                inputMode="numeric"
                maxLength={6}
                pattern="[0-9]{6}"
                placeholder="000000"
                type="text"
                value={code}
                onChange={(event) => { return setCode(event.target.value.replace(/\D/gu, '')) }}
                onKeyDown={handleKeyDown} />
            )
        }
        <button
          className={clsx(styles.button, 'link')}
          disabled={submitting}
          type="button"
          onClick={handleToggleRecovery}>
          {useRecoveryCode ? 'Use authenticator code instead' : 'Use a recovery code instead'}
        </button>
      </div>

      <ModalFooter className={styles.footer}>
        <FooterSecondary className={styles.secondary}>
          <button
            className={clsx(styles.button, 'secondary')}
            disabled={submitting}
            type="button"
            onClick={handleBack}>
            {'Back'}
          </button>
        </FooterSecondary>

        <FooterPrimary className={styles.primary}>
          <button
            className={clsx(styles.button, 'green')}
            disabled={submitting || !codeIsValid}
            type="button"
            onClick={handleSubmit}>
            {submitting ? 'Verifying...' : 'Verify'}
          </button>
        </FooterPrimary>
      </ModalFooter>
    </div>
  )
}


export default TotpView
