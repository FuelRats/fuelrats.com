import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import getResponseError from '~/helpers/getResponseError'
import useForm from '~/hooks/useForm'
import useMountedState from '~/hooks/useMountedState'
import useUnloadConfirmation from '~/hooks/useUnloadConfirmation'
import { login } from '~/store/actions/authentication'
import { getUserProfile } from '~/store/actions/user'

import LoginTokenFieldset from '../Fieldsets/LoginTokenFieldset'
import { ModalFooter } from '../Modal'
import { useModalContext } from '../Modal/Modal'
import styles from './LoginModal.module.scss'




function VerifyView (props) {
  const {
    className,
  } = props


  const [{ formData: data = {}, onClose }, setModalState] = useModalContext()

  // Measures to prevent user from moving away from verify screen.
  useMountedState(setModalState, { hideClose: true })
  useUnloadConfirmation('Leaving this page will require you to begin the login process again. Are you sure you wish to leave?')


  const dispatch = useDispatch()

  const onSubmit = useCallback(async (formData) => {
    const response = await dispatch(login(formData))

    const error = getResponseError(response)
    if (error) {
      setModalState({ error })
      return
    }

    dispatch(getUserProfile())
    onClose()
  }, [dispatch, onClose, setModalState])

  const { Form, canSubmit, submitting } = useForm({ data, onSubmit })

  const handleReturnClick = useCallback(() => {
    setModalState({ view: 'login' })
  }, [setModalState])

  return (
    <Form className={[styles.loginForm, 'dialog', className]}>
      <LoginTokenFieldset
        required
        aria-label="Login Verification token from E-Mail"
        id="LoginToken"
        inputClassName="dark"
        name="data.verify"
        placeholder="Verification Token" />

      <ModalFooter className={styles.footer}>
        <div className={styles.secondary}>
          <button
            className={[styles.button, 'secondary']}
            type="button"
            onClick={handleReturnClick}>
            {'Return'}
          </button>
        </div>

        <div className={styles.primary}>
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

VerifyView.propTypes = {
  className: PropTypes.string,
}





export default VerifyView
