import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import EmailFieldset from '~/components/Fieldsets/EmailFieldset'
import MessageBox from '~/components/MessageBox'
import { FooterPrimary, FooterSecondary, ModalFooter, useModalContext } from '~/components/Modal'
import getResponseError from '~/helpers/getResponseError'
import useForm from '~/hooks/useForm'
import useMountedState from '~/hooks/useMountedState'
import { sendPasswordResetEmail } from '~/store/actions/authentication'

import styles from './LoginModal.module.scss'



// Component Constants
const data = {
  type: 'resets',
  attributes: {
    email: '',
  },
}




function ResetView (props) {
  const {
    className,
  } = props
  const [{ error, resetSubmitted }, setModalState] = useModalContext()

  useMountedState(setModalState, { title: 'Reset Password' })

  const dispatch = useDispatch()
  const onSubmit = useCallback(async (formData) => {
    const response = await dispatch(sendPasswordResetEmail(formData))
    setModalState({ error: getResponseError(response), resetSubmitted: true })
  }, [dispatch, setModalState])

  const { Form, canSubmit, submitting } = useForm({ data, onSubmit })

  const handleReturnClick = useCallback(() => {
    setModalState({ view: 'login' })
  }, [setModalState])

  return (
    <Form className={[styles.loginForm, 'dialog', className]}>
      {
        !error && (
          <MessageBox className={styles.errorBox} title={resetSubmitted ? 'Incoming Message' : undefined} type="info">
            {
              resetSubmitted
                ? 'If there is an account associated with this address then a message will be sent to you shortly. Be sure to check your spam!'
                : 'Input your E-Mail in the field below.'
            }
          </MessageBox>
        )
      }
      <EmailFieldset
        dark
        required
        aria-label="E-Mail"
        autoComplete="email"
        id="ResetEmail"
        name="attributes.email"
        placeholder="E-Mail" />

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

ResetView.propTypes = {
  className: PropTypes.string,
}





export default ResetView
