import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { FooterPrimary, FooterSecondary, ModalFooter, useModalContext } from '~/components/asModal'
import LoginTokenFieldset from '~/components/Fieldsets/LoginTokenFieldset'
import useForm from '~/hooks/useForm'
import useMountedState from '~/hooks/useMountedState'
import useUnloadConfirmation from '~/hooks/useUnloadConfirmation'
import { login } from '~/store/actions/authentication'
import { getUserProfile } from '~/store/actions/user'
import getResponseError from '~/util/getResponseError'

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
        dark
        required
        aria-label="Login verification token"
        id="LoginToken"
        name="data.verify"
        placeholder="Verification Token" />

      <ModalFooter className={styles.footer}>
        <FooterSecondary className={styles.secondary}>
          <button
            className={[styles.button, 'secondary']}
            type="button"
            onClick={handleReturnClick}>
            {'Return'}
          </button>
        </FooterSecondary>

        <FooterPrimary className={styles.primary}>
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

VerifyView.propTypes = {
  className: PropTypes.string,
}





export default VerifyView
