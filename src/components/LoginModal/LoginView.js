import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import getResponseError from '~/helpers/getResponseError'
import useForm from '~/hooks/useForm'
import { Router } from '~/routes'
import { login } from '~/store/actions/authentication'
import { getUserProfile } from '~/store/actions/user'

import EmailFieldset from '../Fieldsets/EmailFieldset'
import PasswordFieldset from '../Fieldsets/PasswordFieldset'
import SwitchFieldset from '../Fieldsets/SwitchFieldset'
import { ModalFooter } from '../Modal'
import { useModalContext } from '../Modal/Modal'
import styles from './LoginModal.module.scss'



// Component Constants
const initialData = Object.freeze({
  remember: false,
  data: {
    grant_type: 'password',
    password: '',
    username: '',
  },
})

function LoginView () {
  const [{ formData: data, onClose }, setModalState] = useModalContext()

  const dispatch = useDispatch()
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

    dispatch(getUserProfile())
    onClose()
  }, [dispatch, onClose, setModalState])

  const handleRegisterClick = useCallback(() => {
    onClose()
    Router.pushRoute('register')
  }, [onClose])

  const handleForgotPassword = useCallback(() => {
    setModalState({ error: null, view: 'reset' })
  }, [setModalState])

  const { Form, canSubmit, submitting } = useForm({ data: data ?? initialData, onSubmit })

  return (
    <Form className={[styles.loginForm, 'dialog']}>
      <EmailFieldset
        autoFocus
        required
        aria-label="E-Mail"
        autoComplete="email"
        id="LoginEmail"
        inputClassName="dark"
        name="data.username"
        placeholder="E-Mail" />
      <PasswordFieldset
        required
        aria-label="Password"
        id="LoginPassword"
        inputClassName="dark"
        minLength={8}
        name="data.password"
        placeholder="Password" />
      <SwitchFieldset
        id="LoginRemember"
        label="Remember me"
        name="remember" />

      <ModalFooter className={styles.footer}>
        <div className={styles.secondary}>
          <button
            className={[styles.button, 'secondary']}
            type="button"
            onClick={handleRegisterClick}>
            {'Become a Rat'}
          </button>
        </div>

        <div className={styles.primary}>
          <button className={styles.linkButton} type="button" onClick={handleForgotPassword}>
            {'Forgot password?'}
          </button>
          <button
            className={[styles.button, 'green']}
            disabled={!canSubmit}
            type="submit">
            {submitting ? 'Submitting...' : 'Login'}
          </button>
        </div>
      </ModalFooter>
    </Form>
  )
}


export default LoginView
